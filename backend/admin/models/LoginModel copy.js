// backend/admin/models/LoginModel.js
import bcrypt from 'bcrypt';
class LoginModel {
    constructor() {
        this.username = 'admin';
        this.password = '123';
    }

    validate(userrname, password) {
        if (userrname === this.username && password === this.password) {
            return true;
        } else {
            return false;
        }
    }

    // Một phương thức để băm mật khẩu mới (chỉ dùng để tạo mật khẩu đã băm cho constructor)
    async hashPassword(password) {
        const saltRounds = 10;
        try {
            const hashPassword = await bcrypt.hash(password, saltRounds);
            console.log(hashPassword);
            return hashPassword;
        } catch (e) {
            console.error(e);
        }
    }
}

export {LoginModel}