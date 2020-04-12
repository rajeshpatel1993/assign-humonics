const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const {User} = require("../models/user");
const config = require("../config/config");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const salt_round = config["app"].salt_round;
const jwt_salt = config['app'].jwt_salt;

router.post("/register", [
    // Email must be an email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ], async (req, res)=> {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        let tendigitrandom = Math.floor(1000000000 + Math.random() * 9000000000);

        let {username,email,gender, phone,city, password} = req.body;
        let generatedPassword = await bcrypt.hash(password, parseInt(salt_round));
        let savedata = {username,email,gender,phone,city,password:generatedPassword, accountNo: tendigitrandom};
        const user_instance = new User(savedata);
    
        let sData = await user_instance.save();
        res.status(200).send(sData);

   
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    
    }


});


router.post("/login", [
    // Email must be an email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ], async (req, res)=> {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        let {email,password} = req.body;
        let hash = await User.findOne({"email":email});
        let hashedPwd = hash.password;
        let matchPassword = await bcrypt.compare(password,hashedPwd);
        let tmpD = {};
        if(matchPassword){
            let token = jwt.sign({ 'email': email }, jwt_salt);

           
            tmpD["status"] = "success";
            tmpD["token"] = token;

        }else{
            tmpD["status"] = "fail";

        }

         res.status(200).send(tmpD);

   
    }catch(err){
        // console.log(err);
        res.status(400).send(err);
    
    }


});



module.exports = router;