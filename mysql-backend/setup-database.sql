-- SQL script to create the voucher_management database and tables
-- Run this in phpMyAdmin or MySQL command line

-- Create database
CREATE DATABASE IF NOT EXISTS voucher_management;
USE voucher_management;

-- Create vouchers table
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
);

-- Insert sample data (optional)
INSERT INTO vouchers (voucherNo, date, name, paidTo, debit, onAccountOf, teamLeaderName, vehicleNumber, particulars, totalAmount, amountInWords, preparedBy, authorizedByL1, authorizedByL2) VALUES
('V001', '2024-01-15', 'Naresh Sharma ji', 'Supplier A', 'Office Expenses', 'Stationery Purchase', 'Raj Kumar', NULL, '[{"description": "Pens and Pencils", "rs": "500", "ps": "00"}]', 500.00, 'Five Hundred Rupees Only', 'John Doe', 'Manager', 'Director'),
('V002', '2024-01-16', 'Sohanlal Patidar ji', 'Driver B', 'Transport', 'Fuel Exp. (Vehicle)', NULL, 'DL01AB1234', '[{"description": "Diesel Fuel", "rs": "2000", "ps": "50"}]', 2000.50, 'Two Thousand Rupees and Fifty Paise Only', 'Jane Smith', 'Supervisor', 'Manager');

-- Verify the data
SELECT * FROM vouchers;