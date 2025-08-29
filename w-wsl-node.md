# node

node -v

npm init -y

npm install express

add "type": "module"

.gitignore

/node_modules

"dev": "node server.js";

## --watch

npm install nodemon --save-dev

"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}

sudo tail -f /var/log/nginx/error.log

sudo tail -f /var/log/nginx/access.log

curl http://localhost:3000

# form data
npm install express-formidable

const { username, password } = req.fields;

app.post('/auth/login',formidable(), loginControllerInstance.login());

## form data multer
npm install multer

// Multer lưu trữ dữ liệu text trong req.body
const { username, password } = req.body;

import multer from 'multer'; // Import multer

// Tạo một instance của Multer mà không lưu trữ bất kỳ file nào
// Đây là lựa chọn tốt khi form chỉ gửi dữ liệu text (như form login)
const upload = multer();

// Sử dụng upload.none() để xử lý form chỉ có dữ liệu text
// Multer sẽ parse dữ liệu form và đặt vào req.body
app.post('/auth/login', upload.none(), loginControllerInstance.login());
