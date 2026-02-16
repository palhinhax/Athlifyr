const config = ({ config }) => {
  return {
    ...config,
    plugins: [
      "expo-router",
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken:
            process.env.MAPBOX_DOWNLOADS_TOKEN || "YOUR_MAPBOX_SECRET_TOKEN",
        },
      ],
    ],
  };
};

export default config;
