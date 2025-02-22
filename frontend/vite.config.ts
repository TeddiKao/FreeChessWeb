import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@utils": path.resolve(__dirname, "frontend/src/utils"),
      "@styles": path.resolve(__dirname, "frontend/src/styles"),
      "@pages": path.resolve(__dirname, "frontend/src/pages"),
      "@hooks": path.resolve(__dirname, "frontend/src/hooks"),
    }
  }
})
