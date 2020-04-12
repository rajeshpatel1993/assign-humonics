// config.js
const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || '',
        mail: process.env.MAIL_ID,
        pwd: process.env.PASS,
        salt_round: process.env.SALT_ROUND
        },
    db: {
        mongo_uri: process.env.MONGO_URI
    }

};

const prod = {

    app: {
        port: parseInt(process.env.PROD_APP_PORT) || '',
        mail: process.env.MAIL_ID,
        pwd: process.env.PASS,
        salt_round: process.env.SALT_ROUND




    },
    db: {
        mongo_uri: process.env.MONGO_URI
    }
}

const config = {
    dev,
    prod
};

module.exports = config[env];
