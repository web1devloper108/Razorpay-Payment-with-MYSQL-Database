import { connectDB } from "../config/database.js";
export const createPaymentTable = () => {
  const connection = connectDB();

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      razorpay_order_id VARCHAR(255) NOT NULL,
      razorpay_payment_id VARCHAR(255) NOT NULL,
      razorpay_signature VARCHAR(555) NOT NULL
    )
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating payments table: ", err);
    } else {
      console.log("Payments table created or already exists");
    }
  });

  connection.end();
};

