// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "no",
      },

      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Nabolagshelse - Analyse av folkehelsedata på kommunalt og fylkeskommunalt nivå",
        },
        {
          name: "keywords",
          content: "folkehelse, levekår, kommunedata, nabolagshelse",
        },
      ],
      script: [
        {
          src: "https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.js",
        },
        {
          type: "text/javascript",
          innerHTML: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "okkb3bztqo");`,
        },
      ],
    },
  },
  modules: [
    "@pinia/nuxt", // https://pinia.vuejs.org/ssr/nuxt.html
    "@nuxtjs/eslint-module", // https://nuxt.com/modules/eslint
    "@nuxtjs/tailwindcss", // https://nuxt.com/modules/tailwindcss
    "nuxt-lucide-icons", //
    "@formkit/auto-animate/nuxt",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Epilogue: "300..700",
          Helvetica: "300..700",
        },
      },
    ],
  ],
  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/style.scss",
    "mapbox-gl/dist/mapbox-gl.css",
  ],
  ssr: false,
  nitro: {
    preset: "static",
  },
  pinia: {
    storesDirs: ["./store/**"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      deployEnv: process.env.NUXT_PUBLIC_DEPLOY_ENV,
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN,
      firebaseConfig: process.env.NUXT_PUBLIC_FIREBASE_CONFIG,
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      projectId: process.env.GCP_PROJECT_ID,
    },
  },
  appConfig: {},
  devtools: { enabled: true },
  eslint: {
    lintOnStart: false,
    exclude: ["**/*"],
  },

  routeRules: {
    "/": { redirect: "/dashboard/demo" },
    "/dashboard/**": {
      appMiddleware: ["auth-token-guard"],
    },
    "/sonebygger/**": {
      appMiddleware: ["auth-token-guard"],
    },
  },
});
