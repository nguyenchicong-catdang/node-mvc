# v1

Nếu bạn muốn Vite build ra thư mục **`public`** thay vì thư mục **`dist`** mặc định, bạn chỉ cần thay đổi tùy chọn **`build.outDir`** trong file **`vite.config.js`**.

-----

### Cách cấu hình `build.outDir`

Bạn chỉ cần thêm hoặc cập nhật tùy chọn **`build.outDir`** trong đối tượng `build` của file cấu hình.

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Chỉ định thư mục đầu ra là 'public'
    outDir: 'public', 
  },
});
```

Với cấu hình này, khi bạn chạy lệnh **`npm run build`**, Vite sẽ tạo tất cả các file build (HTML, CSS, JS, hình ảnh, v.v.) bên trong một thư mục có tên là **`public`** tại thư mục gốc của dự án.

### Ví dụ và Cấu trúc thư mục

**Cấu trúc dự án trước khi build:**

```
.
├── index.html
├── src/
│   └── main.js
├── vite.config.js
└── package.json
```

**Cấu trúc dự án sau khi chạy `npm run build`:**

```
.
├── index.html
├── src/
│   └── main.js
├── vite.config.js
├── public/
│   ├── index.html
│   └── assets/
│       ├── index-hash.js
│       └── index-hash.css
└── package.json
```

Lệnh này sẽ ghi đè thư mục **`dist`** mặc định, và mọi thứ sẽ được xuất vào thư mục **`public`** mà bạn đã chỉ định.
# v2
Khi bạn có nhiều file build cho các phần riêng biệt như **admin** và **client**, và muốn đầu ra được sắp xếp vào các thư mục tương ứng, bạn có thể cấu hình **`build.outDir`** kết hợp với **`build.rollupOptions.input`** trong file `vite.config.js`.

### 1\. Cấu trúc thư mục

Để dễ quản lý, hãy tổ chức các file của bạn thành các thư mục con:

```
.
├── admin/
│   └── index.html
├── client/
│   └── index.html
├── vite.config.js
└── package.json
```

### 2\. Cấu hình `vite.config.js` cho nhiều file build

Bạn cần tạo một file cấu hình Vite riêng cho mỗi ứng dụng (admin, client). Tuy nhiên, cách tốt hơn là sử dụng một file cấu hình duy nhất và điều chỉnh các tùy chọn build dựa trên biến môi trường hoặc tham số dòng lệnh.

**Cách 1: Sử dụng biến môi trường**

Bạn có thể tạo các script trong `package.json` để xác định môi trường build.

**File `package.json`:**

```json
{
  "scripts": {
    "build:admin": "vite build --mode admin",
    "build:client": "vite build --mode client"
  }
}
```

**File `vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  let inputPath = '';
  let outDir = '';

  if (mode === 'admin') {
    inputPath = resolve(__dirname, 'admin/index.html');
    outDir = 'dist/admin';
  } else if (mode === 'client') {
    inputPath = resolve(__dirname, 'client/index.html');
    outDir = 'dist/client';
  } else {
    // Cấu hình mặc định
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

Trong cách này, khi bạn chạy `npm run build:admin`, Vite sẽ build file `admin/index.html` và đưa kết quả vào thư mục `dist/admin`. Tương tự với `npm run build:client` và thư mục `dist/client`.

-----

### 3\. Cấu hình nhiều điểm vào trong một lần build

Nếu bạn muốn build cả admin và client cùng một lúc, bạn vẫn có thể sử dụng một file cấu hình duy nhất. Tuy nhiên, bạn sẽ phải định nghĩa rõ ràng đường dẫn đầu ra cho từng điểm vào.

**File `vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Điểm vào cho admin
        admin: resolve(__dirname, 'admin/index.html'),
        // Điểm vào cho client
        client: resolve(__dirname, 'client/index.html'),
      },
      output: {
        // Cấu hình tên file đầu ra dựa trên tên điểm vào
        entryFileNames: '[name]/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
```

Với cách này, khi chạy `npm run build`, Vite sẽ tạo một thư mục `dist` với cấu trúc bên trong như sau:

```
dist/
├── admin/
│   ├── index.html
│   └── admin-xxxx.js
└── client/
    ├── index.html
    └── client-xxxx.js
```

Tuy nhiên, cách này có thể phức tạp hơn vì bạn cần phải tự quản lý việc tạo các thư mục đầu ra trong `dist` cho từng điểm vào.
# v3
### Cấu hình Vite với nhiều điểm vào (multiple entry points)

Bạn có thể cấu hình Vite để có nhiều điểm vào bằng cách sử dụng tùy chọn **`build.rollupOptions.input`** trong file `vite.config.js`. Điều này hữu ích khi bạn có nhiều trang HTML hoặc các ứng dụng độc lập trong cùng một dự án.

Bạn có thể cấu hình **`input`** theo hai cách chính:

  * **Sử dụng object:** Đây là cách phổ biến nhất để ánh xạ các tên chunk đầu ra đến các file nguồn. Tên thuộc tính (ví dụ: `main`, `about`) sẽ trở thành tên file trong thư mục `dist`. Giá trị tương ứng là đường dẫn đến file HTML hoặc JavaScript của bạn.
  * **Sử dụng array:** Bạn có thể cung cấp một mảng các chuỗi, mỗi chuỗi là đường dẫn đến một file HTML hoặc JavaScript.

<!-- end list -->

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Điểm vào chính
        nested: resolve(__dirname, 'nested/index.html'), // Một điểm vào khác trong thư mục con
      },
    },
  },
});
```

-----

### Ví dụ và Giải thích

#### 1\. Cấu hình với nhiều trang HTML

Nếu bạn có một dự án với nhiều trang HTML, mỗi trang cần được xử lý và xuất ra độc lập, bạn sẽ cấu hình `input` như sau:

**Cấu trúc thư mục dự án:**

```
.
├── index.html
├── about.html
├── vite.config.js
└── main.js
```

**File `vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
});
```

Sau khi chạy lệnh **`npm run build`**, Vite sẽ tạo ra các file đầu ra tương ứng:

```
.
└── dist/
    ├── main.html
    ├── main.js
    ├── about.html
    └── about.js
```

#### 2\. Cấu hình với nhiều file JavaScript

Giả sử bạn có một dự án chỉ với một file HTML nhưng cần các file JavaScript khác nhau cho các mục đích riêng biệt, bạn có thể cấu hình như sau:

**Cấu trúc thư mục dự án:**

```
.
├── index.html
├── src/
│   ├── app.js
│   └── admin.js
└── vite.config.js
```

**File `vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'src/app.js'),
        admin: resolve(__dirname, 'src/admin.js'),
      },
    },
  },
});
```

Trong trường hợp này, các file JavaScript đã được cấu hình như các điểm vào sẽ được tách thành các tệp riêng biệt trong thư mục `dist`. Sau đó, bạn có thể import các file này vào file HTML của mình.

#### 3\. Sử dụng `glob` để tự động tìm kiếm các điểm vào

Nếu bạn có nhiều file HTML và không muốn cấu hình thủ công từng cái, bạn có thể sử dụng một thư viện như **`glob`** để tự động tìm kiếm và thêm chúng vào cấu hình `input`.

```javascript
// Cài đặt glob nếu chưa có
// npm install --save-dev glob
```

**File `vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import glob from 'glob';

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync('*.html').map(file => [
          file.slice(0, file.length - '.html'.length),
          resolve(__dirname, file)
        ])
      )
    }
  }
});
```

Cách này sẽ tự động tìm tất cả các file HTML ở thư mục gốc và cấu hình chúng làm điểm vào.
