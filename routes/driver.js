import express from "express";
const Router = express.Router();
import pool from "../config/config.js";
import config from "../config.js";
import query from "../utils/query.js";
import path from "path";
import fs from "fs";


Router.get('/driver', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
              const id = req.body.id;
              const sql = `SELECT * from driver`;
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

//POST
Router.post('/adddriver', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
              const full_name = req.body.full_name;
              const email = req.body.email;
              const phone = req.body.phone;
              const password = req.body.password;
              const address = req.body.address;
            const sql = `INSERT INTO driver (full_name,email,phone,password,address)
            VALUES ('${full_name}','${email}','${phone}','${password}','${address}')`
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

Router.post('/updatedriver',async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            const id = req.body.id;
            const full_name = req.body.full_name;
            const email = req.body.email;
            const phone = req.body.phone;
            const address = req.body.address;
              const sql = `UPDATE driver SET full_name="${full_name}", email="${email}", phone="${phone}",address="${address}" WHERE id=${id}`;
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

Router.post('/deldriver',async(req,res)=>{
    pool.getConnection(async(err,conn) =>{
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          }
          else{
            const ID = req.body.id;
            const full_name = req.body.full_name;
            console.log(ID);
            const sql = `DELETE FROM driver WHERE id=${ID}`;
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
