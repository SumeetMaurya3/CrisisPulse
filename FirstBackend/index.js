// Modular Imports
import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import User from "./Models/User.models.js";
import { Strategy as OAuth2Strategy } from "passport-google-oauth2";
dotenv.config()


// Route imports
import Connection  from "./db.js";
import AuthRoutes from './Routes/Auth.routes.js'




// Setup
const app = express()
app.use(cors({
    origin : '*',
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())
const port = parseInt(process.env.PORT) || 5000;

app.listen(port , ()=>{
    console.log(`App is running on port ${port}`)
})

// Database Connection
Connection()



// Basic Routes
app.use('/authe' , AuthRoutes)

app.use(session({
    secret:"YOUR SECRET KEY",
    resave:false,
    saveUninitialized:true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:clientid,
        clientSecret:clientsecret,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        try {
            let user = await User.findOne({googleId:profile.id});

            if(!user){
                user = new User({
                    googleId:profile.id,
                    name :profile.displayName,
                    email:profile.emails[0].value,
                    avatar :profile.photos[0].value,
                    password : "Google",
                });

                await user.save();
            }

            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
});

// initial google ouath login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:5173/dashboard",
    failureRedirect:"http://localhost:5173/auth/login"
}))

app.get("/login/sucess",async(req,res)=>{

    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:3000");
    })
})
