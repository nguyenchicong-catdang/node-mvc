// vite.client.config.js
import { defineConfig } from "vite";
import { resolve } from 'path';
export default defineConfig({
    root: resolve(__dirname, 'frontend'),
    publicDir: resolve(__dirname, 'static'),
    build: {
        outDir: resolve(__dirname, 'public'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                'login': '/login/index.html',
            },
            output: {
                // Cấu hình tên file đầu ra dựa trên tên điểm vào
                //entryFileNames: '[name]/[name]-[hash].js',
                //entryFileNames: '[name]-[hash].js',
                entryFileNames: 'client/[name]/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            }
        }
    }
});