import express from "express";
import jwt from "jsonwebtoken";
const Router = express.Router();
import mysql from 'mysql'
import md5 from 'md5'
import nodemailer from "nodemailer";

const app = express();

// MySQL database connection
// MySQL database connection
const pool = mysql.createPool({
  host: '89.117.27.154', // Replace with your host name
  // port: '3306',
  user: 'u219507986_shipingnew',     // Replace with your database email
  password: 'pFuSG;@F+8',     // Replace with your database password   ///df-opcity-home
  database: 'u219507986_shipingnew'
});


 const generateAccessToken =(email) => {
    return jwt.sign(email, process.env.TOKEN_SECRET);
  };



// Endpoint to handle login
Router.post('/login', (req, res) => {
  const { email, password, deviceId, deviceName } = req.body;

  // Check if the request contains necessary fields
  if (!email || !password || !deviceId || !deviceName) {
    return res.status(400).json({ status:"400", message: 'Missing fields in the request' });
  }

  // Check if the device ID and device name match the database record
  const selectQuery = 'SELECT * FROM driver WHERE email = ? AND password = ? AND device_id = ? AND device_name = ?';
  pool.query(selectQuery, [email, password, deviceId, deviceName], (err, results,rows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ status:"500", message: 'Error processing the request' });
    }

    if (results.length === 0) {
      return res.status(401).json({ status:"401", message: 'Invalid credentials or device information' });
    }

    const user_id1 = rows[0].id;
    //generate token
    const token = generateAccessToken({ email, user_id1 });

    

    // Successfully logged in
    return res.json({ login:true,token:token,user_id:user_id1,message: 'Login successful' });
  });
});


/// otp send




