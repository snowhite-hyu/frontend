import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import biomePlugin from "vite-plugin-biome"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    biomePlugin({
      mode: 'lint',
      files: './src',
    }),
    tsconfigPaths(),
  ],
})
