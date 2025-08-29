# MySQL Server

sudo apt update
sudo apt install mysql-server
sudo service mysql start

## Cấu hình bảo mật

sudo mysql_secure_installation

y all

sudo mysql

## Nếu bạn muốn đăng nhập với mật khẩu, hãy sử dụng:

mysql -u root -p

Để tạo một tài khoản admin có quyền truy cập như root và có thể đăng nhập từ client, bạn cần thực hiện ba bước sau trong MySQL:

### 1\. Tạo tài khoản mới

Đầu tiên, bạn cần tạo một tài khoản người dùng mới. Hãy thay thế `'admin_user'` bằng tên tài khoản bạn muốn, và `'password'` bằng mật khẩu mạnh.

```sql
CREATE USER 'admin_user'@'%' IDENTIFIED BY 'password';
```

  * `'admin_user'`: Tên của tài khoản mới.
  * `'%'`: Cho phép tài khoản này đăng nhập từ bất kỳ địa chỉ IP nào. Nếu bạn chỉ muốn cho phép đăng nhập từ máy cục bộ, hãy thay thế bằng `'localhost'`.

-----

### 2\. Cấp quyền

Sau khi tạo tài khoản, bạn cần cấp cho nó tất cả các đặc quyền (privileges) như tài khoản `root`. Lệnh `GRANT ALL PRIVILEGES` sẽ cung cấp toàn quyền truy cập vào tất cả các cơ sở dữ liệu và bảng.

```sql
GRANT ALL PRIVILEGES ON *.* TO 'admin_user'@'%' WITH GRANT OPTION;
```

  * `ON *.*`: Cấp quyền trên tất cả các cơ sở dữ liệu và tất cả các bảng.
  * `WITH GRANT OPTION`: Cho phép tài khoản này có thể cấp quyền cho các tài khoản khác, giống như `root`.

-----

### 3\. Áp dụng các thay đổi

Cuối cùng, để các thay đổi về quyền có hiệu lực ngay lập tức, bạn phải chạy lệnh `FLUSH PRIVILEGES`.

```sql
FLUSH PRIVILEGES;
```

Bây giờ, bạn có thể đăng nhập từ một client từ xa bằng tài khoản `'admin_user'` và mật khẩu đã tạo.

### Xem danh sách các User
SELECT user, host FROM mysql.user;

### Xem quyền của một User cụ thể
SHOW GRANTS FOR 'ten_user'@'host';

### test đăng nhập
sudo mysql -h <host_ip> -u <username> -p
## Hiển thị cơ sở dữ liệu hiện có:

SHOW DATABASES;

## Tạo cơ sở dữ liệu mới:

CREATE DATABASE ten_co_so_du_lieu;

## Sử dụng một cơ sở dữ liệu:

USE ten_co_so_du_lieu;

## Tạo bảng:

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE
);
## xem cấu trúc bảng
DESCRIBE ten_bang;

DESC ten_bang;

## Chèn dữ liệu vào bảng:

INSERT INTO users (username, email) VALUES ('user1', 'user1@example.com');

## Hiển thị dữ liệu từ bảng:

SELECT * FROM users;

## Xóa cơ sở dữ liệu:

DROP DATABASE ten_co_so_du_lieu;

## Thoát khỏi MySQL

EXIT;