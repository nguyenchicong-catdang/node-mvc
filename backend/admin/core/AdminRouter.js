// backend/admin/core/AdminRouter.js
import { Router } from "express";
import { LoginController } from "../controllers/LoginController.js";
class AdminRouter {
    constructor() {
        this.router = Router();

        // Khởi tạo một instance của LoginController
        //this.loginControllerInstance = new LoginController();
        this.loginControllerInstance = new LoginController();
        // Định nghĩa các route trong constructor
        this.defineRoutes();
    }

    defineRoutes() {
        this.router.get('/', (req, res) => {
            res.send('Đây là trang admin');
        });

        this.router.get('/json', (req, res) => {
            res.json({json:"test json"});
        });

        //this.router.all('/login', this.loginControllerInstance);
        //this.router.all('/login', this.loginControllerInstance.login.bind(this.loginControllerInstance));
        //this.router.use('/login/', this.loginControllerInstance);
        //console.log(this.router)
    }

    // Một phương thức để trả về đối tượng router đã được định nghĩa
    getRouter() {
        return this.router;
    }
}

export {AdminRouter}