import jwt from "jsonwebtoken";
import express from "express";
import { authenticateJwt, SECRET } from "../middleware";
import { User } from "../db";

const router = express.Router();




router.post('/Signup', async (req,res)=>{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(user){
        res.status(403).json({message: 'User already exists'});
    }
    else{
        const newUser = new User({username, password});
        await newUser.save();
        const token = jwt.sign({ id: newUser.id}, SECRET, {expiresIn: '1h'});// only new thing here is ki instead of email we are storing the id to get a token and its a GOOD PRACTICE\
        // cuz ID is enough to identify the user 
        res.json({message: 'User created successfully', token});
    }
});



router.post('/login', async (req,res)=>{
    const {username, password} = req.body;
    const user = await User.findOne({username, password});
    if(user){
        const token = jwt.sign({ id: user.id}, SECRET, {expiresIn: '1h'});
        res.json({message: 'Logged in successfully', token});
    }
    else{
        res.status(403).json({message: 'Invalid username or password'});
    }
});


// iska use case ye hai ki either user hho to hame uski id and logout button dikehaga vrna back to login page
router.get('/me', authenticateJwt, async(req,res)=>{
    const userId = req.headers["userId"];// only vvimp change we made here cuz ts allows this way only 
    const user = await User.findOne({id: userId});
    if(user){
        res.json({username: user.username});
    }
    else{
        res.status(403).json({message: 'User not logged in'});
    }
});



export default router;


