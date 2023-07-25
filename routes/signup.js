import express from "express";
const Router = express.Router();
// import pool from "../config/config.js";
import config from "../config.js";
import query from "../utils/query.js";
import path from "path";
import fs from "fs";
import multiparty from 'multiparty';
import dotenv from 'dotenv'
import mysql from 'mysql'
import md5 from 'md5'

// MySQL database connection
const pool = mysql.createPool({
  host: '89.117.27.154', // Replace with your host name
  // port: '3306',
  user: 'u219507986_shipingnew',     // Replace with your database email
  password: 'pFuSG;@F+8',     // Replace with your database password   ///df-opcity-home
  database: 'u219507986_shipingnew'
});

  Router.post("/", function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log(err);
      } else {
        conn.query("SELECT * FROM identities WHERE username=?", username, function (err, rows) {
          //console.log(rows);
          if (rows.length > 0) {
            res.send({result:"User name already exist"});
          } else {
            conn.query(`INSERT INTO identities ( username,password) VALUES ('${username}', '${password}' )`, function (err) {
              if (err) {
                res.send({result:err});
              } else {
                res.send({result:"Sign up successfull"});
                console.log("Successfully inserted data");
              }
            })
          }
        })

        pool.releaseConnection(conn);
      }
    })
  });

export default Router;