Router.post('/otpsend', async (req, res) => {
  const { email } = req.body;

if (!email) {
  return res.status(400).json({ error: 'email is required.' });
}


pool.getConnection(async (err, conn) => {
  if (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
  else {
    var otp = Math.random() * (1000000 - 99999) + 99999;

    var random = parseInt(otp);
    var a = random.toString();
    console.log(a);

    var email = req.body.email;

    var clientPort = 465;
    var clientSmtp = 'smtp.hostinger.com';
  //   var clientReply = 'Dwellfox'

    var useSmtp = clientSmtp ? clientSmtp : 'smtp.hostinger.com';
    var usePort = clientPort ? clientPort : 465;

    var mailData = {
      from: {
          name:'New Inquiry From Dwellfox.com',
          address:'donotreply@bumbbl.com'
    },
      to: email,
      subject: "Otp for forget password is: ",
      html: `<!DOCTYPE html>
      <html>
      
      <head>
         <meta charset="utf-8" />
         <title>A simple, clean, and responsive HTML invoice template</title>
         <style>
            h1, h2, h3, h4, h5, h6, p {
               font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            }
      
            .invoice-box {
               max-width: 700px;
               margin: auto;
               border-radius: 13px;
               border: 1px solid #1B2644;
               box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
               font-size: 16px;
               line-height: 24px;
      
               color: #555;
            }
      
            .tabledata tr th {
               /* border: 1px solid #000; */
               font-size: 18px;
               padding: 10px;
               color: #000;
               font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            }
      
            .tabledata tr td {
               border: 1px solid #BCCCFF;
               padding: 10px;
               font-size: 16px;
               color: #000;
               font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            }
      
            .invoice-box table {
               width: 100%;
               line-height: inherit;
               text-align: left;
            }
      
            .invoice-box table td {
               /* padding: 5px; */
               vertical-align: top;
            }
      
            /* .invoice-box table tr td:nth-child(2) {
                  text-align: right;
               } */
            .invoice-box table tr.top table td {
               padding-bottom: 20px;
            }
      
            .invoice-box table tr.top table td.title {
               font-size: 45px;
               line-height: 45px;
               color: #333;
      
            }
      
            /* .invoice-box table tr.information table td {
                  padding-bottom: 40px;
               } */
            .invoice-box table tr.heading td {
               background: #eee;
               border-bottom: 1px solid #ddd;
               font-weight: bold;
            }
      
            .invoice-box table tr.details td {
               padding-bottom: 20px;
            }
            .invoice-box table tr.item td {
               border-bottom: 1px solid #eee;
            }
            .invoice-box table tr.item.last td {
               border-bottom: none;
            }
            .invoice-box table tr.total td:nth-child(2) {
               border-top: 2px solid #eee;
               font-weight: bold;
            }
            @media only screen and (max-width: 600px) {
               .invoice-box table tr.top table td {
                  width: 100%;
                  display: block;
                  text-align: center;
               }
               .invoice-box table tr.information table td {
                  width: 100%;
                  display: block;
                  text-align: center;
               }
            }
            /** RTL **/
            .invoice-box.rtl {
               direction: rtl;
               font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            }
            .invoice-box.rtl table {
               text-align: right;
            }
            .invoice-box.rtl table tr td:nth-child(2) {
               text-align: left;
            }
            .tb_header {
               background-color: #000;
               color: #fff;
               border: 1px solid #000;
               font-weight: 500;
            }
            .all_details {
               text-align: right;
               /* border: 1px solid #000; */
               border-collapse: collapse;
            }
            .boldcolor {
               font-weight: bold;
               color: #000;
               text-align: right;
      
            }
         </style>
      </head>
      <body>
         <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
               <tr class="top">
                  <td colspan="2">
                     <table style="background-color:#1B2644;border-radius: 13px 13px 0 0;">
                        <tr>
                            <td style="text-align: center; padding-top: 20px;">
                              <!-- <img src="logo.png" alt=""> -->
                              <img src="logo.png" alt="">
                           </td>
                        </tr>
                     </table>
                  </td>
               </tr>
            </table>
            <table cellpadding="0" cellspacing="0" style="padding: 0 50px;">
               <tr class="top">
                  <td colspan="2">
                     <table style=" margin-bottom: 0; margin-top: 10px;">
                        <tr>
      
      
                           <td style="vertical-align: middle; color: #000;">
                              <h4 style="margin-bottom: 10px;">${email}</h4>
                              <h3 style="margin-bottom: 10px;">Your Verification Code is</h3>
                              <h2 style="margin-bottom: 10px;">${a}</h2>
                          </td>
                           <td style="text-align: end; padding-top: 20px;">
                              <img src="Login-amico.png" />
                                  
                           </td>
                        </tr>
                     </table>
                  </td>
               </tr>
            </table>
            <table style="padding: 0px 50px; ">
               <tr>
                  <td style="color:#000">
                     <p style=" margin-top: 0;">Please enter this code in the designated field on our website/app to complete the verification process. This step is crucial in protecting your account from unauthorized access and securing your personal information.
                      If you did not request this verification code, please ignore this email. </p>
      
                     <h3 style="margin-bottom: 0; font-weight: 500;">Best regards,</h3>
                     <h3 style="margin-top: 5px;">P & G Truckers Team</h3>
                     
                  </td>
               </tr>
            </table>
         </body>
      </html>`
    };

    conn.query(`UPDATE driver SET otp=${a} WHERE email ="${email}"`, function (err) {
      if (err) {
        res.send({ result: err });
      } else {
        res.send({ result: "update successfull" });
      }

    });
    const transporter = nodemailer.createTransport({
      port: usePort, // true for 465, false for other ports
      host: useSmtp,
      auth: {
        user: "donotreply@bumbbl.com",
        pass: "Shipment@4321",
      },
      secure: true,
    });
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log(err);
        res.send(`{"message":"Sending Failed!"}`);
      } else {
        res.send(`{"message":"Successfully Sent!"}`);
      }
    });
    pool.releaseConnection(conn);
  }
})

});



Router.post('/change-password1', async (req, res) => {
   const { email, newPassword, confirmPassword } = req.body;
   if (newPassword !== confirmPassword) {
     return res.status(400).json({ status:"400" , error: 'Passwords do not match' });
   }
   try {
     // Check if the email exists in the database
     const [users] = await pool.query('SELECT * FROM driver WHERE email = ?', [email]);
     if (users.length === 0) {
       return res.status(404).json({status:"404", error: 'User not found' });
     }
     // Update the user's password in the database
     await pool.query('UPDATE driver SET password = ? WHERE email = ?', [newPassword, email]);
     res.status(200).json({status:"200", message: 'Password updated successfully' });
   } catch (error) {
     console.error('Error changing password:', error);
     res.status(500).json({status:"500", error: 'Error changing password' });
   }
 });
export default Router;