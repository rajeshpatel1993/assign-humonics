const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const {User} = require("../models/user");
const {Account} = require("../models/account");
const config = require("../config/config");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const salt_round = config["app"].salt_round;
const jwt_salt = config['app'].jwt_salt;

let mail = config['app'].mail;
let pwd = config['app'].pwd;


const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
         user: mail,
         pass: pwd
     },
  tls: {
      rejectUnauthorized: false
    }
});


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
        let savedata = {username,email,gender,phone,city,password:generatedPassword, accountNo: parseInt(tendigitrandom)};
        const user_instance = new User(savedata);
    
        let sData = await user_instance.save();
        res.status(200).send(sData);

   
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    
    }


});

router.post("/acctno",async(req,res)=>{
    try {
      
      let {email} = req.body;
      let emaildata = await User.findOne({"email":email});
      let acctno = emaildata.accountNo;
      res.status(200).send({"acctno":acctno});
    } catch (error) {
      console.log(error);
    }
});



router.get("/getBallances/:accountno", async(req,res) =>{
  try {
      
    let accountno = req.params.accountno;

    let emaildata = await User.findOne({"accountNo":accountno});
    let email = emaildata.email;

      let aggData = await Account.aggregate([
        {$match: {"accountNo": accountno}},
        {
          $group:
            {
             _id: "$transaction_type",
              totalAmount: { $sum:'$amount' } 
            }
        },
  
      ]);
  
   
     let totalCredit = aggData[1].totalAmount;
     let totalDebit = aggData[0].totalAmount;
     let remainingBalance = totalCredit - totalDebit;
     let tmpObj = {"balance":remainingBalance};
      res.status(200).send(tmpObj);


    
  } catch (error) {
    console.log(error);
  }
});



router.post("/changePasswordOtp", async(req,res) =>{
  try {
      
    let {otp, password} = req.body;
    let grandom = Math.floor(Math.random()*90000) + 10000;

    const filter = { otp: otp };
    let generatedPassword = await bcrypt.hash(password, parseInt(salt_round));

    const update = { password: generatedPassword };
    let updatedOtp = await User.findOneAndUpdate(filter, update);

    res.status(200).json({"status":"success","msg":"Password changed"});

  } catch (error) {
    console.log(error);
  }
});


router.post("/generateOtp", async(req,res) =>{
  try {
      
    let {email} = req.body;
    let grandom = Math.floor(Math.random()*90000) + 10000;

    const filter = { email: email };
    const update = { otp: grandom };
    let updatedOtp = await User.findOneAndUpdate(filter, update);

    const mailOptions = {
      from: "rajesh@gmail.com", // sender address
      to: email, // list of receivers
      subject: 'Email Otp', // Subject line
      html:`Otp for change Password: : - ${grandom} `// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
    });


    res.status(200).json({"status":"success","msg":"Otp generated"});

  } catch (error) {
    console.log(error);
  }
});

router.get("/getPassbook/:accountno", async(req,res) =>{
  try {
      
    let accountno = req.params.accountno;
      let aggData = await Account.aggregate([
        {$match: {"accountNo": accountno}},
  
      ]);
      res.status(200).send(aggData);

  } catch (error) {
    console.log(error);
  }
});


router.post("/maketransaction", async(req,res) =>{
  try {
      
    let {accountno, amount, transtype} = req.body;

    let emaildata = await User.findOne({"accountNo":accountno});
    let email = emaildata.email;
    let totalDebit;
    let totalCredit;
    if(transtype == "debit"){
      let aggData = await Account.aggregate([
        // {$match: {"transaction_type": "credit"}},
        {
          $group:
            {
             _id: "$transaction_type",
              totalAmount: { $sum:'$amount' } 
            }
        },
  
      ]);
  
      // console.log(aggData);
      totalCredit = aggData[1].totalAmount;
      totalDebit = aggData[0].totalAmount;

   
    }

    // console.log(totalCredit);
    // console.log(totalDebit);
    let latDebitAmount = totalDebit + parseInt(amount);
    // console.log(latDebitAmount);
    if( (transtype == "debit") && (totalCredit < latDebitAmount)){
      res.status(200).send({"status":"lowbalance"});
      process.exit();
    }else{

      let savedata = {transaction_type:transtype,amount : amount,accountNo: accountno};
      const account_instance = new Account(savedata);
  
      let sData = await account_instance.save();
  
      const mailOptions = {
        from: "rajesh@gmail.com", // sender address
        to: email, // list of receivers
        subject: 'New Transaction', // Subject line
        html:`New transaction: \n Transaction type: - ${transtype} \n Transaction Amount:- ${amount}`// plain text body
      };
  
      transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log(err)
          else
            console.log(info);
      });
      let tmpObj = {};
      if(sData){
        
        tmpObj["status"] = "success";
        
      }else{
        tmpObj["status"] = "fail";
      }
  
      res.status(200).send(tmpObj);
  

    }


    // let aggD = aggData[0].
    // console.log(aggData);
    



    
  } catch (error) {
    console.log(error);
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
            tmpD["email"] = email;

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