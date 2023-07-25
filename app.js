import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from 'path';
// import fileUpload from 'express-fileupload'

import signupRoute from './routes/signup.js'
import loginRoute from './routes/login.js'
import resetPasswordRoute from './routes/resetPassword.js'
import changepassRoute from './routes/changepass.js'
import dispatcherRoute from './routes/dispatcher.js'
import driverRoute from './routes/driver.js'
import login1Route from './routes/login1.js'


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors());
app.use('/uploads',express.static("uploads"))
// app.use(fileUpload())
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route

app.get("/", (req, res) => {
  res.json({ message: "welcome to dwellfox" });
});

app.use('/signup',signupRoute);
app.use('/login',loginRoute);
app.use('/api',login1Route);


app.use('/api',resetPasswordRoute);
app.use('/api',changepassRoute);
app.use('/dispatcher',dispatcherRoute);
app.use('/driver',driverRoute);
// app.use('/apidomain',domainRoute);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });