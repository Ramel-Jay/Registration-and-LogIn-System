const jwt = require("jsonwebtoken");

const createToken = ( user ) => {
    const accessToken = jwt.sign({ username: user.username, password: user.password }, "BuloyLangMalakasMarshmallow27");
    return accessToken;
};

const validateToken = ( req, res, next ) => {
    const accessToken = req.cookies[ "token" ];

    if(accessToken) {
        try{
            const validToken = jwt.verify( accessToken, "BuloyLangMalakasMarshmallow27" );
            req.user = validToken;
            
            if( validToken ){
                console.log( "User Authenticated" );
                req.authenticated = true;
                return next();
            }
        }catch ( error ) {
            return res.json({ error: error });
        } 
    }else{
        return res.json({ error: "User Not Authenticated" });
    }
}

const removeToken = ( req, res ) => {
    res.clearCookies( "token" );
    res.json( "Log Out" )
};

module.exports = { createToken, validateToken, removeToken };