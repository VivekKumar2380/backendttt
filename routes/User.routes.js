const express = require('express')
const {UserModel}=require("../model/User.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const UserRouter=express.Router()
UserRouter.post("/register" , async(req,res)=>{
    const {name,email,password}=req.body
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            const user= new UserModel({email,name,password:hash})
            await user.save()
            res.status(200).send({"msg":"New user has been registered"})
        })
    } catch (error) {
        res.status(400).send({"error":error.message})
    }
})

UserRouter.post("/login", async(req,res)=>{
    const {email,password}=req.body
    try{
const user = await  UserModel.findOne({email: email})
if(user){
    bcrypt.compare(password,user.password ,function(err,result){
        if(result){
            const token=jwt.sign({id:user._id,username:user.name}, 'india');
            // localStorage.setItem('jwt_token',token);
            res.status(200).send({"msg":"Login successful", "token":token})
        }else{
            res.status(200).send({"msg":"Wrong Credentials"})
        }
    })
}else{
    res.status(200).send({"msg":"Wrong Credentials"})
}
    }catch(error){
        res.status(400).send({"error":error.message})
    }
})

module.exports={
    UserRouter
}