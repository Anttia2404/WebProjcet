import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Bất kỳ yêu cầu nào đến /api đều được chuyển tiếp đến Backend
      "/api": {
        // THAY 5432 BẰNG CỔNG SERVER CHÍNH XÁC CỦA BẠN
        target: "http://localhost:5173",
        changeOrigin: true, // Quan trọng để thay đổi host header
        secure: false,
      },
    },
  },
});
