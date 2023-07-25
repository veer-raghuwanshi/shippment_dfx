
import express from "express";
import jwt from "jsonwebtoken";
const Router = express.Router();
import mysql from 'mysql'
import md5 from 'md5'
import nodemailer from "nodemailer";


// router.set('view engine', 'ejs');

// router.use(express.static("public"));

const pool = mysql.createPool({
   host: '89.117.27.154', // Replace with your host name
   // port: '3306',
   user: 'u219507986_shipingnew',      // Replace with your database email
   password: 'pFuSG;@F+8',      // Replace with your database password    ///df-opcity-home
   database: 'u219507986_shipingnew'
});
// generate access token
const generateAccessToken =(username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET);
};



Router.post("/", function (req, res) { 
  const username = req.body.username;
  const password = req.body.password;
 
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log(err);
    } else {
      //check credentials in database
      conn.query("SELECT * FROM identities WHERE username=?", username, function (err, rows) {
        //console.log(rows);
        if (rows.length > 0) {
          if (rows[0].password === password) {
            // console.log("User Found");
            const user_id1 = rows[0].id;

            //generate token
            const token = generateAccessToken({ username, user_id1 });
            
            res.json({login:true,token:token,user_id:user_id1, msg:"Login successfull"});
          } else {
            console.log("incorrect password");
            res.send({login:false, msg:"Incorrect password"});
          }
        } else {
          res.send({login:false, msg:"User not found"});
        }
      })
      pool.releaseConnection(conn);
    }
  })
});

////

Router.post('/changepassword', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var username = req.body.username;
      var password = req.body.password;

      conn.query(`UPDATE identities SET password="${password}" WHERE username="${username}"`, function (err,password) {
        if (err) {
          res.send({ result: err });
          if (!password ) {
            console.log('Incorrect username error.');
            return done(null, false, { message: 'Incorrect username.' });
        }
        console.log('Trying user.validPassword() call');
        if (!password.validPassword(password)) {
            console.log('Incorrect password.');
            return done(null, false, { message: 'Incorrect password.' });
        }
        console.log('All correct, user found: ', password);
        return done(null, password);
        } else {
          res.send({ result: "password update successfull" });
        }
      });
      pool.releaseConnection(conn);
    }
  })

});

// Change password endpoint
// Router.post('/change-password', (req, res) => {
//   pool.getConnection(async (err, conn) => {
//   const { username, oldPassword, newPassword } = req.body;
//   // Check if the username and passwords are provided
//   if (!username || !oldPassword || !newPassword) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }
//   // Fetch user from the database
//   conn.query('SELECT * FROM identities WHERE username = ?', [username], (err, results) => {
//     if (err) {
//       console.error('Failed to fetch user from the database', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     // Check if the user exists
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     const user = results[0];
//     // Check if the old password matches
//     if (user.password !== oldPassword) {
//       return res.status(401).json({ error: 'Invalid old password' });
//     }
//     // Update the user's password
//     conn.query('UPDATE identities SET password = ? WHERE username = ?', [newPassword, username], (err) => {
//       if (err) {
//         console.error('Failed to update user password', err);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//       return res.status(200).json({ message: 'Password updated successfully' });
//     });

//     var clientPort = 465;
//     var clientSmtp = 'smtp.hostinger.com';
//     // var clientMail = 'mannurajput3536@gmail.com'

//     var useSmtp = clientSmtp ? clientSmtp : 'smtp.hostinger.com';
//     var usePort = clientPort ? clientPort : 465;

//     const mailData = {
//       from: "noreply@dwellfox.com", // sender address
//       to: "mannurajput3536@gmail.com", // list of receivers
//       subject: "Dashboard Password change",
//       text: 'That was easy!',
//       html:`<!DOCTYPE html>
//       <html>
//          <head>
//             <meta charset="utf-8" />
//             <title>A simple, clean, and responsive HTML invoice template</title>
//             <style>
//               h1,h2,h3,h4,h5,h6,p{
//                   font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
//               }
//                .invoice-box {
//                   max-width: 700px;
//                   margin: auto;
//                   border-radius: 13px;
//                   border: 1px solid #406EFF;
//                   box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
//                   font-size: 16px;
//                   line-height: 24px;
                 
