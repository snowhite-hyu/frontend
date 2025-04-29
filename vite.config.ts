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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("axios")) {
            return "@network";
          }
          if (id.includes("node_modules")) {
            return "@vendor";
          }
        },
      },
    },
  },
})
