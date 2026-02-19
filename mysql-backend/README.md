# MySQL Voucher Management Backend

This is the MySQL backend for the voucher management system, designed for hosting on Hostinger with phpMyAdmin.

## Setup Instructions

### Local Development

1. **Install dependencies:**
   ```bash
   cd mysql-backend
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
3. **Configure your MySQL database:**
   - Update the `.env` file with your MySQL credentials
   - Make sure MySQL is running on your local machine

4. **Create database in phpMyAdmin:**
   - Open phpMyAdmin
   - Create a new database named `voucher_management`
   - The tables will be created automatically when you start the server

5. **Test database connection:**
   ```bash
   node test-database.js
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```

### Hostinger Deployment

1. **Database Setup:**
   - Login to your Hostinger control panel
   - Go to MySQL Database section
   - Create a new database
   - Note down the database host, name, username, and password

2. **File Upload:**
   - Upload the `mysql-backend` folder to your Hostinger account
   - You can use File Manager or FTP

3. **Environment Configuration:**
   - Create a `.env` file in the `mysql-backend` directory
   - Update with your Hostinger MySQL credentials:
   ```
   DB_HOST=your-mysql-host.hostringer.com
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=your-database-name
   PORT=5003
   ```

4. **Install Dependencies:**
   - Use SSH access to your Hostinger account
   - Navigate to the mysql-backend directory
   - Run: `npm install`

5. **Start the Application:**
   - You can use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start index.js --name voucher-backend
   ```

### Database Schema

The system will automatically create the following table:

**vouchers table:**
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- voucherNo (VARCHAR)
- date (DATE)
- name (VARCHAR)
- paidTo (VARCHAR)
- debit (VARCHAR)
- onAccountOf (VARCHAR)
- teamLeaderName (VARCHAR)
- vehicleNumber (VARCHAR)
- particulars (JSON)
- totalAmount (DECIMAL)
- amountInWords (TEXT)
- preparedBy (VARCHAR)
- authorizedByL1 (VARCHAR)
- authorizedByL2 (VARCHAR)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### API Endpoints

- `GET /vouchers` - Get all vouchers
- `GET /vouchers/:id` - Get specific voucher
- `POST /vouchers` - Create new voucher
- `PUT /vouchers/:id` - Update voucher
- `DELETE /vouchers/:id` - Delete voucher
- `GET /voucherData` - Get all vouchers (alternative endpoint)
- `GET /generate-pdf` - Generate PDF of all vouchers
- `GET /generate-excel` - Generate Excel export of all vouchers
- `GET /health` - Health check endpoint

### Frontend Configuration

Update your frontend to use the MySQL backend by changing the API URL:
```javascript
const API_ROOT_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5003";
```

For Hostinger deployment, update to your actual backend URL.

### Troubleshooting

1. **Database Connection Issues:**
   - Verify your database credentials in `.env`
   - Check if the database exists
   - Ensure MySQL service is running

2. **Table Creation Issues:**
   - Check MySQL user permissions
   - Verify the database user has CREATE privileges

3. **Hostinger Specific Issues:**
   - Make sure you're using the correct MySQL host URL
   - Check if your hosting plan supports Node.js applications
   - Verify file permissions on uploaded files