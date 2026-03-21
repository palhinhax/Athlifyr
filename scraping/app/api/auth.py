"""API key authentication dependency."""

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader

from app.core.config import settings

_header_scheme = APIKeyHeader(name="X-API-Key", auto_error=False)


async def require_api_key(
    api_key: str | None = Security(_header_scheme),
) -> str:
    """Validate X-API-Key header against the configured secret.

    If no api_key is configured (empty string), authentication is skipped
    to allow easy local development.
    """
    if not settings.api_key:
        return ""

    if not api_key or api_key != settings.api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
    return api_key
