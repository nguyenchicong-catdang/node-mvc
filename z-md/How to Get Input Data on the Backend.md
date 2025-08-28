# How to Get Input Data on the Backend

The error you're encountering is that the form data isn't being received correctly on the backend. This is because **you are sending the `formData` object directly as the `body`**, which is the correct way for `multipart/form-data`, but the backend needs to handle this specific content type to parse the data. The backend code you've provided is not set up to do this.

## How to Get Input Data on the Backend

There are two main ways to handle form data on the backend:

1.  **Using a Body Parser Middleware**: The most common and recommended approach is to use a middleware that can parse `multipart/form-data` or `application/x-www-form-urlencoded`. Express.js doesn't handle this out of the box. You need a library like `multer` for file uploads, or `express-formidable` for simpler form data.

2.  **Manually Parsing the Request Stream**: You can read the request stream directly and parse the data yourself, but this is a complex process and generally not recommended.

### Example Using `express-formidable`

The simplest way to handle form data is with a middleware. Here's how you can use the `express-formidable` library.

**1. Install the Library**

First, install `express-formidable` in your backend project:

```bash
npm install express-formidable
```

**2. Update Your Backend Code**

Modify your backend router to use the middleware. `express-formidable` will parse the form data and place the fields in `req.fields` and the files in `req.files`.

```javascript
// backend/admin/controllers/LoginController.js

class LoginController {
    login() {
        return (req, res) => {
            // express-formidable will parse the form data into req.fields
            const { username, password } = req.fields; 
            
            // Now you can access and use the form data
            console.log('Username:', username);
            console.log('Password:', password);
            
            res.json({ message: 'Login successful', username: username });
        };
    }
}

export { LoginController };
```

**3. Set up Your Route**

You'll need a route to use the `express-formidable` middleware before calling your controller. This is typically done in your main application file (e.g., `server.js` or `app.js`).

```javascript
// server.js or app.js
import formidable from 'express-formidable';
import { LoginController } from './backend/admin/controllers/LoginController.js';

// Create a new router instance
const loginController = new LoginController();
const router = express.Router();

// Use the formidable middleware to parse the form data on this specific route
router.post('/auth/login', formidable(), loginController.login());

// Or, use it globally for all routes
// app.use(formidable());
// app.use('/auth', router); 
```

By following these steps, the form data from your frontend will be correctly parsed and available in your `req` object on the backend. This allows you to easily access the values of your form inputs, such as `username` and `password`.