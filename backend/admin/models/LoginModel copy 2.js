// backend/admin/models/LoginModel.js
/**
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password_hash) VALUES ('admin', '$2b$10$62o9VS/hM4XVgCqn9jiUxOBp3jeur9DcOAKEm9hCqqqv7RZV3AsLm');
 */
import bcrypt from 'bcrypt';
class LoginModel {
    constructor() {
        this.username = 'admin';
        //this.password = '123';
        this.hashedPassword = '$2b$10$62o9VS/hM4XVgCqn9jiUxOBp3jeur9DcOAKEm9hCqqqv7RZV3AsLm';
    }

    // validate(userrname, password) {
    //     if (userrname === this.username && password === this.password) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    async validate(username, password) {
        // So sánh trực tiếp với tên người dùng.
        if (username !== this.username) {
            return false;
        }
        // So sánh mật khẩu đã nhập với mật khẩu đã băm.
        try {
            const isMatch = await bcrypt.compare(password, this.hashedPassword);
            // Trả về true nếu khớp, false nếu không.
            return isMatch;
        } catch (e) {
            console.log(e);
            throw e;
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