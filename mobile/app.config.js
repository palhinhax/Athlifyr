const config = ({ config }) => {
  return {
    ...config,
    plugins: [
      "expo-router",
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
