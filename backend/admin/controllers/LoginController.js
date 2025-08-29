// backend/admin/controllers/LoginController.js
import { LoginModel } from "../models/LoginModel.js";
class LoginController {
    constructor() {
        this.loginModelInstance = new LoginModel();
    }
    login() {
        return async (req, res) => {
            // express-formidable will parse the form data into req.fields
            const { username, password } = req.body; 
            // validate
            try {
                const response = await this.loginModelInstance.validate(username, password);
                // lấy băm mật khẩu
                // const passhash = this.loginModelInstance.hashPassword('123');
                // console.log(passhash);
                // test lấy user
                // const user = await this.loginModelInstance.getUser();
                // console.log(user);
                if (response) {
                    //console.log(response)
                    return res.status(201).json({success: true});
                }
                return res.status(401).json({error:401});
            } catch (e) {
                console.log(e);
                return res.status(500).json({error:e});
            }
            // Now you can access and use the form data
            // console.log('Username:', username);
            // console.log('Password:', password);
            
            // res.json({ message: 'Login successful', username: username });
        };
    }
}

export { LoginController };