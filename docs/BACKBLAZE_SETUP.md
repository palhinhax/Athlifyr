# Backblaze B2 Storage Setup

This project uses Backblaze B2 for storing user-uploaded images (profiles, posts, events).

## Prerequisites

1. Backblaze B2 account: https://www.backblaze.com/b2/cloud-storage.html
2. Application key with appropriate permissions

## Configuration Steps

### 1. Create a Bucket

1. Go to https://secure.backblaze.com/b2_buckets.htm
2. Click "Create a Bucket"
3. Bucket name: `athlifyr`
4. Files in Bucket: **Public** (so images can be accessed via URL)
5. Encryption: Disabled (or enabled if needed)
6. Object Lock: Disabled
7. Click "Create a Bucket"
8. Copy the **Bucket ID** from the bucket details page

### 2. Get Application Keys

1. Go to https://secure.backblaze.com/app_keys.htm
2. Click "Add a New Application Key"
3. Name: `athlifyr`
4. Allow access to: Select your bucket (`athlifyr`)
5. Type of Access: **Read and Write**
6. Allow List All Bucket Names: Yes (optional)
7. Click "Create New Key"
8. **IMPORTANT**: Save the credentials immediately (they only appear once):
   - `keyID`
   - `applicationKey`

### 3. Configure Environment Variables

Add the following to your `.env` file:

```env
# Backblaze B2 Storage
B2_APPLICATION_KEY_ID="your_key_id_here"
B2_APPLICATION_KEY="your_application_key_here"
B2_BUCKET_NAME="athlifyr"
B2_BUCKET_ID="your_bucket_id_here"

# Public bucket URL (format: https://f<bucketId>.backblazeb2.com)
# Or use a custom domain if you have one configured
NEXT_PUBLIC_B2_BUCKET_URL="https://f<your-bucket-id>.backblazeb2.com"
```

Replace:

- `your_key_id_here` with your `keyID`
- `your_application_key_here` with your `applicationKey`
- `your_bucket_id_here` with your bucket ID
- `<your-bucket-id>` in the URL with your actual bucket ID

### 4. Bucket Settings

For the bucket to work correctly with public image URLs:

1. Go to your bucket settings
2. Under "Bucket Info" > "Files in Bucket are:", select **Public**
3. Save changes

⚠️ **IMPORTANT**: If the bucket is set to **Private**, images will not be accessible via direct URLs and will appear broken or disappear after upload. Make sure the bucket is set to **Public**.

### 5. Configure CORS (Required for Image Export)

**IMPORTANT**: You need to configure CORS to allow images to be loaded from the browser for export functionality.

#### Option A: Using Backblaze Web Interface

1. Go to your bucket settings
2. Find "Bucket CORS Rules" section
3. Click "Add CORS Rule" or "Update CORS Rules"
4. Add the following rule:

```json
[
  {
    "corsRuleName": "allowAll",
    "allowedOrigins": [
      "http://localhost:3000",
      "https://athlifyr.com",
      "https://www.athlifyr.com"
    ],
    "allowedOperations": ["b2_download_file_by_name", "b2_download_file_by_id"],
    "allowedHeaders": ["*"],
    "exposeHeaders": [],
    "maxAgeSeconds": 3600
  }
]
```

#### Option B: Using B2 CLI

```bash
# Install B2 CLI
pip install b2

# Authorize
b2 authorize-account <applicationKeyId> <applicationKey>

# Update CORS rules
b2 update-bucket --cors-rules '[
  {
    "corsRuleName": "allowAll",
    "allowedOrigins": ["http://localhost:3000", "https://athlifyr.com"],
    "allowedOperations": ["b2_download_file_by_name", "b2_download_file_by_id"],
    "allowedHeaders": ["*"],
    "maxAgeSeconds": 3600
  }
]' <bucketName> allPublic
```

**Note**: Update `allowedOrigins` to include:

- Your local development URL (e.g., `http://localhost:3000`)
- Your production domain (e.g., `https://athlifyr.com`)
- Any other domains where your app will be hosted

### 6. Optional: Custom Domain

If you want to use a custom domain (e.g., `cdn.athlifyr.com`):

