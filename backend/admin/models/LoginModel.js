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
import { Database } from '../core/Database.js';
class LoginModel {
    constructor() {
        //this.username = 'admin';
        //this.password = '123';
        //this.hashedPassword = '$2b$10$62o9VS/hM4XVgCqn9jiUxOBp3jeur9DcOAKEm9hCqqqv7RZV3AsLm';
        this.databaseInstance = new Database();
    }

    // validate(userrname, password) {
    //     if (userrname === this.username && password === this.password) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    async getUser() {
        const pool = this.databaseInstance.getConnection();
        try {
            const [rows] = await pool.query('SELECT username, password_hash FROM users');
            //console.log(rows);
            return rows;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    // async validate(username, password) {
    //     // So sánh trực tiếp với tên người dùng.
    //     if (username !== this.username) {
    //         return false;
    //     }
    //     // So sánh mật khẩu đã nhập với mật khẩu đã băm.
    //     try {
    //         const isMatch = await bcrypt.compare(password, this.hashedPassword);
    //         // Trả về true nếu khớp, false nếu không.
    //         return isMatch;
    //     } catch (e) {
    //         console.log(e);
    //         throw e;
    //     }
    // }

    async validate(username, password) {
        const pool = this.databaseInstance.getConnection();
        try {
            const [rows] = await pool.query('SELECT password_hash FROM users WHERE username = ?', [username]);
            // 2. If no user is found, validation fails immediately
            if (rows.length === 0) {
                return false;
            }
            // 3. Get the hashed password from the database result
            const hashedPassword = rows[0].password_hash;
            // 4. Compare the provided password with the stored hash
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    // Một phương thức để băm mật khẩu mới (chỉ dùng để tạo mật khẩu đã băm cho constructor)
    async hashPassword(password) {
        const saltRounds = 10;
        try {
            const hashPassword = await bcrypt.hash(password, saltRounds);
            //console.log(hashPassword);
            return hashPassword;
        } catch (e) {
            console.error(e);
        }
    }
}

export {LoginModel}