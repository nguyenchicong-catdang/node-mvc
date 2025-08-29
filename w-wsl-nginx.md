# Cài đặt Nginx

service --status-all

sudo apt install nginx

sudo service nginx status

sudo service nginx start

sudo service nginx stop

sudo service nginx restart

sudo service nginx reload

sudo ss -tuln

cat /etc/nginx/nginx.conf

ls -l /etc/nginx/sites-enabled/


cat /etc/nginx/sites-available/default

add port 80

# nginx/node-mvc.conf
server {
    listen 80;
    server_name localhost;
    root /workspaces/node-mvc/public;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ = 404;
    }
}

ls -l /etc/nginx/sites-available

sudo unlink /etc/nginx/sites-enabled/default

sudo ln -s /workspaces/node-mvc/nginx/node-mvc.conf /etc/nginx/sites-enabled/node-mvc.conf

sudo nginx -t

sudo service nginx reload

add port 80

sudo ss -tulnp | grep 3000

sudo kill -9 20022

sudo service nginx restart

sudo chmod -R 755 /workspaces/node-mvc

## mysql

sudo apt update
sudo apt install mysql-server
sudo service mysql start

### bảm mật sql
sudo mysql_secure_installation
### kết nối
sudo mysql
sudo mysql -u root -p
sudo mysql -h <host_ip> -u <username> -p

CREATE DATABASE ten_co_so_du_lieu;
USE ten_co_so_du_lieu;