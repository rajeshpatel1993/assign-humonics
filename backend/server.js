//server.js
const express = require('express');
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require("./config/config");

require('./connection');
let server_port = config["app"].port;


const userController = require("./controllers/user");


const app = express();
app.use(cors());
app.use(helmet()); // better status code
app.use(morgan('tiny')); // logs reqs meta data in console
app.use(bodyParser.json({limit: '10mb', extended: true}));

app.use('/api/user', userController);






// console.log(`Your port is ${process.env.PORT}`);

app.listen(server_port, () => {
    console.log(`App listening on port ${server_port}!`)
});