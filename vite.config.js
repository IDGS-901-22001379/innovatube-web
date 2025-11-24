import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // para que funcione en modo dev
        type: "module",
      },
      includeAssets: [
        // raíz
        "/icono.png",

        // ANDROID
        "/android/android-launchericon-48-48.png",
        "/android/android-launchericon-72-72.png",
        "/android/android-launchericon-96-96.png",
        "/android/android-launchericon-144-144.png",
        "/android/android-launchericon-192-192.png",
        "/android/android-launchericon-512-512.png",

        // WINDOWS 11 (tiles, splash, store, etc.)
        "/windows11/LargeTile.scale-100.png",
        "/windows11/LargeTile.scale-125.png",
        "/windows11/LargeTile.scale-150.png",
        "/windows11/LargeTile.scale-200.png",
        "/windows11/LargeTile.scale-400.png",

        "/windows11/SmallTile.scale-100.png",
        "/windows11/SmallTile.scale-125.png",
        "/windows11/SmallTile.scale-150.png",
        "/windows11/SmallTile.scale-200.png",
        "/windows11/SmallTile.scale-400.png",

        "/windows11/SplashScreen.scale-100.png",
        "/windows11/SplashScreen.scale-125.png",
        "/windows11/SplashScreen.scale-150.png",
        "/windows11/SplashScreen.scale-200.png",
        "/windows11/SplashScreen.scale-400.png",

        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
        "/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",

        "/windows11/Square44x44Logo.targetsize-16.png",
        "/windows11/Square44x44Logo.targetsize-20.png",
        "/windows11/Square44x44Logo.targetsize-24.png",
        "/windows11/Square44x44Logo.targetsize-30.png",
        "/windows11/Square44x44Logo.targetsize-32.png",
        "/windows11/Square44x44Logo.targetsize-36.png",
        "/windows11/Square44x44Logo.targetsize-40.png",
        "/windows11/Square44x44Logo.targetsize-44.png",
        "/windows11/Square44x44Logo.targetsize-48.png",
        "/windows11/Square44x44Logo.targetsize-60.png",
        "/windows11/Square44x44Logo.targetsize-64.png",
        "/windows11/Square44x44Logo.targetsize-72.png",
        "/windows11/Square44x44Logo.targetsize-80.png",
        "/windows11/Square44x44Logo.targetsize-96.png",
        "/windows11/Square44x44Logo.targetsize-256.png",

        "/windows11/Square150x150Logo.scale-100.png",
        "/windows11/Square150x150Logo.scale-125.png",
        "/windows11/Square150x150Logo.scale-150.png",
        "/windows11/Square150x150Logo.scale-200.png",
        "/windows11/Square150x150Logo.scale-400.png",

        "/windows11/StoreLogo.scale-100.png",
        "/windows11/StoreLogo.scale-125.png",
        "/windows11/StoreLogo.scale-150.png",
        "/windows11/StoreLogo.scale-200.png",
        "/windows11/StoreLogo.scale-400.png",

        "/windows11/Wide310x150Logo.scale-100.png",
        "/windows11/Wide310x150Logo.scale-125.png",
        "/windows11/Wide310x150Logo.scale-150.png",
        "/windows11/Wide310x150Logo.scale-200.png",
        "/windows11/Wide310x150Logo.scale-400.png",
      ],
      manifest: {
        name: "InnovaTube",
        short_name: "InnovaTube",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          // ANDROID (usados también por Chrome)
          {
            src: "/android/android-launchericon-48-48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/android/android-launchericon-72-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/android/android-launchericon-96-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/android/android-launchericon-144-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/android/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },

          // IOS (se usan como iconos adicionales para diferentes resoluciones)
          { src: "/ios/16.png", sizes: "16x16", type: "image/png" },
          { src: "/ios/20.png", sizes: "20x20", type: "image/png" },
          { src: "/ios/29.png", sizes: "29x29", type: "image/png" },
          { src: "/ios/32.png", sizes: "32x32", type: "image/png" },
          { src: "/ios/40.png", sizes: "40x40", type: "image/png" },
          { src: "/ios/50.png", sizes: "50x50", type: "image/png" },
          { src: "/ios/57.png", sizes: "57x57", type: "image/png" },
          { src: "/ios/58.png", sizes: "58x58", type: "image/png" },
          { src: "/ios/60.png", sizes: "60x60", type: "image/png" },
          { src: "/ios/64.png", sizes: "64x64", type: "image/png" },
          { src: "/ios/72.png", sizes: "72x72", type: "image/png" },
          { src: "/ios/76.png", sizes: "76x76", type: "image/png" },
          { src: "/ios/80.png", sizes: "80x80", type: "image/png" },
          { src: "/ios/87.png", sizes: "87x87", type: "image/png" },
          { src: "/ios/100.png", sizes: "100x100", type: "image/png" },
          { src: "/ios/114.png", sizes: "114x114", type: "image/png" },
          { src: "/ios/120.png", sizes: "120x120", type: "image/png" },
          { src: "/ios/128.png", sizes: "128x128", type: "image/png" },
          { src: "/ios/144.png", sizes: "144x144", type: "image/png" },
          { src: "/ios/152.png", sizes: "152x152", type: "image/png" },
          { src: "/ios/167.png", sizes: "167x167", type: "image/png" },
          { src: "/ios/180.png", sizes: "180x180", type: "image/png" },
          { src: "/ios/192.png", sizes: "192x192", type: "image/png" },
          { src: "/ios/256.png", sizes: "256x256", type: "image/png" },
          { src: "/ios/512.png", sizes: "512x512", type: "image/png" },
          { src: "/ios/1024.png", sizes: "1024x1024", type: "image/png" },
        ],
      },
    }),
  ],
});
