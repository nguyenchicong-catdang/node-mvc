// server.js

import express from 'express';
import formidable from 'express-formidable';
//import { AdminRouter } from './backend/admin/core/AdminRouter.js';;
import { adminApi } from './backend/admin/core/adminApi.js';
import { ApiAdmin } from './backend/admin/core/ApiAdmin.js';
import { LoginController } from './backend/admin/controllers/LoginController.js';
const app = express();
const port = 3000;

// Khởi tạo một instance của AdminRouter
//const adminRouterInstance = new AdminRouter();

// Sử dụng router của lớp AdminRouter làm middleware
// Tất cả các yêu cầu đến '/admin' sẽ được xử lý bởi AdminRouter

//app.use('/admin', adminRouterInstance.getRouter());
const apiAdminInstance = new ApiAdmin();
const loginControllerInstance = new LoginController();
app.all('/api/admin', apiAdminInstance.getRouter());
app.all('/admin/api', adminApi());
app.post('/auth/login',formidable(), loginControllerInstance.login());
app.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
})