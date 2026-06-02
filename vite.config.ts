import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  appType: 'spa',
  server: {
    host: "::",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5174,
    hmr: {
      overlay: false,
    },
    middlewareMode: false,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // SPA fallback middleware for client-side routing
    {
      name: 'spa-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            // If request is not for a file/asset and doesn't have an extension, serve index.html
            if (
              req.url &&
              !req.url.includes('.') &&
              !req.url.includes('/api/') &&
              req.method === 'GET'
            ) {
              req.url = '/index.html';
            }
            next();
          });
        };
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
