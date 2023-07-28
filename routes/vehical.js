import express from "express";
const Router = express.Router();
import pool from "../config/config.js";
import config from "../config.js";
import query from "../utils/query.js";
import path from "path";
import fs from "fs";


Router.get('/creatvehical', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
              const id = req.body.id;
              const sql = `SELECT * from vehical `;
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
Router.post('/addvehical', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            
            const  randomId = generateRandomId();
              const name = req.body.name;
            //   const email = req.body.email;
              const vehicalplate = req.body.vehicalplate;
            //   const phone = req.body.phone;

            // '${email}'
            // ,'${phone}'
        
            const sql = `INSERT INTO vehical (id,name,vehicalplate)
            VALUES (${randomId},'${name}','${vehicalplate}')`
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

Router.post('/updatevehical',async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            const id = req.body.id;
            const name = req.body.name;
            // const email = req.body.email;
            const vehicalplate = req.body.vehicalplate;
            // , email="${email}"
              const sql = `UPDATE vehical SET name="${name}", vehicalplate="${vehicalplate}" WHERE id=${id}`;
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

Router.post('/delvehical',async(req,res)=>{
    pool.getConnection(async(err,conn) =>{
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          }
          else{
            const ID = req.body.id;
            const full_name = req.body.full_name;
            console.log(ID);
            const sql = `DELETE FROM vehical WHERE id=${ID}`;
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
