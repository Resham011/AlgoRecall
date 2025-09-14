// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // This proxy redirects API requests from your frontend to your backend server
//   // during development to avoid CORS issues.
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://algorecall.onrender.com/', // Make sure this matches your backend's port
//         changeOrigin: true,
//       },
//     },
//   },
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://algorecall.onrender.com',
        changeOrigin: true,
        // ✅ Do NOT strip `/api`, backend expects it
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url);
            console.log('To target:', options.target + proxyReq.path);
          });
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
})
