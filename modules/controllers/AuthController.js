const User = require('../models/User');

exports.login = (req, res, next)=>{
    User.findOne({email: req.body.email})
        .then(user =>{
            if (!user){
                return res.status(401).json({
                    success: false,
                    message: "Email or Password Incorrect"
                })
            }
            if (user.validPassword(req.body.password)){
                const token = encode(user);
                return res.status(200).json({
                    success: true,
                    message: "Authentication Successful!",
                    token: token
                })
            }
            return res.status(401).json({
                success: false,
                message: "Email or Password Incorrect"
            })
        }).catch((error)=>{
        return res.status(500).json({
            success: false,
            message: error,
        })
    })
};

exports.register= async (req,res)=>{
    const {body} = req;

    const data = {
        name: body.name,
        username: body.username,
    };
    data.password = User.generateHash(body.password);

    const user = await new User(data).save();

    if (user){
        return res.json({
            status: true,
            message: "Account Created Successfully!"
        })
    }
};
