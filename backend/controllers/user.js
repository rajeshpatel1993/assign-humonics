const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const {User} = require("../models/user");





router.post("/add", async (req, res)=> {
    try{

        
   
    }catch(err){
        res.status(400).send(err);
    
    }


});


module.exports = router;