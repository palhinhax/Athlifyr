# Promo Video Assets

This folder contains the video assets for the `/promo` page.

## Required Files

### Video Files (at least one is required)

- **promo.mp4** - Main video file (MP4 format, recommended)
- **promo.webm** - Alternative video file (WebM format, optional for better browser support)

### Poster Image (recommended)

- **poster.jpg** - Poster image shown before video loads or if video fails to load

## Video Specifications

### Recommended Settings

- **Resolution**: 1080x1920 (9:16 portrait) for mobile recording, or 1920x1080 (16:9) for desktop
- **Codec**: H.264 (for MP4) or VP9 (for WebM)
- **Bitrate**: 2-5 Mbps for good quality
- **Duration**: 10-15 seconds (matches the timeline duration)
- **Audio**: Not required (video plays muted by default)

### File Size

- Keep video files under 10 MB for faster loading
- Compress videos using tools like HandBrake or online services

## Free Video Resources

You can find free stock videos at:

- [Pexels](https://www.pexels.com/videos/)
- [Pixabay](https://pixabay.com/videos/)
- [Mixkit](https://mixkit.co/free-stock-video/)
- [Coverr](https://coverr.co/)

## How to Update

1. Download your chosen video
2. Rename it to `promo.mp4` (or `promo.webm`)
3. Place it in this `/public/promo/` directory
4. Optionally, create a poster image:
   - Extract a frame from the video
   - Save it as `poster.jpg`
   - Place it in this directory
5. Refresh the `/promo` page to see your new video

## Troubleshooting

If the video doesn't play:

- Check that the file is named correctly (`promo.mp4` or `promo.webm`)
- Verify the file format is supported (MP4 with H.264 codec is most compatible)
- Try refreshing the page
- Check browser console for errors
- Ensure the video file is not corrupted

## Testing

To test the promo page:

1. Visit `https://yourdomain.com/promo` in your browser
2. On mobile: Open in Safari (iOS) or Chrome (Android)
3. Record your screen while the page plays
4. Use the recording for Instagram Reels/Stories

**Note**: The page loops automatically, so you can record multiple takes.
