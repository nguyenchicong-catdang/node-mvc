// server.js

import express from 'express';
import { AdminRouter } from './backend/admin/core/AdminRouter.js';;
import { adminApi } from './backend/admin/core/adminApi.js';
const app = express();
const port = 3000;

// Khởi tạo một instance của AdminRouter
const adminRouterInstance = new AdminRouter();

// Sử dụng router của lớp AdminRouter làm middleware
// Tất cả các yêu cầu đến '/admin' sẽ được xử lý bởi AdminRouter

app.use('/admin', adminRouterInstance.getRouter());
app.all('/admin/api', adminApi());
app.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
})