import express from "express";
const Router = express.Router();
import pool from "../config/config.js";
import config from "../config.js";
import query from "../utils/query.js";
import path from "path";
import fs from "fs";





Router.get('/creatcustomer', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
              const id = req.params.id;
            //  const sql = `SELECT * from createcustomer Where id = ${id}`;
            const sql = 'SELECT * from createcustomer';
              const result = await query(sql, conn);
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
Router.post('/addcustomer', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            
            const  randomId = generateRandomId();
              const name = req.body.name;
              const email = req.body.email;
              const phone = req.body.phone;
              const altphone = req.body.altphone;
              const address = req.body.address;


        
            const sql = `INSERT INTO createcustomer (id,name,email,phone,altphone,address)
            VALUES (${randomId},'${name}','${email}','${phone}','${altphone}','${address}')`
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

Router.post('/updatecustomer',async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            const id = req.body.id;
            const name = req.body.name;
            const email = req.body.email;
            const phone = req.body.phone;
            const altphone = req.body.altphone;
            const address = req.body.address;


              const sql = `UPDATE createcustomer SET name="${name}", email="${email}", phone="${phone}",altphone="${altphone}" address ="${address}" WHERE id=${id}`;
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

Router.post('/delcustomer',async(req,res)=>{
    pool.getConnection(async(err,conn) =>{
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          }
          else{
            const ID = req.body.id;
            const full_name = req.body.full_name;
            console.log(ID);
            const sql = `DELETE FROM createcustomer WHERE id=${ID}`;
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
