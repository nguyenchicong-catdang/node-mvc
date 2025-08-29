# Node.js với MySQL server

Để kết nối Node.js với MySQL server, bạn cần sử dụng một **thư viện (package)**. Thư viện phổ biến và được khuyến nghị nhất là `mysql2` hoặc `mysql`. `mysql2` được coi là phiên bản nâng cấp, có hiệu suất tốt hơn và hỗ trợ `async/await`.

-----

### Bước 1: Cài đặt thư viện 📦

Mở terminal trong thư mục dự án Node.js của bạn và chạy lệnh sau để cài đặt `mysql2`:

```bash
npm install mysql2
```

-----

### Bước 2: Viết code kết nối 💻

Tạo một file JavaScript (ví dụ: `app.js`) và sử dụng đoạn code sau để thiết lập kết nối:

```javascript
// Import thư viện mysql2
const mysql = require('mysql2');

// Tạo pool kết nối để quản lý nhiều kết nối hiệu quả hơn
const pool = mysql.createPool({
    host: 'localhost', // Địa chỉ IP hoặc tên host của MySQL server
    user: 'root', // Tên user MySQL của bạn
    password: 'your_password', // Mật khẩu user MySQL
    database: 'your_database_name', // Tên database bạn muốn kết nối
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Chuyển pool thành một đối tượng promise để dùng async/await
const promisePool = pool.promise();

// Hàm ví dụ để thực hiện truy vấn
async function getUsers() {
    try {
        // Thực hiện truy vấn SQL
        const [rows, fields] = await promisePool.query('SELECT * FROM users');
        
        console.log('Users:', rows);
        
        // Trả về kết quả
        return rows;
    } catch (err) {
        console.error('Lỗi khi truy vấn database:', err);
    }
}

// Gọi hàm
getUsers();
```

-----

### Giải thích các thông số kết nối

  * **`host`**: Tên máy chủ MySQL. Nếu bạn chạy MySQL trên máy cục bộ, giá trị thường là `localhost` hoặc `127.0.0.1`.
  * **`user`**: Tên người dùng MySQL. Mặc định thường là `root`.
  * **`password`**: Mật khẩu của người dùng.
  * **`database`**: Tên cơ sở dữ liệu bạn muốn thao tác.

### Tại sao nên dùng `createPool`?

Sử dụng `createPool` thay vì `createConnection` là một phương pháp tốt hơn trong các ứng dụng web. Một **pool (vùng chứa)** giữ sẵn một số kết nối, khi ứng dụng cần một kết nối, nó sẽ lấy từ pool và sau khi sử dụng xong, kết nối sẽ được trả lại pool để dùng lại. Điều này giúp:

  * **Tăng hiệu suất**: Giảm thời gian và tài nguyên để tạo và đóng kết nối mới.
  * **Quản lý tài nguyên hiệu quả**: Ngăn chặn việc ứng dụng mở quá nhiều kết nối, có thể gây quá tải server MySQL.

## Bước 1: Tạo Module Kết Nối

Bạn chỉ cần tạo một module JavaScript duy nhất để xử lý kết nối database, sau đó xuất (export) ra một instance của pool kết nối. Các file khác trong dự án của bạn chỉ cần `require` hoặc `import` instance này để sử dụng, thay vì phải gọi lại hàm kết nối ở mỗi file.

-----

### Bước 1: Tạo Module Kết Nối ⚙️

Tạo một file riêng, ví dụ `database.js`, để chứa logic kết nối và quản lý pool.

```javascript
// database.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database_name',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Xuất pool kết nối dưới dạng promise
module.exports = pool.promise();
```

-----

### Bước 2: Tái Sử Dụng Instance Kết Nối ♻️

Bất kỳ file nào trong dự án của bạn cần truy cập database, bạn chỉ cần `require` file `database.js` đã tạo.

```javascript
// user.controller.js
const promisePool = require('./database');

async function getUsers() {
    try {
        const [rows] = await promisePool.query('SELECT * FROM users');
        console.log('Users:', rows);
        return rows;
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu user:', err);
    }
}

getUsers();
```

**Tại sao cách này hiệu quả?**

  * **Tính Tái Sử Dụng**: Bạn không phải viết lại code kết nối ở nhiều nơi.
  * **Đơn Luận (Singleton)**: Node.js sẽ cache module khi nó được `require` lần đầu tiên. Điều này đảm bảo rằng tất cả các file trong dự án của bạn đều sử dụng cùng một **instance của pool kết nối**, giúp tối ưu hóa tài nguyên và hiệu suất.
  * **Dễ Quản Lý**: Khi bạn cần thay đổi thông tin kết nối (như mật khẩu hoặc tên database), bạn chỉ cần thay đổi duy nhất trong file `database.js`.

### Class Database

Nếu bạn muốn đóng gói logic kết nối database vào một **class `Database`** để có thể tái sử dụng, bạn có thể áp dụng mô hình thiết kế **Singleton**. Singleton đảm bảo rằng chỉ có duy nhất một instance của class được tạo ra trong suốt vòng đời của ứng dụng, giúp quản lý kết nối hiệu quả.

