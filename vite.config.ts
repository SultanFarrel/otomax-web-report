import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "metropln.report.web.id-key.pem")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "metropln.report.web.id.pem")
      ),
    },
    // ONLY ON DEV, DELETE ON PRODUCTION
    proxy: {
      "/api": {
        target: "https://metropln.report.web.id:4000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
