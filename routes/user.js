const express = require('express');
const router = express.Router();
const { generateToken } = require('../middlewares/auth');

const User = require('../model/user');

router.post('/signup', async (req, res) => {
    // collect data -> create user -> save it -> make payload -> generate token -> send response with token 
    try {
        const data = req.body;
        const user = new User(data);
        const response = await user.save();
        console.log('User saved !');
        const payload = {
            id: response._id,
        }
        const token = generateToken(payload);
        res.status(200).json({ response : response, token : token });
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error '});
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});
        if(!user) {
            return res.status(401).json({ error: 'Invalid aadhar Number or password !'});
        }
        const payload = {
            id: user._id,
        }
        const token = generateToken(payload);
        res.status(200).json({ token : token });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !'});
    }
    
})

router.get('/profile', async (req, res) => {
    // get user id from req -> fetch complete user info -> return it -> handle the error 
    try {
        const user = req.user;
        const userid = user._id;
        const response = await User.findById(userid);
        res.status(200).json({ user : response });
    }catch(err){    
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error !'});
    }
})

// change password of user 
router.put('/profile/password', async (req, res) => {
    // collect userid -> collect old and new password -> get user from userid -> compare saved and old password -> change the password and save 
    try {
        const payload = req.user;
        const userid = payload._id;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(userid);
        if(!user.comparePassword(oldPassword)){
            return res.status(401).json({ error : "Invalid User !"});
        }
        user.password = newPassword;
        await user.save();
        console.log('Password updated !');
        res.status(200).json({ message : "Password updated !" });
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error !'});
    }
})


module.exports = router;
