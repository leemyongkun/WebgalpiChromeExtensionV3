import { defineConfig } from "vite";
import { resolve } from "path";

// Separate config for content scripts to handle ES modules issue
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "contents/listener-bundled": resolve(
          __dirname,
          "src/contents/listener.js"
        )
      },
      output: {
        entryFileNames: "[name].js",
        format: "iife",
        // Inline all dependencies into a single file
        inlineDynamicImports: true
      },
      external: id => {
        // Don't externalize chrome APIs
        return id === "chrome" || id.startsWith("chrome.");
      }
    },
    target: "es2020",
    minify: true,
    copyPublicDir: false
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    },
    extensions: [".js", ".vue", ".ts", ".jsx", ".tsx", ".json"]
  }
});
