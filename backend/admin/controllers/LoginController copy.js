// backend/admin/controllers/LoginController.js

class LoginController {
    constructor(routes) {
        this.routes = routes;
    }
    
    // index(req, res) {
    //     return res.send('Admin controller')
    // }

    // login(req, res) {
    //     if (req.method === "POST") {
    //         return res.json({login:'test json'});
    //     }
    // }
    login(req, res) {
        // This is the actual function that Express will execute.
        res.send('This is the login page.');
    }
}

export {LoginController}