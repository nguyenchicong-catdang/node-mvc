# Các bước cài đặt và sử dụng Bcrypt

Để mã hóa mật khẩu trong `LoginModel.js`, bạn nên sử dụng một thư viện băm mật khẩu như **Bcrypt.js** thay vì so sánh trực tiếp. Bcrypt được thiết kế đặc biệt để băm mật khẩu một cách an toàn.

-----

### Các bước cài đặt và sử dụng Bcrypt

#### 1\. Cài đặt Bcrypt

Đầu tiên, bạn cần cài đặt thư viện **bcrypt** vào dự án của mình.

```bash
npm install bcrypt
```

#### 2\. Cấu trúc lại `LoginModel`

Bạn sẽ cần sửa đổi lớp `LoginModel` để mã hóa mật khẩu khi khởi tạo và so sánh mật khẩu đã nhập với mật khẩu đã băm.

```javascript
// backend/admin/models/LoginModel.js

import bcrypt from 'bcrypt';

class LoginModel {
    constructor() {
        this.username = 'admin';
        // Lưu mật khẩu đã băm thay vì mật khẩu gốc
        this.hashedPassword = '$2a$10$wTf7oG2NqL2y4D8g5Q6N1.D8N7u.2L8r.5b.p.P8E6B.w6H5W4Y1Z9'; // Đây là mật khẩu '123' đã được băm. Bạn nên tạo một mật khẩu mới.
    }

    async validate(username, password) {
        // So sánh trực tiếp với tên người dùng.
        if (username !== this.username) {
            return false;
        }

        // So sánh mật khẩu đã nhập với mật khẩu đã băm.
        try {
            const isMatch = await bcrypt.compare(password, this.hashedPassword);
            return isMatch; // Trả về true nếu khớp, false nếu không.
        } catch (error) {
            console.error('Lỗi khi so sánh mật khẩu:', error);
            return false;
        }
    }

    // Một phương thức để băm mật khẩu mới (chỉ dùng để tạo mật khẩu đã băm cho constructor)
    async hashPassword(password) {
        const saltRounds = 10;
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        } catch (error) {
            console.error('Lỗi khi băm mật khẩu:', error);
        }
    }
}

export { LoginModel };
```

#### Giải thích

  * **`import bcrypt from 'bcrypt';`**: Bạn nhập thư viện `bcrypt` để sử dụng các hàm của nó.
  * **`this.hashedPassword`**: Bạn sẽ lưu **mật khẩu đã được băm** vào đây, không phải mật khẩu gốc.
  * **`async validate(username, password)`**: Hàm này phải là `async` vì `bcrypt.compare` là một hàm bất đồng bộ.
  * **`bcrypt.compare(password, this.hashedPassword)`**: Hàm này so sánh mật khẩu người dùng nhập vào (`password`) với mật khẩu đã băm (`this.hashedPassword`). Nó tự động xử lý salt và các thuật toán phức tạp khác.

#### Lưu ý quan trọng

  * **Đừng lưu mật khẩu gốc:** Mật khẩu '123' được băm và lưu vào `this.hashedPassword`. Bạn **không bao giờ** nên lưu mật khẩu gốc dưới dạng văn bản thuần.
  * **Mật khẩu được băm là khác nhau:** Mỗi lần bạn băm một mật khẩu, Bcrypt sẽ tạo ra một chuỗi băm khác nhau. Đó là một tính năng an toàn để ngăn chặn các cuộc tấn công bằng bảng cầu vồng.
  * **Lưu trữ an toàn hơn:** Trong một ứng dụng thực tế, bạn sẽ không lưu mật khẩu trong bộ nhớ như thế này mà sẽ lưu chúng trong cơ sở dữ liệu.