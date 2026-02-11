# Upload API Documentation

## Overview
The upload API provides two methods for uploading files to AWS S3:
1. **Direct Upload** - Upload files directly through the backend (recommended)
2. **Presigned URL Upload** - Get a presigned URL and upload directly to S3

## Endpoints

### 1. Direct Upload (NEW) ✨
Upload files directly to S3 through the backend and receive S3 file information.

**Endpoint:** `POST /api/v1/upload`

**Method:** Multipart/form-data

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token> (optional, for user-specific uploads)
```

**Form Data:**
- `file` (required): The file to upload
- `purpose` (required): Upload purpose enum
  - `KYC_AADHAR`
  - `KYC_PAN`
  - `PROPERTY_IMAGE`
  - `PROPERTY_VIDEO`
  - `USER_AVATAR`

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/image.jpg" \
  -F "purpose=PROPERTY_IMAGE"
```

**Example using JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('purpose', 'PROPERTY_IMAGE');

const response = await fetch('http://localhost:5000/api/v1/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

**Example using Postman:**
1. Set method to POST
2. URL: `http://localhost:5000/api/v1/upload`
3. Go to "Body" tab
4. Select "form-data"
5. Add key "file" (change type to "File") and select your file
6. Add key "purpose" with value like "PROPERTY_IMAGE"
7. Add Authorization header if needed

**Success Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "key": "property/images/USER_ID/1707696000000-uuid.jpg",
    "fileUrl": "https://your-bucket.s3.region.amazonaws.com/property/images/USER_ID/1707696000000-uuid.jpg",
    "bucket": "your-bucket-name",
    "size": 245678,
    "fileName": "image.jpg",
    "contentType": "image/jpeg"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

```json
{
  "success": false,
  "message": "Purpose is required"
}
```

```json
{
  "success": false,
  "message": "Unsupported contentType \"image/gif\" for purpose \"PROPERTY_IMAGE\""
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to upload file"
}
```

---

### 2. Presigned URL Upload (Existing)
Get a presigned URL to upload files directly to S3 from the client.

**Endpoint:** `POST /api/v1/upload/presign`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token> (optional)
```

**Request Body:**
```json
{
  "fileName": "image.jpg",
  "contentType": "image/jpeg",
  "purpose": "PROPERTY_IMAGE"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://presigned-s3-url...",
    "key": "property/images/USER_ID/1707696000000-uuid.jpg",
    "fileUrl": "https://your-bucket.s3.region.amazonaws.com/property/images/USER_ID/1707696000000-uuid.jpg",
    "expiresIn": 300
  }
}
```

**Usage Flow:**
1. Make a POST request to `/api/v1/upload/presign`
2. Receive the `uploadUrl`
3. Use PUT request to upload file to `uploadUrl`
4. Use `fileUrl` to access the uploaded file

---

## Allowed File Types

### KYC_AADHAR / KYC_PAN
- `image/jpeg`
- `image/png`
- `application/pdf`

### PROPERTY_IMAGE
- `image/jpeg`
- `image/png`
- `image/webp`

### PROPERTY_VIDEO
- `video/mp4`
- `video/quicktime`

### USER_AVATAR
- `image/jpeg`
- `image/png`
- `image/webp`

## File Size Limit
- Maximum file size: **50 MB**

## Storage Structure
Files are organized in S3 with the following structure:
```
bucket/
  ├── kyc/
  │   ├── aadhar/{userId}/{timestamp}-{uuid}.{ext}
  │   └── pan/{userId}/{timestamp}-{uuid}.{ext}
  ├── property/
  │   ├── images/{userId}/{timestamp}-{uuid}.{ext}
  │   └── videos/{userId}/{timestamp}-{uuid}.{ext}
  └── user/
      └── avatar/{userId}/{timestamp}-{uuid}.{ext}
```

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_PUBLIC_BASE_URL=https://your-custom-domain.com (optional)
S3_PRESIGN_EXPIRES=300 (optional, defaults to 300 seconds)
```

## Testing

### Test Direct Upload
```bash
# Upload an image
curl -X POST http://localhost:5000/api/v1/upload \
  -F "file=@./test-image.jpg" \
  -F "purpose=PROPERTY_IMAGE"

# Upload a PDF for KYC
curl -X POST http://localhost:5000/api/v1/upload \
  -F "file=@./aadhar.pdf" \
  -F "purpose=KYC_AADHAR"
```

### Test Presigned Upload
```bash
# Get presigned URL
curl -X POST http://localhost:5000/api/v1/upload/presign \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test.jpg",
    "contentType": "image/jpeg",
    "purpose": "PROPERTY_IMAGE"
  }'
```

## Best Practices

1. **Use Direct Upload for:**
   - Small to medium files (< 5MB)
   - When you need immediate file validation
   - When you want centralized upload tracking

2. **Use Presigned URL for:**
   - Large files (> 5MB)
   - Reducing server bandwidth
   - Client-side upload progress tracking

3. **Security:**
   - Always validate file types on the server
   - Implement user authentication for uploads
   - Set appropriate CORS policies on your S3 bucket

4. **Performance:**
   - For large files, consider using presigned URLs
   - Implement client-side file compression before upload
   - Use appropriate content types for better caching
