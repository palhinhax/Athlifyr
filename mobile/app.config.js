/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
/* eslint-enable @typescript-eslint/no-require-imports */

/**
 * Read the version from the root package.json (managed by semantic-release).
 * This ensures the mobile app version always matches the web release version.
 */
function getWebVersion() {
  try {
    const rootPkg = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8")
    );
    return rootPkg.version || "1.1.0";
  } catch {
    return "1.1.0";
  }
}

const config = ({ config }) => {
  const version = getWebVersion();

  return {
    ...config,
    version,
    ios: {
      ...config.ios,
      buildNumber: String(config.ios?.buildNumber || "1"),
    },
    android: {
      ...config.android,
      versionCode: config.android?.versionCode || 1,
    },
    plugins: [
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "O Athlifyr precisa da tua localização em segundo plano para registar o percurso da corrida mesmo com o ecrã bloqueado.",
          locationWhenInUsePermission:
            "O Athlifyr precisa da tua localização para registar o percurso da corrida.",
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true,
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission:
            "Allow Athlifyr to access your camera to take photos and videos.",
          microphonePermission:
            "Allow Athlifyr to access your microphone for video recording.",
          recordAudioAndroid: true,
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission:
            "Allow Athlifyr to save photos and videos to your gallery.",
          savePhotosPermission:
            "Allow Athlifyr to save photos and videos to your gallery.",
          isAccessMediaLocationEnabled: true,
        },
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken:
            process.env.MAPBOX_DOWNLOADS_TOKEN || "YOUR_MAPBOX_SECRET_TOKEN",
        },
      ],
      "@react-native-community/datetimepicker",
    ],
  };
};

export default config;
