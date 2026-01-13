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

### 5. Optional: Custom Domain

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

### Images not loading

1. Verify bucket is set to **Public**
2. Check `NEXT_PUBLIC_B2_BUCKET_URL` is correct
3. Ensure CORS is not blocking requests

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
