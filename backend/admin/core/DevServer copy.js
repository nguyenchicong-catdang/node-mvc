// backend/admin/core/DevServer.js
// npm i node-fetch
import fetch from 'node-fetch';
// npm i http-proxy-middleware
import { createProxyMiddleware } from 'http-proxy-middleware';
class DevServer {
    constructor(app) {
        this.fetchVite(app);
        //this.proxyVite(app); 
    }

    apiProxy() {
        createProxyMiddleware({
            target: 'http://localhost:5173',
            changeOrigin: true,
        });
    }

    fetchVite(app) {
        app.get('/dev/', async (req, res) => {
            const response = await fetch('http://localhost:5173');
            const htmlContent = await response.text();
            // Thiết lập Content-Type để trình duyệt hiểu đây là HTML
            res.setHeader('Content-Type', 'text/html');

            // Gửi nội dung HTML về trình duyệt
            res.send(htmlContent);
        });
        // app.use('/@vite/client', this.apiProxy);
    }

    // proxyVite(app) {
    //     app.use('/@vite/client', this.apiProxy);
    // }
}

export {DevServer}