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
