// backend/admin/core/Database.js
// Get the client
// https://sidorares.github.io/node-mysql2/docs#first-query;
// backend/admin/core/Database.js
import mysql from 'mysql2/promise';
class Database {
    static instance = null;

    constructor() {
        if (Database.instance) {
            // Trả về instance đã có sẵn
            return Database.instance;
        }

        // Tạo một connection pool thay vì một kết nối duy nhất
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'admin',
            password: 'Cong@12345',
            database: 'nodeMvc',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        // Gán instance hiện tại vào thuộc tính tĩnh
        Database.instance = this;
    }

    // Phương thức để lấy pool kết nối
    getConnection() {
        return this.pool;
    }
}

export { Database };
