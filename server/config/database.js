import mysql from "mysql";
  
export const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err.code, err.message);
      return;
    }
    console.log("Connected to MySQL as id " + connection.threadId);
  });

  return connection;  
};
   
////
