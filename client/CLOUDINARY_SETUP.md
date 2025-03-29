# Cloudinary Setup for SkillBridge

This guide explains how to set up Cloudinary for image uploads in the SkillBridge application.

## Why Cloudinary?

Cloudinary provides cloud-based image and video management services. It lets you upload, store, manage, manipulate, and deliver images and videos for your website or app.

## Setup Steps

1. **Create a Cloudinary Account**:
   - Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
   - After signing up, you'll be taken to your dashboard

2. **Get Your Cloudinary Credentials**:
   - On your dashboard, you'll find your **Cloud Name**
   - The default Cloud Name being used is "duztkby9f" - replace this with your own

3. **Use the Default Upload Preset or Create Your Own**:
   - By default, we're using the "ml_default" upload preset
   - To create your own:
     - In your Cloudinary dashboard, go to Settings > Upload
     - Scroll down to "Upload presets" and click "Add upload preset"
     - Name your preset
     - Set "Signing Mode" to "Unsigned" (for frontend uploads without exposing your API secret)
     - Configure other options as needed and save

4. **Configure CORS Settings**:
   - Still in Settings, go to the "Security" tab
   - Under "Allowed CORS origins" add your application's domain
   - For development, add `http://localhost:3000` or whatever port your development server runs on

## Integrate with SkillBridge

You can use Cloudinary in SkillBridge in two ways:

### Option 1: Environment Variables (Recommended for Production)

1. Create or modify `.env` file in the client directory:
   ```
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

2. Restart your development server for the changes to take effect

### Option 2: Direct Code Modification (Quick Setup for Development)

1. Open `client/src/pages/CreateEvent.js`
2. Look for the `uploadImageToCloudinary` function
3. Replace the hardcoded values with your Cloudinary credentials:

```javascript
const CLOUD_NAME = "your_cloud_name";  // Default is "duztkby9f"
const UPLOAD_PRESET = "your_upload_preset";  // Default is "ml_default"
```

## Current Configuration

The application currently uses these default values:
- **Cloud Name**: "duztkby9f"
- **Upload Preset**: "ml_default"

If you're experiencing "Upload preset not found" errors, make sure:
1. You're using the correct cloud name
2. The upload preset exists in your Cloudinary account
3. The upload preset is set to "Unsigned"

## Testing Your Setup

1. Start your application
2. Go to the "Create Event" page
3. Upload an image
4. If successful, the event will be created with your image

## Troubleshooting

If you encounter issues with image uploads:

1. Check browser console for error messages
2. Verify your Cloud Name and Upload Preset are correct
3. Ensure your upload preset is set to "Unsigned"
4. Confirm CORS settings include your application domain
5. Check if you have enough free credits on your Cloudinary account

For additional help, refer to the [Cloudinary Documentation](https://cloudinary.com/documentation). 