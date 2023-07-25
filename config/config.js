
// export default poolconnection;
import mysql from 'mysql';

const poolconnection = mysql.createPool({
    host: '89.117.27.154', // Replace with your host name
    // port: '3306',
    user: 'u219507986_shipingnew',      // Replace with your database email
    password: 'pFuSG;@F+8',      // Replace with your database password    ///df-opcity-home
    database: 'u219507986_shipingnew'
});

export default poolconnection;