"""Document storage abstraction — local & S3-compatible (Backblaze B2)."""

from __future__ import annotations

import abc
import logging
from io import BytesIO
from pathlib import Path

import aiofiles
import aioboto3

from app.core.config import settings

logger = logging.getLogger(__name__)


class StorageBackend(abc.ABC):
    @abc.abstractmethod
    async def save(self, key: str, data: bytes) -> str:
        """Persist ``data`` and return the storage path / URL."""
        ...

    @abc.abstractmethod
    async def read(self, key: str) -> bytes:
        ...

    @abc.abstractmethod
    async def exists(self, key: str) -> bool:
        ...

    @abc.abstractmethod
    async def delete(self, key: str) -> None:
        """Delete the object at *key*. Silently ignores missing keys."""
        ...


class LocalStorageBackend(StorageBackend):
    def __init__(self, base_path: str | None = None) -> None:
        self._base = Path(base_path or settings.storage_local_path)

    async def save(self, key: str, data: bytes) -> str:
        path = self._base / key
        path.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(path, "wb") as f:
            await f.write(data)
        logger.info("Saved %d bytes → %s", len(data), path)
        return str(path)

    async def read(self, key: str) -> bytes:
        path = self._base / key
        async with aiofiles.open(path, "rb") as f:
            return await f.read()

    async def exists(self, key: str) -> bool:
        return (self._base / key).exists()

    async def delete(self, key: str) -> None:
        path = self._base / key
        try:
            path.unlink(missing_ok=True)
            logger.info("Deleted local file: %s", path)
        except Exception:
            logger.warning("Failed to delete local file: %s", path)


class S3StorageBackend(StorageBackend):
    """S3-compatible backend — works with Backblaze B2, AWS S3, R2, etc."""

    def __init__(self) -> None:
        self._bucket = settings.storage_s3_bucket
        self._session = aioboto3.Session()
        self._client_kwargs = {
            "service_name": "s3",
            "endpoint_url": settings.storage_s3_endpoint,
            "region_name": settings.storage_s3_region,
            "aws_access_key_id": settings.storage_s3_access_key,
            "aws_secret_access_key": settings.storage_s3_secret_key,
        }

    async def save(self, key: str, data: bytes) -> str:
        async with self._session.client(**self._client_kwargs) as s3:
            await s3.upload_fileobj(BytesIO(data), self._bucket, key)
        url = f"{settings.storage_s3_endpoint}/{self._bucket}/{key}"
        logger.info("Uploaded %d bytes → %s", len(data), url)
        return url

    async def read(self, key: str) -> bytes:
        async with self._session.client(**self._client_kwargs) as s3:
            resp = await s3.get_object(Bucket=self._bucket, Key=key)
            return await resp["Body"].read()

    async def exists(self, key: str) -> bool:
        async with self._session.client(**self._client_kwargs) as s3:
            try:
                await s3.head_object(Bucket=self._bucket, Key=key)
                return True
            except s3.exceptions.ClientError:
                return False

    async def delete(self, key: str) -> None:
        async with self._session.client(**self._client_kwargs) as s3:
            try:
                await s3.delete_object(Bucket=self._bucket, Key=key)
                logger.info("Deleted from bucket: %s/%s", self._bucket, key)
            except Exception:
                logger.warning("Failed to delete from bucket: %s/%s", self._bucket, key)


def get_storage() -> StorageBackend:
    """Factory — returns the configured backend."""
    if settings.storage_backend == "local":
        return LocalStorageBackend()
    if settings.storage_backend == "s3":
        return S3StorageBackend()
    raise ValueError(f"Unknown storage backend: {settings.storage_backend}")
