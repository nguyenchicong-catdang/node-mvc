# Sử dụng nhiều file cấu hình Vite

Để tạo các file built riêng biệt cho **client** và **admin** trong cùng một dự án Vite, bạn có thể sử dụng một trong hai cách phổ biến sau:

### Cách 1: Sử dụng nhiều file cấu hình Vite

Đây là cách tốt nhất để đảm bảo mỗi ứng dụng (client, admin) có môi trường build hoàn toàn riêng biệt. Bạn sẽ tạo một file cấu hình Vite riêng cho mỗi ứng dụng.

**Bước 1: Tạo các file cấu hình**

Tạo hai file cấu hình mới ở thư mục gốc của dự án:

  * `vite.client.config.js`
  * `vite.admin.config.js`

**`vite.client.config.js`**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/client', // Đường dẫn đầu ra cho client
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'client/index.html'),
      },
    },
  },
});
```

**`vite.admin.config.js`**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/admin', // Đường dẫn đầu ra cho admin
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
```

-----

**Bước 2: Cập nhật `package.json`**

Thêm các script để gọi các file cấu hình cụ thể:

```json
"scripts": {
  "dev:client": "vite --config vite.client.config.js",
  "dev:admin": "vite --config vite.admin.config.js",
  "build:client": "vite build --config vite.client.config.js",
  "build:admin": "vite build --config vite.admin.config.js"
}
```

Bây giờ bạn có thể chạy:

  * `npm run build:client` để chỉ build ứng dụng client.
  * `npm run build:admin` để chỉ build ứng dụng admin.

-----

### Cách 2: Sử dụng một file cấu hình duy nhất và biến môi trường

Cách này cho phép bạn quản lý mọi thứ trong một file duy nhất, nhưng nó có thể phức tạp hơn. Bạn sẽ sử dụng biến môi trường hoặc chế độ build để xác định cấu hình nào cần được áp dụng.

**`vite.config.js`**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  let inputPath = '';
  let outDir = '';

  if (mode === 'admin') {
    inputPath = resolve(__dirname, 'admin/index.html');
    outDir = 'dist/admin';
  } else { // Mặc định là client hoặc khi mode là 'client'
    inputPath = resolve(__dirname, 'client/index.html');
    outDir = 'dist/client';
  }

  return {
    build: {
      outDir,
      rollupOptions: {
        input: {
          main: inputPath,
        },
      },
    },
  };
});
```

**Cập nhật `package.json`**

```json
"scripts": {
  "build:client": "vite build --mode client",
  "build:admin": "vite build --mode admin"
}
```

Bạn có thể chạy các lệnh tương tự như trên để build từng ứng dụng.