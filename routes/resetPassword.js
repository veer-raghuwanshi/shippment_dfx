import express from "express";
import jwt from "jsonwebtoken";
const Router = express.Router();
import mysql from 'mysql'
import md5 from 'md5'
import nodemailer from "nodemailer";




// MySQL database connection
const pool = mysql.createPool({
  host: '89.117.27.154', // Replace with your host name
  // port: '3306',
  user: 'u219507986_shipingnew',     // Replace with your database email
  password: 'pFuSG;@F+8',     // Replace with your database password   ///df-opcity-home
  database: 'u219507986_shipingnew'
});

Router.post('/forgetpass', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var email = req.body.email;
      conn.query("SELECT * FROM driver WHERE email=?", email, function (err, data) {
        if (err) {
          console.log(err);
          res.send({ result: "err", Error: err });
        } else {
          res.send({ result: data });
        }

      });
      pool.releaseConnection(conn);
    }
  })

});

//*****************OTPsend*********************/

// Router.post('/otpsend', async (req, res) => {

//   pool.getConnection(async (err, conn) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send('Server Error');
//     }
//     else {
//       var otp = Math.random() * (1000000 - 99999) + 99999;

//       var random = parseInt(otp);
//       var a = random.toString();
//       console.log(a);

//       var email = req.body.email;

//       var clientPort = 465;
//       var clientSmtp = 'smtp.hostinger.com';
//     //   var clientReply = 'Dwellfox'
  
//       var useSmtp = clientSmtp ? clientSmtp : 'smtp.hostinger.com';
//       var usePort = clientPort ? clientPort : 465;

//       var mailData = {
//         from: {
//             name:'New Inquiry From Dwellfox.com',
//             address:'donotreply@dwellfox.com'
//       },
//         to: email,
//         subject: "Otp for forget password is: ",
//         html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + a + "</h1>"
//       };

//       conn.query(`UPDATE identities SET otp=${a} WHERE email ="${email}"`, function (err) {
//         if (err) {
//           res.send({ result: err });
//         } else {
//           res.send({ result: "update successfull" });
//         }

//       });
//       const transporter = nodemailer.createTransport({
//         port: usePort, // true for 465, false for other ports
//         host: useSmtp,
//         auth: {
//           user: "donotreply@dwellfox.com",
//           pass: "*rZ2ifIA5Lv",
//         },
//         secure: true,
//       });
//       transporter.sendMail(mailData, function (err, info) {
//         if (err) {
//           console.log(err);
//           res.send(`{"message":"Sending Failed!"}`);
//         } else {
//           res.send(`{"message":"Successfully Sent!"}`);
//         }
//       });
//       pool.releaseConnection(conn);
//     }
//   })

// });

Router.post('/otpsend', async (req, res) => {
  const { email } = req.body;

  // Check if the email is provided
  if (!email) {
    return res.status(400).json({ error: 'email is required.' });
  }

  // Check if the user exists in the database
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server Error' });
    }

    conn.query('SELECT * FROM driver WHERE email=?', [email], (err, results) => {
      if (err) {
        console.error('Failed to fetch user from the database', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        // User is not registered
        return res.status(404).json({ error: 'User not registered.' });
      }

      // User is registered, generate and send OTP
      var otp = Math.random() * (1000000 - 99999) + 99999;
      var random = parseInt(otp);
      var a = random.toString();

      var clientPort = 465;
      var clientSmtp = 'smtp.hostinger.com';
      // var clientReply = 'Dwellfox'
  
      var useSmtp = clientSmtp ? clientSmtp : 'smtp.hostinger.com';
      var usePort = clientPort ? clientPort : 465;

      var mailData = {
        from: {
          name: 'New Inquiry From Dwellfox.com',
          address: 'donotreply@dwellfox.com'
        },
        to: email,
        subject: "OTP for forget password is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + a + "</h1>"
      };

      conn.query(`UPDATE driver SET otp=${a} WHERE email ="${email}"`, function (err) {
        if (err) {
          res.send({ result: err });
        } else {
          // OTP update successful, send email
          const transporter = nodemailer.createTransport({
            port: usePort, // true for 465, false for other ports
            host: useSmtp,
            auth: {
              user: "donotreply@dwellfox.com",
              pass: "*rZ2ifIA5Lv",
            },
            secure: true,
          });
          transporter.sendMail(mailData, function (err, info) {
            if (err) {
              console.log(err);
              return res.status(500).json({status:"500", error: 'Sending Failed!' });
            } else {
              return res.status(200).json({ status:"200", message: 'Successfully Sent!' });
            }
          });
        }
      });

      pool.releaseConnection(conn);
    })
  })
});

//****************Verify*********************//

Router.post('/verify', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var email = req.body.email;
      var otp = req.body.otp;

      conn.query(`SELECT * FROM driver WHERE email="${email}" AND otp=${otp}`, function (err, otp) {
        if (err) {
          res.send({ result: err });
        } else {
          if (otp.length > 0)
            res.send({ message: 'OTP verified successfully' });
          else
            res.send({ error: 'Invalid OTP' });
        }
      });
      pool.releaseConnection(conn);
    }
  })
});

//////


Router.post('/verify-otp', (req, res) => {
  const { otp, email } = req.body; // Assuming the phone number and OTP are sent in the request body

  // Check if the OTP is valid for the given email
  const query = 'SELECT * FROM driver WHERE otp = ? AND email = ?';

  pool.query(query, [otp, email], (error, results) => {
    if (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ status: "500", error: 'Error verifying OTP' });
    } else {
      if (results.length > 0) {
        // Valid OTP
        // You can add additional logic here, like checking OTP expiration time
        res.status(200).json({ status: "200", message: "send success" });
      } else {
        // Invalid OTP
        res.status(401).json({ status: "401", message: "otp invalid" });
      }
    }
  });
});

//////

Router.post('/reset-password', (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }
  
    // Save the new password in the database for the given user
    const query = 'UPDATE driver SET password = ? WHERE email = ?';
  
    pool.query(query, [newPassword, email], (error, results) => {
      if (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Error resetting password' });
      } else {
        res.status(200).json({ message: 'Password reset successfully' });
      }
    });
  });

//****************Resetpassword*********************//

Router.post('/resetpassword', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var email = req.body.email;
      var password = req.body.password;

      conn.query(`UPDATE driver SET password="${password}" WHERE email="${email}"`, function (err,password) {
        if (err) {
          res.send({ result: err });
          if (!password) {
            console.log('Incorrect email error.');
            return done(null, false, { message: 'Incorrect email.' });
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

//////////////////////////////////////

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

  ///////
  Router.post('/reset-password1', (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({status:"400" ,error: 'New password and confirm password do not match !' });
    }
    // Check if the email exists in the database
    const selectQuery = 'SELECT * FROM driver WHERE email = ?';
    pool.query(selectQuery, [email], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error executing select query:', selectError);
        return res.status(500).json({ status:"500", error: 'Error resetting password' });
      }
      // If the email does not exist, return an error
      if (selectResults.length === 0) {
        return res.status(404).json({status:"404", error: 'User not found !' });
      }
      // Update the password in the database for the given user
      const updateQuery = 'UPDATE driver SET password = ? WHERE email = ?';
      pool.query(updateQuery, [newPassword, email], (updateError, updateResults) => {
        if (updateError) {
          console.error('Error resetting password:', updateError);
          return res.status(500).json({ status:"500", error: 'Error resetting password' });
        }
        res.status(200).json({ status:"200", message: 'Password reset successfully' });
      });
    });
  });


export default Router;




