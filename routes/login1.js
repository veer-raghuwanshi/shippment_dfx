import express from "express";
import jwt from "jsonwebtoken";
const Router = express.Router();
import mysql from 'mysql'
import md5 from 'md5'
import nodemailer from "nodemailer";

const app = express();

// MySQL database connection
const pool = mysql.createPool({
    host: '89.117.27.154', // Replace with your host name
    // port: '3306',
    user: 'u219507986_shipment',      // Replace with your database email
    password: 'Shipment@1234#',      // Replace with your database password    ///df-opcity-home
    database: 'u219507986_shipment'
 });


 const generateAccessToken =(email) => {
    return jwt.sign(email, process.env.TOKEN_SECRET);
  };



// Endpoint to handle login
Router.post('/login', (req, res) => {
  const { email, password, deviceId, deviceName } = req.body;

  // Check if the request contains necessary fields
  if (!email || !password || !deviceId || !deviceName) {
    return res.status(400).json({ status:"400", message: 'Missing fields in the request' });
  }

  // Check if the device ID and device name match the database record
  const selectQuery = 'SELECT * FROM driver WHERE email = ? AND password = ? AND device_id = ? AND device_name = ?';
  pool.query(selectQuery, [email, password, deviceId, deviceName], (err, results,rows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ status:"500", message: 'Error processing the request' });
    }

    if (results.length === 0) {
      return res.status(401).json({ status:"401", message: 'Invalid credentials or device information' });
    }

    const user_id1 = rows[0].id;
    //generate token
    const token = generateAccessToken({ email, user_id1 });

    

    // Successfully logged in
    return res.json({ login:true,token:token,user_id:user_id1,message: 'Login successful' });
  });
});

export default Router;