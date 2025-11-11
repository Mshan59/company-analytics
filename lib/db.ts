// import mysql from 'mysql2/promise';

// const connection = mysql.createPool({
//   host: 'localhost',
//   user: 'root', // your MySQL username
//   password: '', // your MySQL password
//   database: 'feature_flow', // your database name
// });

// export default connection;


// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root', 
//   password: '', 
//   database: 'feature_flow', 
//   connectionLimit: 10,
// });

// export default pool;
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
