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
            target: 'https://effective-happiness-g4w5jr44rgwrhwg6-5173.app.github.dev', // The target URL of the Vite dev server
            //target: 'http://localhost:5173', // The target URL of the Vite dev server
            changeOrigin: true, // Needed for virtual hosting
            ws: true, // Enable proxying of WebSocket requests
            logLevel: 'debug' // Optional: log proxying activity for debugging
        });
    }

    fetchVite(app) {
        app.get('/dev/', async (req, res) => {
            try {
        // Fetch the HTML content from the Vite development server
        const response = await fetch('http://localhost:5173');
        if (!response.ok) {
            throw new Error(`Failed to fetch from Vite server: ${response.statusText}`);
        }
        let htmlContent = await response.text();

        // Use a regular expression to find and replace the script tag's source
        // The regex finds `src="/@vite/client"` and replaces it with the full URL.
        const viteClientRegex = /(src=")\/(@vite\/client")/g;
        htmlContent = htmlContent.replace(viteClientRegex, `$1https://effective-happiness-g4w5jr44rgwrhwg6-5173.app.github.dev/$2`);
        //htmlContent = htmlContent.replace(viteClientRegex, `$1http://localhost:5173/$2`);

        // Set the Content-Type header so the browser knows this is HTML
        res.setHeader('Content-Type', 'text/html');

        // Send the modified HTML content to the browser
        res.send(htmlContent);
        } catch (error) {
            console.error('Error handling /dev/ request:', error);
            res.status(500).send('An error occurred while fetching the content.');
        }
        });
        // app.use('/@vite/client', this.apiProxy);
    }

    proxyVite(app) {
        console.log(this.viteProxyMiddleware())
        app.use('/@vite/client', this.viteProxyMiddleware());
    }
}

export {DevServer}