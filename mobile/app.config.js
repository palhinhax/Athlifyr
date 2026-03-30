const config = ({ config }) => {
  // Add the reversed iOS client ID as a URL scheme so iOS can handle
  // the Google OAuth redirect deep-link (com.googleusercontent.apps.<id>:/oauth2redirect).
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const reversedIosClientId = iosClientId
    ? iosClientId.split(".").reverse().join(".")
    : null;

  const schemes = Array.isArray(config.scheme)
    ? [...config.scheme]
    : config.scheme
      ? [config.scheme]
      : [];

  if (reversedIosClientId && !schemes.includes(reversedIosClientId)) {
    schemes.push(reversedIosClientId);
  }

  return {
    ...config,
    scheme: schemes,
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
      "expo-apple-authentication",
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
            "Athlifyr uses the camera to update your profile photo and record exercise videos for motion analysis. For example, you can film a lift to review your form.",
          microphonePermission:
            "Athlifyr uses the microphone to capture audio when you record exercise videos for motion analysis.",
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
      [
        "@sentry/react-native/expo",
        {
          organization: "athlifyr",
          project: "react-native",
        },
      ],
    ],
  };
};

export default config;
