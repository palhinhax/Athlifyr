# Promo Page Documentation

## Overview

The `/promo` page is an auto-animated promotional page designed for recording on mobile devices and sharing on Instagram Reels/Stories. It features a video background with animated text sequences that automatically loop.

## Features

- ✅ Full-screen experience without header/footer
- ✅ Video background with automatic playback
- ✅ 5-step animated timeline with smooth transitions
- ✅ Automatic loop for continuous recording
- ✅ Mobile-optimized (9:16 portrait)
- ✅ Desktop-friendly preview
- ✅ Multilingual support (all 6 languages)
- ✅ Query parameter customization
- ✅ Restart button (desktop only)
- ✅ Accessibility features (prefers-reduced-motion support)

## Accessing the Page

The promo page is available at:

- **Main URL**: `https://athlifyr.com/promo`
- **With customization**: `https://athlifyr.com/promo?city=lisboa&sport=hyrox`

**Note**: This page bypasses the locale routing system, so it doesn't require language prefixes like `/pt/promo`.

## Timeline Sequence

The page automatically cycles through 5 steps:

1. **Intro** (2s) - Brand name "Athlifyr" fades in
2. **Message** (2.5s) - Main tagline appears
3. **Features** (4s) - List of 5 features with stagger animation
4. **CTA** (2.5s) - Call to action message
5. **Final Screen** (3s) - Logo with glow effect + slogan

**Total duration**: ~14 seconds, then loops automatically

## Recording for Instagram

### Mobile Recording

1. Open `https://athlifyr.com/promo` on your mobile device
2. Enable screen recording:
   - **iOS**: Swipe down from top-right, tap record button
   - **Android**: Swipe down, tap "Screen record"
3. Open the page in Safari (iOS) or Chrome (Android)
4. The video will autoplay automatically
5. Record one complete loop (14 seconds)
6. Stop recording and save the video
7. Upload to Instagram Reels or Stories

### Tips

- Hold the phone in portrait mode (9:16 ratio)
- Make sure device volume is muted (page uses no audio)
- If video doesn't autoplay, tap the "Play Video" button
- You can record multiple takes since it loops automatically
- Add your own music in Instagram before posting

## Customization

### Query Parameters

You can customize the message using URL parameters:

```
/promo?city=lisboa
/promo?sport=hyrox
/promo?city=lisboa&sport=hyrox
```

**Examples**:

- `?city=Lisboa` → "Encontra eventos desportivos em Lisboa"
- `?sport=HYROX` → "Encontra eventos de HYROX perto de ti"
- `?city=Porto&sport=Trail` → "Encontra eventos de Trail em Porto"

### Desktop Restart Button

When viewing on desktop:

- Hover over the page to see the "Restart" button in the top-right corner
- Click to restart the animation from the beginning
- This button is hidden on mobile devices

## Updating Video Assets

### Required Files

Place your video files in `/public/promo/`:

1. **promo.mp4** (required) - Main video file
2. **promo.webm** (optional) - Alternative format for better browser support
3. **poster.jpg** (recommended) - Fallback image if video doesn't load

### Video Specifications

**Recommended settings**:

- **Resolution**: 1080x1920 (9:16 portrait) or 1920x1080 (16:9 landscape)
- **Codec**: H.264 (MP4) or VP9 (WebM)
- **Bitrate**: 2-5 Mbps
- **Duration**: 10-15 seconds (matches timeline)
- **Audio**: Not required (page mutes video)
- **File size**: Under 10 MB for faster loading

**Free video sources**:

