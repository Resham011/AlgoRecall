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
        // This rewrite rule removes the '/api' prefix
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
