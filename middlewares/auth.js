const jwt = require('jsonwebtoken');
require('dotenv').config();

// first function is generate token 
// second is authenticationMiddleware
// third is authorization middleware ( inline )

const generateToken = (payload) => {
    // received payload -> sign a token -> return it 
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token; 
}

// to authenticate, client pass token through the authentication header 
const authenticationMiddlewares = (req, res, next) => {
    // check authorization header -> if not found return -> extract token -> if not found return -> verify it -> load user into request and next -> else catch throws
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({ error : 'No Authorization token !'});
    const token = authorization.split(' ')[1];
    if(!token) return res.status(401).json({ error : 'Token not found, Authentication Failed !'});
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }catch(err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid token !' });
    }
}


module.exports = {
    generateToken, 
    authenticationMiddlewares,
}