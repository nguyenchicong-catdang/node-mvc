## Cài đặt Express Router

Để xây dựng một lớp (class) với Express Router, bạn cần kết hợp các phương thức của lớp với các phương thức định tuyến của Express. Dưới đây là cách bạn có thể thực hiện.

### 1\. Cài đặt Express Router

Đầu tiên, hãy cài đặt Express nếu bạn chưa làm:

```bash
npm install express
```

-----

### 2\. Sửa đổi lớp `AdminRouter`

Bạn cần nhập `Router` từ Express vào lớp của mình và khởi tạo nó trong hàm `constructor`. Sau đó, bạn có thể định nghĩa các phương thức của lớp để xử lý các yêu cầu HTTP (như `GET`, `POST`, v.v.).

```javascript
// backend/admin/core/AdminRouter.js

import { Router } from 'express';

class AdminRouter {
    constructor() {
        // Khởi tạo một Express Router
        this.router = Router();

        // Định nghĩa các route trong constructor
        this.defineRoutes();
    }

    defineRoutes() {
        // Định nghĩa route GET cho đường dẫn gốc '/'
        this.router.get('/', (req, res) => {
            res.send('Đây là trang admin.');
        });
        
        // Bạn có thể định nghĩa các route khác ở đây
        // this.router.get('/dashboard', (req, res) => { ... });
    }

    // Một phương thức để trả về đối tượng router đã được định nghĩa
    getRouter() {
        return this.router;
    }
}

export { AdminRouter };
```

-----

### 3\. Sử dụng lớp `AdminRouter`

Trong file chính của bạn (ví dụ: `server.js`), bạn có thể sử dụng lớp này như một middleware của Express.

```javascript
// server.js

import express from 'express';
import { AdminRouter } from './backend/admin/core/AdminRouter.js';

const app = express();
const port = 3000;

// Khởi tạo một instance của AdminRouter
const adminRouter = new AdminRouter();

// Sử dụng router của lớp AdminRouter làm middleware
// Tất cả các yêu cầu đến '/admin' sẽ được xử lý bởi AdminRouter
app.use('/admin', adminRouter.getRouter());

app.listen(port, () => {
    console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
});
```

Bây giờ, khi bạn truy cập `http://localhost:3000/admin`, bạn sẽ nhận được phản hồi từ route mà bạn đã định nghĩa trong lớp `AdminRouter`.

## nhiều routes

Có, bạn hoàn toàn có thể có nhiều class import `Router` từ Express. Đây là một cách tiếp cận phổ biến và hiệu quả để cấu trúc ứng dụng lớn, giúp bạn chia nhỏ mã nguồn thành các module độc lập và dễ quản lý hơn.

### Ví dụ về cấu trúc dự án

Giả sử bạn có một ứng dụng với hai phần chính: **admin** và **store**. Bạn có thể tạo các lớp riêng biệt để quản lý các tuyến đường (routes) cho mỗi phần.

```
- project_root/
  - routers/
    - AdminRouter.js
    - StoreRouter.js
  - server.js
```

-----

### 1\. Lớp `StoreRouter`

Tương tự như `AdminRouter`, bạn sẽ tạo một lớp để quản lý các tuyến đường cho phần cửa hàng công cộng.

```javascript
// routers/StoreRouter.js

import { Router } from 'express';

class StoreRouter {
    constructor() {
        this.router = Router();
        this.defineRoutes();
    }

    defineRoutes() {
        // Route cho trang chủ cửa hàng
        this.router.get('/', (req, res) => {
            res.send('Chào mừng đến với cửa hàng của chúng tôi!');
        });

        // Route cho trang sản phẩm
        this.router.get('/products/:id', (req, res) => {
            res.send(`Đây là trang sản phẩm ${req.params.id}`);
        });
    }

    getRouter() {
        return this.router;
    }
}

export { StoreRouter };
```

-----

### 2\. Sử dụng nhiều Router trong `server.js`

Trong file chính `server.js`, bạn sẽ import cả hai lớp router và sử dụng chúng làm middleware với các tiền tố (prefixes) khác nhau.

```javascript
// server.js

import express from 'express';
import { AdminRouter } from './routers/AdminRouter.js';
import { StoreRouter } from './routers/StoreRouter.js';

const app = express();
const port = 3000;

// Khởi tạo các router
const adminRouter = new AdminRouter();
const storeRouter = new StoreRouter();

// Sử dụng router admin với tiền tố '/admin'
app.use('/admin', adminRouter.getRouter());

// Sử dụng router cửa hàng với tiền tố '/'
app.use('/', storeRouter.getRouter());

app.listen(port, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});
```

Với cấu hình này:

  * Các yêu cầu đến `http://localhost:3000/` sẽ được xử lý bởi `StoreRouter`.
  * Các yêu cầu đến `http://localhost:3000/admin` sẽ được xử lý bởi `AdminRouter`.

Việc sử dụng nhiều router giúp mã nguồn của bạn trở nên gọn gàng, có tổ chức, và dễ bảo trì hơn rất nhiều.