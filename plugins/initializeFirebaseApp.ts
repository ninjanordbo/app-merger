import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const rawConfig = runtimeConfig.public.firebaseConfig;

  if (!rawConfig) {
    console.warn("NUXT_PUBLIC_FIREBASE_CONFIG is missing or empty. Firebase will not be initialized.");
    return;
  }

  try {
    const decodedConfig = atob(rawConfig);
    const firebaseConfig = JSON.parse(decodedConfig);

    const app = initializeApp(firebaseConfig);
    if (runtimeConfig.public.deployEnv === "production") {
      getAnalytics(app);
    }
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
});
