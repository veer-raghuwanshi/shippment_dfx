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
              const sql = `SELECT * from deliverycreation`;
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
              const randomId = generateRandomId();
              const driverId = generateRandomId();
              const custoname = req.body.custoname;
              const custonum = req.body.custonum;
              const droplocation = req.body.droplocation;
              const dropdate = req.body.dropdate;
              const selectshipment = req.body.selectshipment;
              const adddesc = req.body.adddesc ;
              const vehicleplate = req.body.vehicleplate;
              const helper = req.body.helper;
              const assigndriver = req.body.assigndriver;
            const sql = `INSERT INTO deliverycreation (id,assigndriverid,custoname,custonum,droplocation,dropdate,selectshipment ,adddesc,vehicleplate,helper,assigndriver)
            VALUES (${randomId},${driverId},'${custoname}','${custonum}','${droplocation}','${dropdate}','${selectshipment}','${adddesc}','${vehicleplate}','${helper}','${assigndriver}')`
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
            const custoname = req.body.custoname;
            const custonum = req.body.custonum;
            const droplocation = req.body.droplocation;
            const dropdate = req.body.dropdate;
            const selectshipment = req.body.selectshipment;
            const adddesc = req.body.adddesc ;
            const vehicleplate = req.body.vehicleplate;
            const helper = req.body.helper;
            const assigndriver = req.body.assigndriver;
              const sql = `UPDATE deliverycreation SET custoname="${custoname}", custonum="${custonum}", droplocation="${droplocation}", dropdate="${dropdate}",selectshipment="${selectshipment}",adddesc="${adddesc}",vehicleplate="${vehicleplate}",helper="${helper}",assigndriver="${assigndriver}" WHERE id=${id}`;
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
Router.post('/deltotalshipmentrecord',async(req,res)=>{
    pool.getConnection(async(err,conn) =>{
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
          }
          else{
            const ID = req.body.id;
            const full_name = req.body.full_name;
            console.log(ID);
            const sql = `DELETE FROM deliverycreation WHERE id=${ID}`;
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