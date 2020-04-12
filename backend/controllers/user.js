const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const {User} = require("../models/user");
const config = require("../config/config");
const bcrypt = require('bcrypt');


const salt_round = config["app"].salt_round;
console.log(salt_round);

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
        let {username,email,gender, phone,city, password} = req.body;
        let generatedPassword = await bcrypt.hash(password, parseInt(salt_round));
        let savedata = {username,email,gender,phone,city,password:generatedPassword};

        const user_instance = new User(savedata);
    
        let sData = await user_instance.save();
        res.status(200).send(sData);

   
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    
    }


});


module.exports = router;