import express from "express";
const Router = express.Router();
import pool from "../config/config.js";
import config from "../config.js";
import query from "../utils/query.js";
import path from "path";
import fs from "fs";


Router.get('/createhelper', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
              const id = req.body.id;
              const sql = `SELECT * from helper `;
              const result = await query(sql, conn);
            //   console.log(result)
              if(result){
                  res.send(result);
              }
              else{
                  res.send({result:"Something went wrong"});
              }
        }
    })
})

//*********************************************** */
const generateRandomId = () => {
    return Math.floor(Math.random() * 90000) + 1;
  };
//*********************************************** */

//POST
Router.post('/addhelper', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            
            const  randomId = generateRandomId();
              const name = req.body.name;
              const email = req.body.email;
              const address = req.body.address;
              const phone = req.body.phone;
              const DateAndTime = req.body.DateAndTime;


        
            const sql = `INSERT INTO helper (id,name,email,address,phone,DateAndTime)
         VALUES (${randomId},'${name}','${email}','${address}','${phone}','${DateAndTime}')`
            // const values = [randomId];
              const result = await query(sql, conn);
              if(result){
                  res.send({result:"successfully added"});
              }
              else{
                  res.send({result:"Something went wrong"});
              }
            
          }
    })
})

//PUT METHOD

Router.post('/updatehelper',async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            const id = req.body.id;
            const name = req.body.name;
            const email = req.body.email;
            const address = req.body.address;
            const phone = req.body.phone;

              const sql = `UPDATE helper SET name="${name}", email="${email}", address="${address}",phone="${phone}" WHERE id=${id}`;
              const result = await query(sql, conn);
              if(result){
                  res.send({result:"successfully updated"});     
              }
              else{
                  res.send({result:"Something went wrong"});
              }
            
          }

    })
})

Router.post('/delhelper',async(req,res)=>{
    pool.getConnection(async(err,conn) =>{
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          }
          else{
            const ID = req.body.id;
            const full_name = req.body.full_name;
            console.log(ID);
            const sql = `DELETE FROM helper WHERE id=${ID}`;
            const result = await query(sql, conn);
            if(result){
                res.send("successfully deleted");
            }
            else{
                res.send({result:"Something went wrong"});
            }
            // poolconnection.releaseConnection(conn);
          }
    })
 })

export default Router;
