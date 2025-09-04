// server.js

import express from 'express';
import multer from 'multer';
//import formidable from 'express-formidable';
//import { AdminRouter } from './backend/admin/core/AdminRouter.js';;
import { adminApi } from './backend/admin/core/adminApi.js';
import { ApiAdmin } from './backend/admin/core/ApiAdmin.js';
import { LoginController } from './backend/admin/controllers/LoginController.js';

//dev
import { DevServer } from './backend/admin/core/DevServer.js';

const app = express();
const port = 3000;

// Tạo một instance của Multer mà không lưu trữ bất kỳ file nào
// Đây là lựa chọn tốt khi form chỉ gửi dữ liệu text (như form login)
const upload = multer(); 

// Khởi tạo một instance của AdminRouter
//const adminRouterInstance = new AdminRouter();

// Sử dụng router của lớp AdminRouter làm middleware
// Tất cả các yêu cầu đến '/admin' sẽ được xử lý bởi AdminRouter

//app.use('/admin', adminRouterInstance.getRouter());
const apiAdminInstance = new ApiAdmin();
const loginControllerInstance = new LoginController();
app.all('/api/admin', apiAdminInstance.getRouter());
app.all('/admin/api', adminApi());
//app.post('/auth/login',formidable(), loginControllerInstance.login());
app.post('/auth/login',upload.none(), loginControllerInstance.login());

// dev
new DevServer(app);

app.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
})