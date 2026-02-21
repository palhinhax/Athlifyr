# Railway API — New URL-Based Endpoints

## 📋 Summary

We need **two new endpoints** on the `barbell-path-tracker` Railway service that accept a **video URL** instead of a multipart file upload. These endpoints download the video themselves, process it the same way as the existing `/analyze/full` and `/analyze/body` endpoints, and **upload the processed output video directly to Backblaze B2** via a presigned PUT URL.

### Why?

Our web/mobile app is hosted on **Vercel**, which has a hard **4.5 MB request body limit** on Serverless Functions. Users upload videos of 20–100 MB, which can't pass through Vercel. The new architecture is:

```
┌──────────┐    PUT (presigned URL)     ┌──────────────────┐
│  Client   │ ───────────────────────── │  Backblaze B2    │
│ (Browser  │                           │  (S3-compatible) │
│  / Mobile)│                           └────────┬─────────┘
└─────┬─────┘                                    │
      │                                          │ GET (presigned download)
      │ POST JSON {video_url, params,            │
      │            result_upload_url}             │
      ▼                                          ▼
┌──────────┐    POST JSON               ┌──────────────────────┐
│  Vercel  │ ────────────────────────── │  Railway              │
│  (proxy) │    {video_url,             │  barbell-path-tracker │
│  (no     │     result_upload_url,     │                       │
│  video   │     ...params}             │  1. Download video    │
│  bytes!) │                            │  2. Trim/transcode    │
│          │ ◄───────────────────────── │  3. Process (OpenCV   │
│          │    JSON response            │     + MediaPipe)      │
└──────────┘    (no video bytes!)       │  4. Upload result     │
                                        │     video to B2 ──────┤──► B2 bucket
                                        │  5. Return JSON       │
                                        └──────────────────────┘
```

**Vercel never touches any video bytes — not on input, not on output.** It only generates presigned B2 URLs and forwards them to Railway as JSON fields.

---

## 🆕 New Endpoint 1: `POST /analyze/full/url`

Identical to `/analyze/full` but accepts a **JSON body** with a `video_url` instead of a multipart `video` file.

### Request

```
POST /analyze/full/url
Content-Type: application/json
```

```json
{
  "video_url": "https://s3.us-east-005.backblazeb2.com/athlifyr-videos/uploads/user123/abc-def.mp4?X-Amz-Algorithm=...",
  "content_type": "video/mp4",
  "seed_x": 0.52,
  "seed_y": 0.38,
  "seed_frame": 0,
  "show_angles": true,
  "max_duration_sec": 30,
  "auto_detect": true,
  "enable_ai": false,
  "language": "en",
  "trim_start_sec": null,
  "trim_end_sec": null,
  "result_upload_url": "https://s3.us-east-005.backblazeb2.com/athlifyr-videos/results/user123/output-uuid.mp4?X-Amz-Algorithm=..."
}
```

### Parameters

| Field               | Type          | Required | Default | Description                                                          |
| ------------------- | ------------- | -------- | ------- | -------------------------------------------------------------------- |
| `video_url`         | string (URL)  | ✅ Yes   | —       | Presigned URL to download the input video (valid for ~15 minutes)    |
| `content_type`      | string        | ✅ Yes   | —       | MIME type: `video/mp4`, `video/quicktime`, `video/webm`, etc.        |
| `seed_x`            | float         | ✅ Yes   | —       | Normalized X coordinate (0–1) where user tapped the barbell plate    |
| `seed_y`            | float         | ✅ Yes   | —       | Normalized Y coordinate (0–1) where user tapped the barbell plate    |
| `seed_frame`        | int           | No       | `0`     | Frame index where the seed point was selected                        |
| `show_angles`       | bool          | No       | `true`  | Overlay joint angles on the output video                             |
| `max_duration_sec`  | int           | No       | `30`    | Maximum video duration to process (seconds)                          |
| `auto_detect`       | bool          | No       | `true`  | Auto-detect barbell plate center                                     |
| `enable_ai`         | bool          | No       | `false` | Enable AI exercise analysis (rep counting, form scoring)             |
| `language`          | string        | No       | `"en"`  | Language for AI analysis output (`en`, `pt`, `es`, `fr`, `de`, `it`) |
| `trim_start_sec`    | float \| null | No       | `null`  | If set (with `trim_end_sec`), trim the video before processing       |
| `trim_end_sec`      | float \| null | No       | `null`  | End of trim range (seconds). Must be > `trim_start_sec`              |
| `result_upload_url` | string (URL)  | No       | `null`  | Presigned PUT URL where Railway should upload the processed video    |

