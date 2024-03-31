const express = require('express');
require('dotenv').config();
const { connectToDatabase } = require('./connection');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
connectToDatabase(process.env.MONGO_URL).then(() => console.log("Connected To MongoDB")).catch(err => console.log(err));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// app.use(cookieParser());






app.listen(process.env.PORT, () => console.log(`Process running at PORT : ${process.env.PORT}`));

