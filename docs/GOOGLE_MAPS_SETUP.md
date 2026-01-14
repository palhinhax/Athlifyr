# Google Maps API Setup Guide

This guide will help you set up the Google Maps API for displaying event locations on Athlifyr.

## Prerequisites

- A Google Cloud account (same one used for OAuth or Analytics)
- A Google Cloud project with billing enabled

## Step-by-Step Setup

### 1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)

### 2. Enable Required APIs

1. In the left sidebar, click on **"APIs & Services"** → **"Library"**
2. Search for and enable the following APIs:
   - **Maps Embed API** (for embedded maps)
   - **Maps JavaScript API** (optional, for interactive features)

### 3. Create an API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"API Key"**
3. Copy the generated API key
4. Click **"Edit API key"** to configure restrictions

### 4. Configure API Key Restrictions (Recommended)

#### Application Restrictions:

- Select **"HTTP referrers (web sites)"**
- Add your website URLs:
  ```
  http://localhost:3000/*
  https://yourdomain.com/*
  https://*.yourdomain.com/*
  ```

#### API Restrictions:

- Select **"Restrict key"**
- Choose the following APIs:
  - Maps Embed API
  - Maps JavaScript API (if enabled)

### 5. Add API Key to Environment Variables

Add the API key to your `.env` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-actual-api-key-here"
```

⚠️ **Note**: The `NEXT_PUBLIC_` prefix makes this variable available in the browser.

### 6. Verify Setup

1. Restart your development server
2. Navigate to an event page with coordinates (e.g., Maratona do Funchal)
3. Check if the map loads in the sidebar

## Pricing

Google Maps has a **free tier** with the following limits:

- **Maps Embed API**:
  - $0.00 USD per load (unlimited free)
  - No credit card required for basic usage

- **Maps JavaScript API**:
  - First 28,000 loads/month free
  - $7.00 per 1,000 loads after that

For most small to medium-sized applications, you'll stay within the free tier.

## Troubleshooting

### Map Not Displaying

**Problem**: Grey box instead of map

- **Solution**: Check if the API key is correctly set in `.env`
- **Solution**: Verify that Maps Embed API is enabled
- **Solution**: Check browser console for errors

**Problem**: "This page can't load Google Maps correctly"

- **Solution**: API key restrictions might be too strict
- **Solution**: Add your domain to HTTP referrers
- **Solution**: Ensure billing is enabled on your Google Cloud project

**Problem**: Map shows but says "For development purposes only"

- **Solution**: This is normal for localhost without billing
- **Solution**: Enable billing on your Google Cloud project for production

### Event Has No Map

- **Solution**: Event needs `latitude`, `longitude` coordinates
- **Solution**: Re-seed events with updated seed files
- **Solution**: Add coordinates via admin interface (if available)

## Adding Coordinates to Events

### Method 1: Google Maps Search

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for the event location
3. Right-click on the location → **"Copy coordinates"**
4. Coordinates format: `latitude, longitude` (e.g., `32.6447, -16.9078`)

### Method 2: Update Seed Files

Add coordinates to your seed files:

```typescript
const event = await prisma.event.create({
  data: {
    title: "Event Name",
    // ... other fields
    latitude: 32.6447,
    longitude: -16.9078,
    googleMapsUrl: "https://maps.app.goo.gl/YourShortUrl",
  },
});
```

### Method 3: Get Short URL

1. Go to Google Maps
2. Find your location
3. Click **"Share"** → **"Copy link"**
4. Use this as `googleMapsUrl`

## Security Best Practices

1. **Always restrict your API key** (by HTTP referrer and API)
2. **Never commit** `.env` files to version control
3. **Use separate keys** for development and production
4. **Monitor usage** in Google Cloud Console
5. **Rotate keys periodically** if exposed

## Monitoring Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services"** → **"Dashboard"**
3. View request counts and quotas
4. Set up billing alerts if needed

## Related Documentation

- [Google Maps Embed API](https://developers.google.com/maps/documentation/embed)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)

## Need Help?

If you encounter issues:

1. Check the browser console for error messages
2. Verify API key restrictions
3. Ensure billing is enabled (for production)
4. Review Google Cloud Console for API quotas

---

**Last Updated**: January 2026