- [Pexels](https://www.pexels.com/videos/)
- [Pixabay](https://pixabay.com/videos/)
- [Mixkit](https://mixkit.co/free-stock-video/)
- [Coverr](https://coverr.co/)

### How to Update

1. Download your chosen video
2. Rename to `promo.mp4` (or `promo.webm`)
3. Place in `/public/promo/` directory
4. (Optional) Extract a frame as `poster.jpg`
5. Commit and deploy changes
6. Clear browser cache and refresh

## Editing Configuration

### Timeline Durations

Edit `/app/promo/config.ts`:

```typescript
steps: [
  { id: "intro", duration: 2 }, // Change to adjust timing
  { id: "message", duration: 2.5 },
  { id: "features", duration: 4 },
  { id: "cta", duration: 2.5 },
  { id: "final", duration: 3 },
];
```

### Texts and Translations

Edit language files in `/messages/`:

- `/messages/pt.json` - Portuguese (European)
- `/messages/en.json` - English
- `/messages/es.json` - Spanish
- `/messages/fr.json` - French
- `/messages/de.json` - German
- `/messages/it.json` - Italian

Look for the `"promo"` section:

```json
"promo": {
  "message": "Todos os eventos desportivos num só lugar.",
  "features": {
    "nearYou": "Eventos perto de ti",
    "filters": "Filtros por desporto e data",
    ...
  },
  ...
}
```

### Feature List

Edit `/app/promo/config.ts` to change which features are shown:

```typescript
featureKeys: ["nearYou", "filters", "details", "favorites", "share"];
```

**Available features** (defined in translation files):

- `nearYou` - Events near you
- `filters` - Filter by sport and date
- `details` - Details and registration links
- `favorites` - Save favorites
- `share` - Share with friends

### Animation Settings

Edit `/app/promo/config.ts`:

```typescript
animation: {
  fadeInDuration: 0.5,    // Speed of fade-in animations
  fadeOutDuration: 0.4,   // Speed of fade-out animations
  staggerDelay: 0.15,     // Delay between feature items
}
```

## Troubleshooting

### Video Not Playing

**Symptoms**: Black screen or video doesn't start

**Solutions**:

1. Check video file exists at `/public/promo/promo.mp4`
2. Verify video codec is H.264 (MP4)
3. Try refreshing the page
4. On mobile: Tap the "Play Video" button if it appears
5. Check browser console for errors
6. Ensure file size is reasonable (< 10 MB)

### Video Not Loading on Mobile

**Symptoms**: Fallback image shows instead of video

**Solutions**:

1. Ensure video file is not too large (< 10 MB)
2. Use H.264 codec for better mobile support
3. Check internet connection
4. Create a poster image as fallback

### Animations Not Smooth

**Symptoms**: Choppy or laggy animations

**Solutions**:

1. Reduce video file size
2. Use lower resolution video (720p instead of 1080p)
3. Compress video with HandBrake or similar tool
4. Check device performance

### Page Not Accessible

**Symptoms**: 404 error when visiting `/promo`

**Solutions**:

1. Clear browser cache
2. Verify middleware configuration in `/middleware.ts`
3. Check Next.js build output for errors
4. Ensure page is deployed correctly

## Technical Details

### File Structure

```
/app/promo/
├── page.tsx       # Main component with timeline logic
├── layout.tsx     # Layout without header/footer
└── config.ts      # Configuration (durations, features, etc.)

/public/promo/
├── promo.mp4      # Main video file (add manually)
├── promo.webm     # Alternative format (optional)
├── poster.jpg     # Fallback image (optional)
└── README.md      # Instructions for admin
```

### How It Works

1. **Video Background**: Plays automatically with `muted`, `loop`, and `playsInline` attributes
2. **Timeline**: Uses `setTimeout` to advance through steps based on configured durations
3. **Animations**: Framer Motion handles smooth transitions between steps
4. **Loop**: After final step, resets to step 0 automatically
5. **Accessibility**: Respects `prefers-reduced-motion` setting

### Browser Support

- ✅ Chrome/Edge (all platforms)
- ✅ Safari (iOS/macOS)
- ✅ Firefox (desktop/mobile)
- ✅ Samsung Internet
- ⚠️ Older browsers may not support autoplay

### Performance

- Initial load: ~2-5 MB (video size dependent)
- Runtime: Minimal CPU/memory usage
- Mobile-optimized: 60 FPS animations
- No external dependencies beyond Framer Motion

## Best Practices

1. **Video Quality**: Use compressed but high-quality videos
2. **File Size**: Keep under 10 MB for fast loading
3. **Testing**: Always test on actual mobile devices
4. **Recording**: Record in a quiet environment with good lighting
5. **Instagram**: Add music and effects in Instagram before posting
6. **Variants**: Create multiple versions with different videos for variety

## Future Enhancements

Potential improvements:

- Support for multiple video variants (seasonal, event-specific)
- Admin panel for uploading videos
- Export to MP4 directly in browser
- Customizable color themes
- More animation styles

## Support

For issues or questions:

1. Check this documentation first
2. Review `/public/promo/README.md` for video setup
3. Inspect browser console for errors
4. Contact development team

---

**Last Updated**: January 2026  
**Version**: 1.0