### Behavior

1. **Download** the video from `video_url` via HTTP GET
2. **Validate** file size (≤ 500 MB) and content type
3. **Trim** if `trim_start_sec` and `trim_end_sec` are provided
4. **Transcode** WebM → H.264 MP4 if `content_type` is `video/webm`
5. **Process** exactly like `/analyze/full` (barbell tracking + pose estimation)
6. **Upload result video to B2** if `result_upload_url` is provided (PUT the processed `.mp4`)
7. **Return** the same JSON response as `/analyze/full`, with `video_uploaded_to_b2: true` if upload succeeded

### Response

Same structure as `/analyze/full`, with one new field:

```json
{
  "success": true,
  "message": "Analysis complete! Tracking: ✓, Pose: 95%",
  "video_url": "/download/full_abc12345.mp4",
  "video_uploaded_to_b2": true,
  "tracking_success": true,
  "auto_detected": true,
  "detected_center_x": 342,
  "detected_center_y": 456,
  "detected_radius": 45,
  "total_travel_px": 523.7,
  "max_vertical_displacement_px": 312.4,
  "max_horizontal_displacement_px": 89.2,
  "frames_processed": 180,
  "frames_with_pose": 171,
  "pose_detection_rate": 95.0,
  "duration_sec": 6.0,
  "average_angles": { "...": "same as /analyze/full" },
  "skeleton_frames": ["...same as /analyze/full"],
  "ai_analysis": null
}
```

### Error Responses

| Status | When                              | Body                                              |
| ------ | --------------------------------- | ------------------------------------------------- |
| 400    | Invalid/missing parameters        | `{"detail": "video_url is required"}`             |
| 400    | Video too large (> 500 MB)        | `{"detail": "Video exceeds 500 MB limit"}`        |
| 400    | Unsupported content type          | `{"detail": "Unsupported content type: ..."}`     |
| 422    | Trim range invalid                | `{"detail": "trim_end_sec must be > ..."}`        |
| 502    | Failed to download from video_url | `{"detail": "Failed to download video from URL"}` |
| 504    | Download or processing timeout    | `{"detail": "Processing timeout"}`                |

---

## 🆕 New Endpoint 2: `POST /analyze/body/url`

Identical to `/analyze/body` but accepts a **JSON body** with a `video_url` instead of a multipart `video` file.

### Request

```
POST /analyze/body/url
Content-Type: application/json
```

```json
{
  "video_url": "https://s3.us-east-005.backblazeb2.com/athlifyr-videos/uploads/user123/abc-def.mp4?X-Amz-Algorithm=...",
  "content_type": "video/mp4",
  "show_angles": true,
  "max_duration_sec": 30,
  "enable_ai": false,
  "language": "en",
  "trim_start_sec": null,
  "trim_end_sec": null,
  "result_upload_url": "https://s3.us-east-005.backblazeb2.com/athlifyr-videos/results/user123/output-uuid.mp4?X-Amz-Algorithm=..."
}
```

### Parameters

| Field               | Type          | Required | Default | Description                                                       |
| ------------------- | ------------- | -------- | ------- | ----------------------------------------------------------------- |
| `video_url`         | string (URL)  | ✅ Yes   | —       | Presigned URL to download the input video (valid for ~15 min)     |
| `content_type`      | string        | ✅ Yes   | —       | MIME type: `video/mp4`, `video/quicktime`, `video/webm`, etc.     |
| `show_angles`       | bool          | No       | `true`  | Overlay joint angles on the output video                          |
| `max_duration_sec`  | int           | No       | `30`    | Maximum video duration to process (seconds)                       |
| `enable_ai`         | bool          | No       | `false` | Enable AI exercise analysis                                       |
| `language`          | string        | No       | `"en"`  | Language for AI analysis output                                   |
| `trim_start_sec`    | float \| null | No       | `null`  | If set (with `trim_end_sec`), trim the video before processing    |
| `trim_end_sec`      | float \| null | No       | `null`  | End of trim range (seconds)                                       |
| `result_upload_url` | string (URL)  | No       | `null`  | Presigned PUT URL where Railway should upload the processed video |

