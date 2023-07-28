import express from "express";
const Router = express.Router();
import mysql from 'mysql'


// MySQL database configuration
const pool = mysql.createPool({
    host: '89.117.27.154', // Replace with your host name
    // port: '3306',
    user: 'u219507986_shipingnew',      // Replace with your database email
    password: 'pFuSG;@F+8',      // Replace with your database password    ///df-opcity-home
    database: 'u219507986_shipingnew'
 });

// API endpoint for inserting data into the shipments table
Router.post('/payment', (req, res) => {
  const { full_name, shipment_id, amount, DateAndTime } = req.body;

  // Validate the incoming data
  if (!full_name || !shipment_id || !amount) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Insert data into the shipments table
  const query = 'INSERT INTO money (full_name, shipment_id, amount, DateAndTime) VALUES (?, ?, ?, ?)';
  pool.query(query, [full_name, shipment_id, amount, DateAndTime], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Failed to insert data.' });
    }

    console.log('Data inserted successfully.');
    res.status(200).json({ message: 'Data inserted successfully.' });
  });
});


export default Router;