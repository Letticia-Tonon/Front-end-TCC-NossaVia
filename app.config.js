export default ({config}) => {
  return {
    ...config,
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.frsouzaa.nossavia",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
        }
      }
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "3f7e6023-6bd2-4e09-8b79-6bd54df41d67"
      }
    }
  }
}
