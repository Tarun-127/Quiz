const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/signupUser');

exports.login = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res
            .status(400)
            .json({message:'invalid email or password'});
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(!isPasswordValid){
            return res
            .status(400)
            .json({message:'invalid email or password'});
            
        }

        const token = jwt.sign(
            {userId:user._id},
            process.env.SECRET_KEY,
            {expiresIn:'1h'}
        );
            res.json({
                message: "User logged in",
                token: token,
                userId: user._id,
                name: user.name,
            });
        
    } catch (error) {
        res
        .status(500)
        .json({ error: error.message });
    }
}




