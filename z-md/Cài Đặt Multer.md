## Cài Đặt Multer

Chắc chắn rồi\! Multer là lựa chọn tuyệt vời để xử lý form với file upload trong Express. Đây là hướng dẫn chi tiết từng bước để cài đặt, gửi và đọc dữ liệu form bằng Multer.

-----

### 1\. Cài Đặt Multer

Bạn cần cài đặt Multer vào dự án Node.js của mình. Mở terminal trong thư mục dự án và chạy lệnh sau:

```bash
npm install multer
```

-----

### 2\. Thiết Lập Backend (Express)

Trong file server chính của bạn (ví dụ: `server.js` hoặc `app.js`), bạn cần import Multer và tạo một middleware để xử lý việc lưu trữ các tệp.

```javascript
// server.js
import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' }); // Thiết lập thư mục lưu trữ tạm thời

// Route để xử lý form
app.post('/profile', upload.single('avatar'), (req, res) => {
  // `upload.single('avatar')` là middleware của Multer
  // 'avatar' là tên của trường input trong form (tên file)

  // Dữ liệu text sẽ có trong req.body
  console.log('Dữ liệu text:', req.body); 

  // Thông tin file sẽ có trong req.file
  console.log('Thông tin file:', req.file); 
  
  res.json({
    message: 'Form submitted successfully!',
    body: req.body,
    file: req.file
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

  * **`multer({ dest: 'uploads/' })`**: Dòng này tạo một Multer middleware instance và chỉ định thư mục tạm thời để lưu các tệp đã tải lên. Thư mục này (`uploads/`) phải tồn tại.
  * **`upload.single('avatar')`**: Đây là cách sử dụng middleware. `single()` có nghĩa là bạn chỉ chấp nhận một tệp duy nhất. Tham số `'avatar'` là `name` attribute của input file trong HTML form. Multer sẽ tự động thêm `req.body` cho dữ liệu text và `req.file` cho thông tin file.
  * **Lưu ý**: Multer không xử lý dữ liệu form không có tệp. Nếu bạn chỉ có dữ liệu text, hãy sử dụng `express.urlencoded()` hoặc `express.json()`.

### 3\. Thiết Lập Frontend (HTML và JavaScript)

Tạo một form HTML để gửi dữ liệu và tệp lên server. Quan trọng là phải thêm thuộc tính `enctype="multipart/form-data"` vào thẻ `<form>`.

```html
<form action="/profile" method="post" enctype="multipart/form-data">
  <input type="text" name="username" placeholder="Username">
  <input type="file" name="avatar">
  <button type="submit">Submit</button>
</form>
```

Nếu bạn muốn gửi form bằng JavaScript (không tải lại trang), bạn có thể sử dụng `FormData` và `fetch`.

```javascript
// main.js
const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch('/profile', {
      method: 'POST',
      body: formData, // fetch tự động đặt Content-Type khi body là FormData
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
});
```

### 4\. Các Phương Thức Khác của Multer

Ngoài `upload.single()`, Multer còn có các phương thức khác tùy thuộc vào loại tệp bạn muốn xử lý:

  * **`upload.array('photos', 12)`**: Xử lý nhiều tệp với cùng một tên trường (`photos`), giới hạn tối đa 12 tệp.
  * **`upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])`**: Xử lý nhiều tệp từ các trường khác nhau.
  * **`upload.none()`**: Chỉ xử lý dữ liệu text (không có tệp).
  * **`upload.any()`**: Xử lý tất cả các tệp từ tất cả các trường.

Multer là một giải pháp rất mạnh mẽ và an toàn. Bạn có thể tìm hiểu thêm về cách tùy chỉnh lưu trữ, lọc tệp và giới hạn kích thước trong tài liệu chính thức của Multer.