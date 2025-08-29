# Cấu hình Frontend (Vite)

Để kết hợp Nginx làm webserver cho cả backend Node.js và frontend Vite, bạn cần cấu hình Nginx để đóng vai trò như một **reverse proxy** cho Node.js và một **file server** cho các file tĩnh của Vite.

### Cấu hình Backend (Node.js)

Tương tự như các bước trước, bạn sẽ sử dụng `proxy_pass` để Nginx chuyển tiếp các yêu cầu đến backend Node.js của bạn, thường là trên một cổng nội bộ như 3000.

**Cấu hình Nginx:**

```nginx
server {
    listen 80;
    server_name your_domain;

    # Cấu hình proxy cho backend Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        # Các cài đặt proxy khác
    }
}
```

  * **`location /api/`**: Nginx sẽ chuyển tiếp tất cả các yêu cầu bắt đầu bằng `/api/` đến backend Node.js của bạn. Điều này giúp tách biệt các API calls khỏi các yêu cầu dành cho frontend.

-----

### Cấu hình Frontend (Vite)

Frontend của bạn (được xây dựng bằng Vite) là các file tĩnh (HTML, CSS, JS). Nginx sẽ phục vụ các file này trực tiếp từ thư mục `dist` sau khi bạn chạy lệnh build của Vite.

**Các bước thực hiện:**

1.  **Build Frontend:** Chạy lệnh build của Vite để tạo ra các file tĩnh.

    ```bash
    npm run build
    ```

    Lệnh này sẽ tạo ra một thư mục `dist` chứa các file tĩnh đã được tối ưu.

2.  **Cấu hình Nginx:** Cấu hình Nginx để phục vụ các file từ thư mục `dist` của bạn.

    ```nginx
    server {
        listen 80;
        server_name your_domain;

        # Cấu hình proxy cho backend Node.js
        location /api/ {
            proxy_pass http://localhost:3000;
            # Các cài đặt proxy khác
        }

        # Cấu hình phục vụ các file tĩnh của frontend Vite
        location / {
            root /path/to/your/vite/project/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
    }
    ```

      * **`location /`**: Nginx sẽ phục vụ các yêu cầu không khớp với `/api/`.
      * **`root /path/to/your/vite/project/dist`**: Chỉ định thư mục chứa các file tĩnh của Vite.
      * **`try_files $uri $uri/ /index.html`**: Điều này rất quan trọng đối với các ứng dụng Single Page Applications (SPA). Nếu một yêu cầu không khớp với một file hoặc thư mục tồn tại, Nginx sẽ chuyển hướng nó đến `index.html`. Điều này cho phép client-side routing của Vite hoạt động đúng cách.

Sau khi cập nhật cấu hình, hãy luôn nhớ kiểm tra cú pháp và khởi động lại Nginx.

```bash
sudo nginx -t
sudo service nginx restart
```