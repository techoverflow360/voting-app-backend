const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    age: {
        type:Number,
        required: true,
    },
    email: {
        type: String,
    },
    mobile:{
        type: String, 
    },
    address: {
        type: String, 
        required: true,
    },
    aadharCardNumber: {
        type: String, 
        required: true,
        unique: true, 
    },
    password: {
        type: String, 
        required: true,
    },
    role: {
        type: String, 
        enum : ['voter', 'admin '],
        default: 'voter',
    },
    isVoted : {
        type: Boolean, 
        default: false,
    },
}, { timestamps: true });

// pre - save method : hash password before saving 
userSchema.pre('save', async function(next){
    // get current user using this -> if password not changed then next -> create hash and generate hashed password -> update password and call next -> handle error 
    const user = this;
    if(!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

// custom function for comparing password 
userSchema.methods.comparePassword = async function(candidatePassword) {
    try{
        const isMatch = bcrypt.compare(comparePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}


const User = mongoose.model('user', userSchema);
module.exports = User;