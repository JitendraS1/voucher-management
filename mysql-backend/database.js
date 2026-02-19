// MySQL Database Configuration
require('dotenv').config();
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'voucher_management',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('MySQL Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create vouchers table
    const createVouchersTable = `
      CREATE TABLE IF NOT EXISTS vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        voucherNo VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        name VARCHAR(100) NOT NULL,
        paidTo VARCHAR(100) NOT NULL,
        debit VARCHAR(100) NOT NULL,
        onAccountOf VARCHAR(200) NOT NULL,
        teamLeaderName VARCHAR(100),
        vehicleNumber VARCHAR(50),
        particulars JSON,
        totalAmount DECIMAL(10, 2) NOT NULL,
        amountInWords TEXT NOT NULL,
        preparedBy VARCHAR(100) NOT NULL,
        authorizedByL1 VARCHAR(100) NOT NULL,
        authorizedByL2 VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createVouchersTable);
    console.log('Vouchers table created/verified');
    
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};