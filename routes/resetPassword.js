import express from "express";
import jwt from "jsonwebtoken";
const Router = express.Router();
import mysql from 'mysql'
import md5 from 'md5'
import nodemailer from "nodemailer";




const pool = mysql.createPool({
    host: '89.117.27.154', // Replace with your host name
    // port: '3306',
    user: 'u219507986_shipment',      // Replace with your database username
    password: '123456Ak',      // Replace with your database password    ///df-opcity-home
    database: 'u219507986_shipment'
});

Router.post('/forgetpass', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var user_name = req.body.username;
      conn.query("SELECT * FROM identities WHERE username=?", user_name, function (err, data) {
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

//       var username = req.body.username;

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
//         to: username,
//         subject: "Otp for forget password is: ",
//         html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + a + "</h1>"
//       };

//       conn.query(`UPDATE identities SET otp=${a} WHERE username ="${username}"`, function (err) {
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
  const { username } = req.body;

  // Check if the username is provided
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  // Check if the user exists in the database
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server Error' });
    }

    conn.query('SELECT * FROM identities WHERE username = ?', [username], (err, results) => {
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
        to: username,
        subject: "OTP for forget password is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + a + "</h1>"
      };

      conn.query(`UPDATE identities SET otp=${a} WHERE username ="${username}"`, function (err) {
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
              return res.status(500).json({ error: 'Sending Failed!' });
            } else {
              return res.status(200).json({ message: 'Successfully Sent!' });
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
      var username = req.body.username;
      var otp = req.body.otp;

      conn.query(`SELECT * FROM identities WHERE username="${username}" AND otp=${otp}`, function (err, otp) {
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
    const {otp } = req.body; // Assuming the phone number and OTP are sent in the request body
  
    // Check if the OTP is valid for the given phone number
    const query = 'SELECT * FROM identities WHERE  otp = ?';
  
    pool.query(query, [otp], (error, results) => {
      if (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Error verifying OTP' });
      } else {
        if (results.length > 0) {
          // Valid OTP
          // You can add additional logic here, like checking OTP expiration time
          res.status(200).json({  flag: 1 });
        } else {
          // Invalid OTP
          res.status(401).json({  flag: 0});
        }
      }
    });
  });

//////

Router.post('/reset-password', (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }
  
    // Save the new password in the database for the given user
    const query = 'UPDATE identities SET password = ? WHERE username = ?';
  
    pool.query(query, [newPassword, username], (error, results) => {
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
      var username = req.body.username;
      var password = req.body.password;

      conn.query(`UPDATE identities SET password="${password}" WHERE username="${username}"`, function (err,password) {
        if (err) {
          res.send({ result: err });
          if (!password) {
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

//////////////////////////////////////

Router.post('/change-password', async (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    try {
      // Check if the email exists in the database
      const [users] = await pool.query('SELECT * FROM identities WHERE username = ?', [username]);
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Update the user's password in the database
      await pool.query('UPDATE identities SET password = ? WHERE username = ?', [newPassword, username]);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Error changing password' });
    }
  });

  ///////
  Router.post('/reset-password1', (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match !' });
    }
    // Check if the username exists in the database
    const selectQuery = 'SELECT * FROM identities WHERE username = ?';
    pool.query(selectQuery, [username], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error executing select query:', selectError);
        return res.status(500).json({ error: 'Error resetting password' });
      }
      // If the username does not exist, return an error
      if (selectResults.length === 0) {
        return res.status(404).json({ error: 'User not found !' });
      }
      // Update the password in the database for the given user
      const updateQuery = 'UPDATE identities SET password = ? WHERE username = ?';
      pool.query(updateQuery, [newPassword, username], (updateError, updateResults) => {
        if (updateError) {
          console.error('Error resetting password:', updateError);
          return res.status(500).json({ error: 'Error resetting password' });
        }
        res.status(200).json({ message: 'Password reset successfully' });
      });
    });
  });


export default Router;




