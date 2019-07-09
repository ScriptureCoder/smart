const AuthController = require('../../controllers/AuthController');
const register = require('../../helpers/register');

module.exports=(app)=>{
    app.post('/login', register, AuthController.login);
    // app.post('/register', register, AuthController.register);
};
