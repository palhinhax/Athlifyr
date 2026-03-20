import React from "react";
import { Image, ImageStyle } from "expo-image";
import { Platform, StyleProp } from "react-native";

interface CachedImageProps {
  /** Image URL */
  uri: string | null | undefined;
  /** Style for the image */
  style?: StyleProp<ImageStyle>;
  /** Alt text for accessibility */
  alt?: string;
  /** Content fit mode */
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Placeholder blur hash or color */
  placeholder?: string;
  /** Transition duration in ms (default: 200) */
  transition?: number;
  /** Cache policy: 'disk' persists across sessions */
  cachePolicy?: "none" | "disk" | "memory" | "memory-disk";
  /** Priority for loading (low/normal/high) */
  priority?: "low" | "normal" | "high";
}

/**
 * CachedImage - A drop-in replacement for React Native's Image component
 * that uses expo-image for aggressive disk caching.
 *
 * Benefits over RN Image:
 * - Persistent disk cache (survives app restarts)
 * - Memory cache for instant re-renders
 * - Smooth crossfade transitions
 * - WebP/AVIF support
 * - Placeholder blur support
 * - Significantly reduces B2 bandwidth usage
 */
export function CachedImage({
  uri,
  style,
  alt = "",
  contentFit = "cover",
  placeholder,
  transition = 200,
  cachePolicy = "memory-disk",
  priority = "normal",
}: CachedImageProps) {
  if (!uri) return null;

  return (
    <Image
      source={{ uri }}
      style={style}
      alt={alt}
      contentFit={contentFit}
      placeholder={placeholder}
      transition={transition}
      cachePolicy={cachePolicy}
      priority={priority}
      recyclingKey={uri}
      {...(Platform.OS === "web"
        ? { accessibilityLabel: alt || undefined }
        : {})}
    />
  );
}

/**
 * CachedAvatar - Optimized for small circular avatar images
 * Uses memory-disk cache and high priority for instant display
 */
export function CachedAvatar({
  uri,
  style,
  size = 40,
  alt = "",
}: {
  uri: string | null | undefined;
  style?: StyleProp<ImageStyle>;
  size?: number;
  alt?: string;
}) {
  if (!uri) return null;

  return (
    <Image
      source={{ uri }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      alt={alt}
      contentFit="cover"
      cachePolicy="memory-disk"
      priority="high"
      transition={100}
      recyclingKey={uri}
      {...(Platform.OS === "web"
        ? { accessibilityLabel: alt || undefined }
        : {})}
    />
  );
}