**Note:** No `seed_x`, `seed_y`, `seed_frame`, or `auto_detect` — body analysis doesn't need barbell seed coordinates.

### Behavior

1. **Download** the video from `video_url` via HTTP GET
2. **Validate** file size (≤ 500 MB) and content type
3. **Trim** if `trim_start_sec` and `trim_end_sec` are provided
4. **Transcode** WebM → H.264 MP4 if needed
5. **Process** exactly like `/analyze/body` (full body pose estimation, no barbell tracking)
6. **Upload result video to B2** if `result_upload_url` is provided (PUT the processed `.mp4`)
7. **Return** the same JSON response as `/analyze/body`, with `video_uploaded_to_b2: true` if upload succeeded

### Response

**Identical** to `/analyze/body` — same JSON structure, same fields.

---

## 🔧 Implementation Guide (Python/FastAPI)

### Suggested Pydantic Models

```python
from pydantic import BaseModel, HttpUrl
from typing import Optional


class AnalyzeFullUrlRequest(BaseModel):
    video_url: str                          # Presigned S3/B2 download URL
    content_type: str = "video/mp4"         # MIME type of the video
    seed_x: float                           # Normalized X (0–1)
    seed_y: float                           # Normalized Y (0–1)
    seed_frame: int = 0
    show_angles: bool = True
    max_duration_sec: int = 30
    auto_detect: bool = True
    enable_ai: bool = False
    language: str = "en"
    trim_start_sec: Optional[float] = None
    trim_end_sec: Optional[float] = None
    result_upload_url: Optional[str] = None  # Presigned PUT URL for output video


class AnalyzeBodyUrlRequest(BaseModel):
    video_url: str                          # Presigned S3/B2 download URL
    content_type: str = "video/mp4"         # MIME type of the video
    show_angles: bool = True
    max_duration_sec: int = 30
    enable_ai: bool = False
    language: str = "en"
    trim_start_sec: Optional[float] = None
    trim_end_sec: Optional[float] = None
    result_upload_url: Optional[str] = None  # Presigned PUT URL for output video
```

### Suggested Route Handlers

