import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
    // Inside Docker the source is a bind mount, and filesystem events from the
    // Windows/macOS host do not reach the container. Poll instead.
    ...(process.env["CHOKIDAR_USEPOLLING"] === "true"
      ? { watch: { usePolling: true, interval: 300 } }
      : {}),
    // When the container port is published on a different host port, the HMR
    // websocket has to be told which port the browser should dial.
    ...(process.env["VITE_HMR_CLIENT_PORT"]
      ? { hmr: { clientPort: Number(process.env["VITE_HMR_CLIENT_PORT"]) } }
      : {}),
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
