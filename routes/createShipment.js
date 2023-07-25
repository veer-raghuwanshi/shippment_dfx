import express from "express";
const Router = express.Router();
import pool from "../config/config.js";
import config from "../config.js";
import query from "../utils/query.js";
import path from "path";
import fs from "fs";


Router.get('/createshipment', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
              const id = req.body.id;
              const sql = `SELECT * from customer `;
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
Router.post('/addcreatshipment', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            
            const  randomId = generateRandomId();
              const custoname = req.body.custoname;
              const custocontactnum = req.body.custocontactnum;
              const custoemail = req.body.custoemail;
              const custoaltnum = req.body.custoaltnum;
              const pickuplocation = req.body.pickuplocation;
              const droplocation = req.body.droplocation;
              const description = req.body.description;
              const shipwork = req.body.shipwork;


            const sql = `INSERT INTO customer (id,custoname,custocontactnum,custoemail,custoaltnum,pickuplocation,droplocation,description,shipwork)
            VALUES (${randomId},'${custoname}','${custocontactnum}','${custoemail}','${custoaltnum}','${pickuplocation}','${droplocation}','${description}','${shipwork}')`
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

Router.post('/updatecreatshipment',async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            const id = req.body.id;
            const vehicalplate = req.body.vehicalplate;
            const helper1 = req.body.helper1;
            const helper2 = req.body.helper2;
            const assigndriver = req.body.assigndriver;
              const sql = `UPDATE customer SET vehicalplate="${vehicalplate}", helper1="${helper1}", helper2="${helper2}", assigndriver="${assigndriver}" WHERE id=${id}`;
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

Router.post('/delcreatshipment',async(req,res)=>{
    pool.getConnection(async(err,conn) =>{
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          }
          else{
            const ID = req.body.id;
            const full_name = req.body.full_name;
            console.log(ID);
            const sql = `DELETE FROM customer WHERE id=${ID}`;
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
