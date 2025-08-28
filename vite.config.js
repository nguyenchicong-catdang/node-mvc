// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    root: './frontend',
    server: {
        // Cấu hình cổng cho dev server
        port: 5173,

        // Mở trình duyệt tự động khi server khởi động
        open: true,

        // Tùy chỉnh proxy
        proxy: {
        '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
        },
        },
    },
});