-----

### Bước 1: Tạo Class `Database` 🧱

Tạo một file mới, ví dụ `Database.js`. Trong class này, bạn sẽ tạo một thuộc tính `_instance` tĩnh để lưu trữ instance duy nhất và một phương thức `getConnection` để lấy pool kết nối.

```javascript
// Database.js
const mysql = require('mysql2');

class Database {
    // Thuộc tính tĩnh để lưu instance duy nhất
    static _instance;

    constructor() {
        // Ngăn chặn tạo instance mới nếu đã tồn tại
        if (Database._instance) {
            return Database._instance;
        }

        // Tạo pool kết nối
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'your_password',
            database: 'your_database_name',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }).promise();

        // Gán instance hiện tại vào thuộc tính tĩnh
        Database._instance = this;
    }

    // Phương thức để lấy pool kết nối
    getConnection() {
        return this.pool;
    }
}

// Xuất ra một instance duy nhất
module.exports = new Database();
```

-----

### Bước 2: Tái Sử Dụng Instance ✅

Bất kỳ file nào khác trong dự án cần truy cập database, bạn chỉ cần `require` hoặc `import` instance duy nhất này và gọi phương thức `getConnection()`.

```javascript
// user.controller.js
const database = require('./Database');
const pool = database.getConnection();

async function getUsers() {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        console.log('Users:', rows);
        return rows;
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu user:', err);
    }
}

getUsers();
```

### Ưu điểm của cách này

  * **Đóng gói (Encapsulation)**: Toàn bộ logic kết nối được gói gọn trong một class, làm cho code của bạn gọn gàng và dễ quản lý.
  * **Mẫu Thiết kế Singleton**: Bạn đảm bảo rằng dù bạn có gọi `require('./Database')` bao nhiêu lần đi chăng nữa, bạn cũng chỉ làm việc với một instance kết nối duy nhất, tránh lãng phí tài nguyên.
  * **Dễ bảo trì**: Nếu bạn cần thay đổi thông tin kết nối, bạn chỉ cần sửa đổi duy nhất trong file `Database.js`.

Cách này rất phù hợp cho các dự án lớn, nơi bạn muốn có một kiến trúc code chặt chẽ và dễ mở rộng.

## use

To use the `LoginModel` and pass variables to the `validate` method, you need to import the class, create a new instance of it, and then call the method. Since the `validate` method is `async`, you should use `await` when calling it.

Here's a breakdown of how to properly use your `LoginModel` class.

-----

### How to Use and Pass Variables to `validate`

1.  **Import the Class**: First, import the `LoginModel` class from its file path.
2.  **Create an Instance**: Create a new instance of `LoginModel`. This instance will have access to all the methods and properties defined in the class.
3.  **Call the `validate` method**: Call the `validate` method on the instance and pass the `username` and `password` as arguments. Since it's an asynchronous function, you'll need to use `await` inside an `async` function.

#### Example Usage

Here's an example of a simple `loginController.js` file that demonstrates how to use your model.

```javascript
// backend/admin/controllers/LoginController.js

import { LoginModel } from '../models/LoginModel.js';

async function handleLogin(username, password) {
    // 1. Create an instance of the LoginModel
    const loginModel = new LoginModel();

    // 2. Call the async validate method with the user-provided variables
    try {
        const isValid = await loginModel.validate(username, password);
        
        if (isValid) {
            console.log('Login successful! ✅');
            // Perform actions after a successful login, like creating a session
            // and redirecting the user.
            return true;
        } else {
            console.log('Login failed. Invalid username or password. ❌');
            // Handle failed login attempts.
            return false;
        }
    } catch (error) {
        console.error('An error occurred during login validation:', error);
        return false;
    }
}

// Example calls
// Replace these with actual variables from a web form or API request
const userAttempt1 = 'admin';
const passAttempt1 = '123'; 

handleLogin(userAttempt1, passAttempt1);

const userAttempt2 = 'admin';
const passAttempt2 = 'wrong_password';

handleLogin(userAttempt2, passAttempt2);
```

### Important Notes on Your Code

  * **Hardcoded Credentials**: In your `LoginModel`'s constructor, you've hardcoded `this.username` and `this.hashedPassword`. This is **not a good practice** for production code. The model should fetch user data from the database based on the provided `username`, then validate the password.
  * **Improve `validate` method**: To fix this, your `validate` method should first query the database to find the user by their username. If a user is found, then you can use `bcrypt.compare` to check the provided password against the `password_hash` retrieved from the database.

Here's how a better `validate` method would look:

```javascript
// (Trong class LoginModel)
async validate(username, password) {
    const pool = this.databaseInstance.getConnection();
    try {
        // 1. Query the database to find the user by username
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
        console.error('Lỗi khi truy vấn hoặc so sánh mật khẩu:', e);
        throw e;
    }
}
```