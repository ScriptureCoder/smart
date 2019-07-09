const User = require('../models/User');
const AuthController = require('../controllers/AuthController');


module.exports = async (req,res,next)=>{
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user){
            next();
        }else{
            AuthController.register(req,res,next)
        }

    }catch (e) {
        console.log(e);
    }
};