//                   color: #555;
//                }
//               .tabledata tr th{
//                   /* border: 1px solid #000; */
//                   font-size: 18px;
//                   padding: 10px;
//                   color: #000;
//                   font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
//                }
//                .tabledata tr td{
//                   border: 1px solid #BCCCFF;
//                   padding: 10px;
//                   font-size: 16px;
//                   color: #000;
//                   font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
//                }
//                .invoice-box table {
//                   width: 100%;
//                   line-height: inherit;
//                   text-align: left;
//                }
//                .invoice-box table td {
//                   /* padding: 5px; */
//                   vertical-align: top;
//                }
//                /* .invoice-box table tr td:nth-child(2) {
//                   text-align: right;
//                } */
//                .invoice-box table tr.top table td {
//                   padding-bottom: 20px;
//                }
//                .invoice-box table tr.top table td.title {
//                   font-size: 45px;
//                   line-height: 45px;
//                   color: #333;
                  
//                }
//                /* .invoice-box table tr.information table td {
//                   padding-bottom: 40px;
//                } */
//                .invoice-box table tr.heading td {
//                   background: #eee;
//                   border-bottom: 1px solid #ddd;
//                   font-weight: bold;
//                }
//                .invoice-box table tr.details td {
//                   padding-bottom: 20px;
//                }
//                .invoice-box table tr.item td {
//                   border-bottom: 1px solid #eee;
//                }
//                .invoice-box table tr.item.last td {
//                   border-bottom: none;
//                }
//                .invoice-box table tr.total td:nth-child(2) {
//                   border-top: 2px solid #eee;
//                   font-weight: bold;
//                }
//                @media only screen and (max-width: 600px) {
//                   .invoice-box table tr.top table td {
//                      width: 100%;
//                      display: block;
//                      text-align: center;
//                   }
//                   .invoice-box table tr.information table td {
//                      width: 100%;
//                      display: block;
//                      text-align: center;
//                   }
//                }
//                /** RTL **/
//                .invoice-box.rtl {
//                   direction: rtl;
//                   font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
//                }
//                .invoice-box.rtl table {
//                   text-align: right;
//                }
//                .invoice-box.rtl table tr td:nth-child(2) {
//                   text-align: left;
//                }
              
//                .tb_header{
//                   background-color: #000;
//           color: #fff;
//           border: 1px solid #000;
//           font-weight: 500;
//                }
//                .all_details {
        
//           text-align: right;
//          /* border: 1px solid #000; */
//          border-collapse: collapse;
//       }
      
      
      
      
      
//       .boldcolor{
//           font-weight: bold;
//           color: #000;
//           text-align: right;
          
//       }
//       .borerdder tr{
//          border: 1px solid #000;
      
//          border-collapse: collapse;
//          margin: 0;
//          border-spacing: 0;
//       }
//       .borerdder td{
//          padding: 10px;
//       }
//             </style>
//          </head>
//          <body>
//             <div class="invoice-box">
//                <table cellpadding="0" cellspacing="0">
//                   <tr class="top">
//                      <td colspan="2">
//                         <table style="background-image:linear-gradient(to right,#6A11CB,#2575FC);border-radius: 13px 13px 0 0;">
//                            <tr>  
//                               <td >
//                               </td>
//                            </tr>
//                         </table>
//                      </td>
//                   </tr>
//                </table>
//                <table cellpadding="0" cellspacing="0" style="padding: 0 50px;">
//                   <tr class="top">
//                      <td colspan="3">
//                         <table style=" margin-bottom: 0; margin-top: 10px;">
//                            <tr>
//                               <td style="vertical-align: middle; color: #000; padding-top: 50px;">
//                                  <h3 style="margin-bottom: 0;">Your Password has been successfully change.</h3>
//                               </td>
//                               <td style="text-align: end; padding-top: 20px; padding-bottom: 0;">
//                                   <img src="https://www.dwellfox.com/images/dark-logo.png"  width="200" alt="">
//                               </td>
//                            </tr>
//                         </table>
//                      </td>
//                   </tr>
//                </table>
//             </table>
//          </body>
//       </html>`,
//     }
//     const transporter = nodemailer.createTransport({
//       port: usePort, // true for 465, false for other ports
//       host: useSmtp,
//       auth: {
//         user: "noreply@dwellfox.com",
//         pass: "hZ]i/=pV74",
//       },
//       secure: true,
//     });
//     transporter.sendMail(mailData, function (err, info) {
//       if (err) {
//         console.log(err);
//         res.send(`{"message":"Sending Failed!"}`);
//       } else {
//         res.send(`{"message":"Successfully Sent!"}`);
//       }
//     });
//   });
// })
// });


export default Router;