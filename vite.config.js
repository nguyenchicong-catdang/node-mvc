// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
// npm i vite-include-html-plugin -->> vite-plugin-include-html
// import includeHtml from "vite-plugin-include-html";
// npm i vite-plugin-include-html -D
import includeHtml from "vite-plugin-include-html";
export default defineConfig({
    root: './frontend',
    // Set the public directory to a different folder
    publicDir: 'static',
    plugins: [includeHtml()],
    server: {
        // Cấu hình cổng cho dev server
        port: 5173,

        // Mở trình duyệt tự động khi server khởi động
        open: true,

        // Tùy chỉnh proxy
        proxy: {
            '/api/admin/': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                //rewrite: (path) => path.replace(/^\/api/, ''),
            },
            // Proxy một đường dẫn cụ thể khác
            '/auth/login': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'public',
        rollupOptions: {
            input: {
                //'frontend/admin/login': resolve(__dirname, 'frontend/admin/login/login.html')
            },
            output: {
                // Cấu hình tên file đầu ra dựa trên tên điểm vào
                //entryFileNames: '[name]/[name]-[hash].js',
                entryFileNames: '[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },
});