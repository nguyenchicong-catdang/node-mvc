# vite

https://vite.dev/guide/

npm install vite --save-dev

npm install concurrently --save-dev

"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev:node": "nodemon server.js",
  "dev:vite": "vite",
  "dev": "concurrently \"npm run dev:node\" \"npm run dev:vite\""
},