const mongoose = require("mongoose");
const config = require("./config/config");
let db_uri = config["db"].mongo_uri;
let server_port = config["app"].port;


 console.log(db_uri);

mongoose.connect(db_uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('connected to Mongodb..'))
    .catch((err) => {
        console.log("unable to connect to the database: ",err);
        process.exit();
        throw err;
});

mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

