const bcrypt = require('bcryptjs');
const UserModel = require('../models/signupUser');

exports.signup = async(req,res) => {
    try {
        const { name, email, password, confirmPassword } = req.body
        if( !name || !email || !password || !confirmPassword){
            return res.status(400).json({message:'All fields are required'})
        }

        console.log(name, email, password, confirmPassword)
        if( password !== confirmPassword){
            return res.status(400).json({message:'password did not match'});
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
        return res.status(200).json({ message: 'Email is already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
          });
          console.log(newUser)
          await newUser.save();
          res.status(200).json({message:'User registered successfully'})
        
    } catch (error) {
        res.status(500).json({error:error.message})
        
    }
};

