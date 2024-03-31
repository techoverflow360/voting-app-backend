const express = require('express');
require('dotenv').config();
const { connectToDatabase } = require('./connection');
const { authenticationMiddlewares } = require('./middlewares/auth');
const userRoutes = require('./routes/user');
const candidateRoutes = require('./routes/candidate');

const app = express();
connectToDatabase(process.env.MONGO_URL).then(() => console.log("Connected To MongoDB")).catch(err => console.log(err));
app.use(authenticationMiddlewares());

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(process.env.PORT, () => console.log(`Process running at PORT : ${process.env.PORT}`));

