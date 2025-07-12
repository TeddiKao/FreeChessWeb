import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@sharedComponents": path.resolve(__dirname, "./src/shared/components"),
      "@sharedHooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@sharedTypes": path.resolve(__dirname, "./src/shared/types"),
      "@sharedUtils": path.resolve(__dirname, "./src/shared/utils"),
      "@sharedConstants": path.resolve(__dirname, "./src/shared/constants"),
      "@sharedEnums": path.resolve(__dirname, "./src/shared/enums"),
      "@sharedStyles": path.resolve(__dirname, "./src/shared/styles"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@auth": path.resolve(__dirname, "./src/features/auth"),
      "@challenge": path.resolve(__dirname, "./src/features/challenge"),
      "@gameHistory": path.resolve(__dirname, "./src/features/gameHistory"),
      "@gameplay": path.resolve(__dirname, "./src/features/gameplay"),
      "@gameReplay": path.resolve(__dirname, "./src/features/gameReplay"),
      "@gameSetup": path.resolve(__dirname, "./src/features/gameSetup"),
      "@matchmaking": path.resolve(__dirname, "./src/features/matchmaking"),
      "@settings": path.resolve(__dirname, "./src/features/settings"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@appApi": path.resolve(__dirname, "./src/app/api"),
      "@appProviders": path.resolve(__dirname, "./src/app/providers"),
      "@appRouting": path.resolve(__dirname, "./src/app/routing"),
      "@appStyles": path.resolve(__dirname, "./src/app/styles"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    }
  }
})
