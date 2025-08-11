import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        // Copy manifest.json
        {
          src: "src/manifest.json",
          dest: ""
        },
        // Copy HTML files
        {
          src: "src/dashboard/index.html",
          dest: "dashboard"
        },
        {
          src: "src/popup/popup.html",
          dest: "popup"
        },
        {
          src: "src/popup/detectPopup.html",
          dest: "popup"
        },
        {
          src: "src/options/options.html",
          dest: "options"
        },
        // Copy icons
        {
          src: "src/icons/**/*",
          dest: "icons"
        },
        // Copy locales
        {
          src: "src/_locales/**/*",
          dest: "_locales"
        },
        // Copy lib files
        {
          src: "src/lib/**/*",
          dest: "lib"
        },
        // Copy dashboard lib
        {
          src: "src/dashboard/lib/**/*",
          dest: "dashboard/lib"
        },
        // Copy CSS files
        {
          src: "src/css/**/*",
          dest: "css"
        }
      ]
    })
  ],

  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        // Background
        "background/service-worker": resolve(
          __dirname,
          "src/background/service-worker.js"
        ),

        // Popup
        "popup/popup": resolve(__dirname, "src/popup/popup.js"),
        "popup/detectPopup": resolve(__dirname, "src/popup/detectPopup.js"),

        // Dashboard
        "dashboard/dashboard": resolve(__dirname, "src/dashboard/dashboard.js"),

        // Options
        "options/options": resolve(__dirname, "src/options/options.js"),

        // Contents
        "contents/listener": resolve(__dirname, "src/contents/listener.js"),
        "contents/core/hl-core": resolve(
          __dirname,
          "src/contents/core/hl-core.js"
        ),
        "contents/application": resolve(
          __dirname,
          "src/contents/application.js"
        ),
        "contents/contents": resolve(__dirname, "src/contents/contents.js"),
        "contents/core/core": resolve(__dirname, "src/contents/core/core.js"),
        "contents/form": resolve(__dirname, "src/contents/form.js"),
        "contents/common": resolve(__dirname, "src/contents/common.js"),
        "contents/global/config": resolve(
          __dirname,
          "src/contents/global/config.js"
        ),
        "contents/global/url": resolve(__dirname, "src/contents/global/url.js"),

        // Common
        "common/common": resolve(__dirname, "src/common/common.js")
      },

      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].[hash].js",
        assetFileNames: "[name].[ext]",
        format: "es"
      },

      // Disable code splitting for Content Scripts to make them self-contained
      external: id => {
        // Don't externalize chrome APIs
        return id === "chrome" || id.startsWith("chrome.");
      }
    },

    // Chrome extension specific
    target: "es2020",
    minify: true,

    // Copy static files
    copyPublicDir: false
  },

  // For development
  server: {
    port: 3000
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    },
    extensions: [".js", ".vue", ".ts", ".jsx", ".tsx", ".json"]
  }
});