```python
import httpx
import tempfile
import os
from fastapi import HTTPException


async def download_video_from_url(video_url: str, max_size_bytes: int = 500 * 1024 * 1024) -> str:
    """
    Download video from a presigned URL to a temp file.
    Returns the path to the temp file.
    """
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream("GET", video_url) as response:
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=502,
                        detail=f"Failed to download video: HTTP {response.status_code}"
                    )

                # Check content-length if available
                content_length = response.headers.get("content-length")
                if content_length and int(content_length) > max_size_bytes:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Video exceeds {max_size_bytes // (1024*1024)} MB limit"
                    )

                # Stream to temp file
                suffix = ".mp4"  # Default; could parse from URL
                with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                    total = 0
                    async for chunk in response.aiter_bytes(chunk_size=8192):
                        total += len(chunk)
                        if total > max_size_bytes:
                            os.unlink(tmp.name)
                            raise HTTPException(
                                status_code=400,
                                detail=f"Video exceeds {max_size_bytes // (1024*1024)} MB limit"
                            )
                        tmp.write(chunk)
                    return tmp.name

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Video download timeout")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Failed to download video: {str(e)}")


async def upload_result_to_b2(result_upload_url: str, video_path: str) -> bool:
    """
    Upload the processed output video directly to B2 via presigned PUT URL.
    Returns True if upload succeeded, False otherwise.

    The presigned URL expects:
      - HTTP PUT method
      - Content-Type: video/mp4
      - Raw video bytes as body
    """
    try:
        file_size = os.path.getsize(video_path)
        async with httpx.AsyncClient(timeout=120.0) as client:
            with open(video_path, "rb") as f:
                response = await client.put(
                    result_upload_url,
                    content=f.read(),
                    headers={
                        "Content-Type": "video/mp4",
                        "Content-Length": str(file_size),
                    },
                )
            if response.status_code in (200, 201):
                print(f"[B2 Upload] Success — {file_size} bytes uploaded")
                return True
            else:
                print(f"[B2 Upload] Failed — HTTP {response.status_code}: {response.text[:200]}")
                return False
    except Exception as e:
        print(f"[B2 Upload] Error: {str(e)}")
        return False


@app.post("/analyze/full/url")
async def analyze_full_url(request: AnalyzeFullUrlRequest):
    """
    Same as /analyze/full but downloads video from a URL instead of
    receiving it as a multipart upload. Optionally uploads the result
    video to B2 via presigned PUT URL.
    """
    # 1. Download video to temp file
    temp_path = await download_video_from_url(request.video_url)

    try:
        # 2. Trim if requested
        if request.trim_start_sec is not None and request.trim_end_sec is not None:
            if request.trim_end_sec <= request.trim_start_sec:
                raise HTTPException(status_code=422, detail="trim_end_sec must be > trim_start_sec")
            temp_path = trim_video(temp_path, request.trim_start_sec, request.trim_end_sec)

        # 3. Transcode WebM if needed
        if request.content_type == "video/webm":
            temp_path = transcode_to_mp4(temp_path)

        # 4. Process using existing logic (same as /analyze/full)
        result = process_full_analysis(
            video_path=temp_path,
            seed_x=request.seed_x,
            seed_y=request.seed_y,
            seed_frame=request.seed_frame,
            show_angles=request.show_angles,
            max_duration_sec=request.max_duration_sec,
            auto_detect=request.auto_detect,
            enable_ai=request.enable_ai,
            language=request.language,
        )

        # 5. Upload result video to B2 if presigned URL provided
        video_uploaded_to_b2 = False
        if request.result_upload_url and result.get("video_url"):
            # result["video_url"] is like "/download/full_abc123.mp4"
            # resolve to local file path on disk
            result_video_path = resolve_download_path(result["video_url"])
            if result_video_path and os.path.exists(result_video_path):
                video_uploaded_to_b2 = await upload_result_to_b2(
                    request.result_upload_url, result_video_path
                )

        result["video_uploaded_to_b2"] = video_uploaded_to_b2
        return result

    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.unlink(temp_path)


@app.post("/analyze/body/url")
async def analyze_body_url(request: AnalyzeBodyUrlRequest):
    """
    Same as /analyze/body but downloads video from a URL instead of
    receiving it as a multipart upload. Optionally uploads the result
    video to B2 via presigned PUT URL.
    """
    temp_path = await download_video_from_url(request.video_url)

    try:
        if request.trim_start_sec is not None and request.trim_end_sec is not None:
            if request.trim_end_sec <= request.trim_start_sec:
                raise HTTPException(status_code=422, detail="trim_end_sec must be > trim_start_sec")
            temp_path = trim_video(temp_path, request.trim_start_sec, request.trim_end_sec)

        if request.content_type == "video/webm":
            temp_path = transcode_to_mp4(temp_path)

        result = process_body_analysis(
            video_path=temp_path,
            show_angles=request.show_angles,
            max_duration_sec=request.max_duration_sec,
            enable_ai=request.enable_ai,
            language=request.language,
        )

        # Upload result video to B2 if presigned URL provided
        video_uploaded_to_b2 = False
        if request.result_upload_url and result.get("video_url"):
            result_video_path = resolve_download_path(result["video_url"])
            if result_video_path and os.path.exists(result_video_path):
                video_uploaded_to_b2 = await upload_result_to_b2(
                    request.result_upload_url, result_video_path
                )

        result["video_uploaded_to_b2"] = video_uploaded_to_b2
        return result

    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)
```

---

## ⚠️ Important Notes

### Presigned URLs

- The `video_url` is a **presigned S3-compatible GET URL** from Backblaze B2
- The `result_upload_url` is a **presigned S3-compatible PUT URL** from Backblaze B2
- Both are valid for **15 minutes** from generation
- They require simple **HTTP GET/PUT** — no auth headers needed
- The URLs contain query parameters (`X-Amz-Algorithm`, `X-Amz-Credential`, etc.) — don't strip them

### Result Video Upload (CRITICAL)

When `result_upload_url` is provided in the request:

1. After processing, **PUT the result `.mp4` video** to the `result_upload_url`
2. Use `Content-Type: video/mp4` header
3. Set `video_uploaded_to_b2: true` in the JSON response if the upload succeeded
4. If the upload fails, set `video_uploaded_to_b2: false` — the `video_url` field still works as a fallback (Vercel will download from Railway)
5. **This is optional** — if `result_upload_url` is `null`, just return the response as before

