const express = require( "express" );
const app = express();
const router = express.Router();
const bcrypt = require( "bcryptjs" );
const cors = require( "cors" );
const cookieParser = require( "cookie-parser" );
const { Users } = require( "../models" );
const { createToken, validateToken, removeToken } = require("../middleware/JWT");

app.use( express.json() );
app.use( cookieParser() );
app.use( cors() );

//Register a user
router.post("/register", ( req, res ) => {
    
    try{
        const {
            firstName,
            lastName,
            gender,
            email,
            phoneNumber,
            avatar,
            username,
            password,
        } = req.body
        bcrypt.hash( password, 10 ).then(( hash ) => {
            Users.create({
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                email: email,
                phoneNumber: phoneNumber,
                avatar: avatar,
                username: username,
                password: hash,
            }).then(() => {
                res.json("Registration Complete")
            })
        });
    }catch ( error ) {
        res.status(404).json("Invalid Entry")
    }
});


router.get("/users", validateToken,async ( req, res ) => {
    try{
        const users =  await Users.findAll(); 
        res.json(users);
    }catch( error ){
        res.status(404).json("Invalid to read the users");
    }
});

router.post("/login", async ( req, res ) => {
    try {
        const { username, password } = req.body;

        const user  = await Users.findOne({ username: username });

        //check if user already exists
        if(!user){
            return res.json("user not found");
        };

        bcrypt.compare( password, user.password ).then(( match ) => {
            if(!match){
                return res.json( "Password is incorrect" );
            }

            const accessToken = createToken( user );
            res.cookie( "token", accessToken, {
                maxAge: 60 * 60 * 12 * 1000,
                httpOnly: true
            });

            res.json( "User Authenticated" );
        });

    }catch ( error ){
        res.status(404).json( error + "User Not Authenticated" );
    }
});

router.get("/logout", removeToken, async ( req, res ) => {
    res.json( "Log Out" );
});

module.exports = router;