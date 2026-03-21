"""Document storage abstraction — local backend today, S3/R2 later."""

from __future__ import annotations

import abc
import logging
import os
from pathlib import Path

import aiofiles

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


def get_storage() -> StorageBackend:
    """Factory — returns the configured backend."""
    if settings.storage_backend == "local":
        return LocalStorageBackend()
    # Future: add S3StorageBackend here
    raise ValueError(f"Unknown storage backend: {settings.storage_backend}")
