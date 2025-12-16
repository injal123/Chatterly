import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.riv'],  // to import .riv files (Rive animations).
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:3000",
  //   },
  // },
})




// Vite dev server-proxy: only used in development.
// Any request to /api is forwarded to http://localhost:3000 (backend).
// Browser sees the request as same-origin (localhost:5173 → localhost:5173)
// This avoids CORS in dev.


// In production, if frontend and backend are on different origins (e.g. port) like here my frontend runs on port 5173 while backend on 3000, you must enable CORS on the backend, instead of server-proxy.
