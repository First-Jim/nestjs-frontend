import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

function pathResolve(dir) {
  return resolve(process.cwd(), ".", dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": pathResolve("src"),
      "~bootstrap": "bootstrap",
      // "axios/lib": pathResolve("./node_modules/axios/lib"),
      // Fix: Missing "./lib/helpers/buildURL" specifier in "axios" package 'axios/lib': path.resolve(__dirname, './node_modules/axios/lib') }
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    host: "0.0.0.0",
    port: 8888,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import './src/styles/variables.scss';`,
      },
    },
  },
});
