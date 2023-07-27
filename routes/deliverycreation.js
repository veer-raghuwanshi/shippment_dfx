import express from "express";
const Router = express.Router();
import pool from "../config/config.js";
import config from "../config.js";
import query from "../utils/query.js";
import path from "path";
import fs from "fs";



Router.get('/deliverycreation', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
              const id = req.body.id;
              const sql = `SELECT * from totalshipmentrecord where id = ${id} `;
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
Router.post('/adddeliverycreation', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          } 
          else{
            
              const  randomId = generateRandomId();
              const custoname = req.body.custoname;
              const custonum = req.body.custonum;
              const droplocation = req.body.droplocation;
              const dropdate = req.body.dropdate;
              const selectshipment = req.body.selectshipment;
              const adddesc = req.body.adddesc ;
              const vehicleplate = req.body.vehicleplate;
              const helper = req.body.helper;
              const assigndriver = req.body.assigndriver;


            const sql = `INSERT INTO deliverycreation (id,custoname,custonum,droplocation,dropdate,selectshipment ,adddesc,vehicleplate,helper,assigndriver)
            VALUES (${randomId},'${custoname}','${custonum}','${droplocation}','${dropdate}','${selectshipment}','${adddesc}','${vehicleplate}','${helper}','${assigndriver}')`
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

Router.post('/updatetotalshipmentrecord',async (req, res) => {
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
