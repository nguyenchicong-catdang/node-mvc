// backend/admin/controllers/LoginController.js

class LoginController {
    login() {
        return (req, res) => {
            // express-formidable will parse the form data into req.fields
            const { username, password } = req.body; 
            
            // Now you can access and use the form data
            console.log('Username:', username);
            console.log('Password:', password);
            
            res.json({ message: 'Login successful', username: username });
        };
    }
}

export { LoginController };