1. Configure a CNAME record pointing to `f<bucketId>.backblazeb2.com`
2. Update `NEXT_PUBLIC_B2_BUCKET_URL` to your custom domain
3. Enable HTTPS (Backblaze supports HTTPS by default)

## Usage

### Upload an Image

```typescript
import { ImageUpload } from "@/components/image-upload";

function MyComponent() {
  const handleUploadComplete = (url: string, fileId: string, fileName: string) => {
    console.log("Image uploaded:", url);
    // Save url to database
  };

  return (
    <ImageUpload
      folder="posts" // or "profiles" or "events"
      onUploadComplete={handleUploadComplete}
      maxSizeMB={5}
    />
  );
}
```

### Using the API Directly

**Upload:**

```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("folder", "posts");

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log("File URL:", data.file.url);
```

**Delete:**

```typescript
await fetch(`/api/upload?fileName=${fileName}&fileId=${fileId}`, {
  method: "DELETE",
});
```

## Folder Structure

Images are organized in folders:

- `profiles/` - User profile pictures
- `posts/` - Post images and content
- `events/` - Event images

File naming format: `{folder}/{timestamp}_{sanitized_filename}`

Example: `posts/1673456789000_my_photo.jpg`

## Security

- Only authenticated users can upload images
- File type validation: JPEG, PNG, WebP, GIF only
- File size limit: 5MB (configurable)
- Filenames are sanitized to prevent path traversal

## Troubleshooting

### Images disappear after upload / Images not displaying in posts

**Symptom**: You upload an image successfully, but it doesn't show up in the post or shows a broken image icon.

**Common Causes**:

1. **Bucket is set to Private instead of Public**
   - Solution: Go to bucket settings and change "Files in Bucket are:" to **Public**
   - This is the most common cause of images disappearing

2. **Incorrect CORS configuration**
   - Solution: Follow step 5 to configure CORS rules properly
   - Make sure your domain is in `allowedOrigins`

3. **Wrong bucket URL in environment variables**
   - Solution: Verify `NEXT_PUBLIC_B2_BUCKET_URL` matches your bucket's URL
   - Format should be: `https://f003.backblazeb2.com` (or your custom domain)

4. **File permissions**
   - Solution: Ensure application key has both Read and Write permissions

**Quick Check**:

- Open browser console (F12) and check for CORS or 403 errors when loading images
- Try accessing the image URL directly in a new browser tab
- If you get "Access Denied" or 403, your bucket is likely private

### Images not loading / CORS errors

**Error**: `Access to image at '...' has been blocked by CORS policy`

**Solution**:

1. Verify CORS rules are configured on your B2 bucket (see step 5 above)
2. Make sure your current domain is in the `allowedOrigins` list
3. Check browser console for the exact origin being blocked
4. For localhost, use `http://localhost:3000` (not `http://127.0.0.1:3000`)
5. Clear browser cache and restart the dev server after CORS changes

To verify CORS is working:

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -I https://f003.backblazeb2.com/file/athlifyr/test.jpg
```

You should see `Access-Control-Allow-Origin: http://localhost:3000` in the response headers.

### Images not loading (general)

1. Verify bucket is set to **Public** (this is critical!)
2. Check `NEXT_PUBLIC_B2_BUCKET_URL` is correct
3. Test image URL directly in browser - if you get 403/Access Denied, bucket is private
4. Check Next.js image domains are configured in `next.config.mjs`

### Upload fails

1. Verify credentials in `.env`
2. Check application key has **Read and Write** permissions
3. Ensure bucket ID is correct

### 401 Unauthorized

- Application key expired or invalid
- Re-create application key and update `.env`

## Cost

Backblaze B2 Pricing (as of 2024):

- Storage: $0.005/GB/month (first 10GB free)
- Downloads: $0.01/GB (first 1GB/day free)
- API calls: Free

Very affordable for small to medium applications!

## Additional Resources

- [Backblaze B2 Documentation](https://www.backblaze.com/b2/docs/)
- [Node.js SDK](https://github.com/yakovkhalinsky/backblaze-b2)
- [Pricing Details](https://www.backblaze.com/b2/cloud-storage-pricing.html)
