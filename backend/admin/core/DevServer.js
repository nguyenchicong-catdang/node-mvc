// backend/admin/core/DevServer.js
// npm i node-fetch
import fetch from 'node-fetch';
// npm i http-proxy-middleware
import { createProxyMiddleware } from 'http-proxy-middleware';
class DevServer {
    constructor(app) {
        //this.apiProxy();
        this.fetchVite(app);
        //this.proxyVite(app); 
        //this.viteProxyMiddleware();
        this.proxyVite(app)
    }

    viteProxyMiddleware() {
        return createProxyMiddleware({
            //target: 'https://effective-happiness-g4w5jr44rgwrhwg6-5173.app.github.dev', // The target URL of the Vite dev server
            target: 'http://localhost:5173', // The target URL of the Vite dev server
            changeOrigin: true, // Needed for virtual hosting
            ws: true, // Enable proxying of WebSocket requests
            //logLevel: 'debug' // Optional: log proxying activity for debugging
        });
    }

    fetchVite(app) {
    app.get('/dev/', async (req, res) => {
        try {
            // Fetch the HTML from the Vite development server
            const response = await fetch('http://localhost:5173');
            // ... error handling ...
            let htmlContent = await response.text();

            // ❌ DO NOT replace the URL. Leave it as a relative path.
            // const viteClientRegex = /(src=")\/(@vite\/client")/g;
            // htmlContent = htmlContent.replace(viteClientRegex, `$1https://.../$2`);

            res.setHeader('Content-Type', 'text/html');
            res.send(htmlContent);
        } catch (error) {
            console.error('Error handling /dev/ request:', error);
            res.status(500).send('An error occurred.');
        }
    });
}

    proxyVite(app) {
    // app.use(
    //     ['/@vite', '/src', '/node_modules'], // Proxy all Vite-related assets
    //     this.viteProxyMiddleware()
    // );
    // ws:
    app.use(this.viteProxyMiddleware());
    app.get('/@vite/client', this.viteProxyMiddleware());
    app.get('/@fs/{*splat}', this.viteProxyMiddleware());
    
}
}

export {DevServer}