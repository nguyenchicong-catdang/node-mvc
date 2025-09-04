// backend/admin/core/DevServer.js
// npm i http-proxy-middleware
import { createProxyMiddleware } from 'http-proxy-middleware';

class DevServer {
    constructor(app) {
        const viteProxy = createProxyMiddleware({
            target: 'http://localhost:5173', // The address of your Vite dev server
            changeOrigin: true,
            // You can add a filter to proxy requests that do not match any of your API routes
            // This is a robust way to handle both the frontend and backend in one server.
            router: (req) => {
                // This checks if the request is for the dev server (not a static asset or API route)
                if (req.url.startsWith('/dev') || req.url.startsWith('/@vite')) {
                    return 'http://localhost:5173';
                }
                return req.headers.host;
            },
            // This rewrites the path for requests starting with /dev
            pathRewrite: {
                '^/dev': '', 
            },
        });

        // Apply the proxy middleware for all incoming requests.
        // It will use the 'router' to decide whether to proxy to Vite or not.
        app.use(viteProxy);
    }
}

export { DevServer };