This avoids Vercel having to download the processed video from Railway and re-upload it to B2 (which was the old flow and caused body size / memory issues).

### Video Formats

- Most common: `video/mp4` (H.264)
- Also possible: `video/quicktime` (.mov), `video/webm`, `video/x-msvideo` (.avi), `video/x-matroska` (.mkv)
- If `content_type` is `video/webm`, transcode to H.264 MP4 before processing (ffmpeg)

### Trim/Transcode/Upload Responsibility

With these new endpoints, **Railway is now responsible for**:

- Downloading the input video from B2 (via `video_url`)
- Trimming (if `trim_start_sec` + `trim_end_sec` provided)
- Transcoding WebM → MP4 (if needed)
- Processing (OpenCV + MediaPipe)
- **Uploading the result video to B2** (via `result_upload_url`)

Previously, Vercel handled trim/transcode and also downloaded the result video from Railway to re-upload to B2 — both steps caused memory/size issues on serverless.

### Backwards Compatibility

- The existing `/analyze/full` and `/analyze/body` (multipart) endpoints **must stay unchanged**
- They're still used by:
  - Local development (localhost)
  - Older mobile app versions
  - Direct API integrations

### Max File Size

- Videos can be up to **100 MB** (client-side limit)
- Server should reject anything over **500 MB** as a safety net

### Timeouts

- Download timeout: **120 seconds** (for slow connections)
- Processing timeout: **270 seconds** (already the existing limit)

---

## 🧪 Testing

### 1. Test with a public video URL

```bash
curl -X POST https://barbell-path-tracker-production.up.railway.app/analyze/body/url \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://example.com/test-video.mp4",
    "content_type": "video/mp4",
    "show_angles": true,
    "max_duration_sec": 10
  }'
```

### 2. Test with trim parameters

```bash
curl -X POST https://barbell-path-tracker-production.up.railway.app/analyze/full/url \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://example.com/test-video.mp4",
    "content_type": "video/mp4",
    "seed_x": 0.5,
    "seed_y": 0.5,
    "trim_start_sec": 2.0,
    "trim_end_sec": 8.0,
    "max_duration_sec": 30
  }'
```

### 3. Test error handling

```bash
# Invalid URL
curl -X POST .../analyze/body/url \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://example.com/nonexistent.mp4", "content_type": "video/mp4"}'
# Expected: 502 - Failed to download video

# Missing required field
curl -X POST .../analyze/full/url \
  -H "Content-Type: application/json" \
  -d '{"video_url": "...", "content_type": "video/mp4"}'
# Expected: 422 - seed_x is required
```

---

## 📊 Expected Flow Comparison

### Before (multipart upload — causes timeouts on large files)

```
Client ──[52MB video]──► Vercel ──[52MB video]──► Railway
                         ⚡ FAILS: FUNCTION_PAYLOAD_TOO_LARGE

Railway ──[result video]──► Vercel ──[download + re-upload]──► B2
                            ⚡ Memory/timeout issues on serverless
```

### After (URL-based — Vercel is a pure JSON proxy, zero video bytes)

```
Client ──[52MB]──► B2 Storage (input video)
Client ──[1KB JSON]──► Vercel ──[1KB JSON with presigned URLs]──► Railway
                                                                     │
Railway ──[GET 52MB from B2]──────────────────────────────────────┘
Railway ──[process]──► Railway ──[PUT result video to B2]──► B2 Storage
Railway ──[1KB JSON response]──► Vercel ──[1KB JSON]──► Client
```

**Vercel request AND response body: ~1 KB** (JSON only, zero video bytes in either direction)

---

## 📅 Timeline

This is **blocking production** — videos > 4.5 MB cannot be uploaded on the deployed app. The Athlifyr side (Vercel routes + client code) is already updated and waiting for these Railway endpoints.

**Priority: HIGH**

---

## 📞 Questions?

Contact the Athlifyr team or check:

- Existing `/analyze/full` and `/analyze/body` endpoints for reference
- FastAPI docs at `https://barbell-path-tracker-production.up.railway.app/docs`
- This document: `docs/api/RAILWAY_URL_ENDPOINTS.md`
