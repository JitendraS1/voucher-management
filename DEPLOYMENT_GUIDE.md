# Deployment Guide: Voucher Management System

## Overview
This guide explains how to deploy your voucher management system on a hosting provider with MySQL support (like Hostinger).

## What You Need
1. A hosting account with MySQL support and Node.js capability
2. Access to phpMyAdmin or MySQL command line
3. Your built application files (in the `out` directory)

## Step 1: Prepare Your Files

The application consists of two parts:
1. **Frontend**: Static files in the `out` directory (HTML, CSS, JS)
2. **Backend**: Node.js application in the `mysql-backend` directory

## Step 2: Deploy the Backend (Node.js Server)

1. Upload the `mysql-backend` folder to your hosting provider
2. Set up your environment variables in a `.env` file:
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   DB_PORT=3306
   PORT=5003
   ```

3. Install dependencies via SSH/console:
   ```bash
   cd mysql-backend
   npm install
   ```

4. Start the server:
   ```bash
   node index.js
   ```
   
   Or use PM2 for persistent running:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "voucher-backend"
   ```

5. Create the database tables by running the SQL commands in the `setup-database.sql` file in phpMyAdmin.

## Step 3: Deploy the Frontend (Static Files)

1. Upload all contents of the `out` directory to your web server's document root (typically `public_html` or `www`)

2. If your hosting provider supports environment variables for static sites, set:
   - `NEXT_PUBLIC_API_BASE_URL` to your backend URL (e.g., `https://yourdomain.com:5003` or `https://api.yourdomain.com`)

3. If environment variables aren't supported, you'll need to update the API URL directly in the built files:
   - Look for the API URL in the JS files within the `out/_next/static/` directory
   - Replace `http://localhost:5003` with your actual backend URL

## Step 4: Configure Domain

Point your domain/subdomain to access both:
- Frontend: Your main domain (e.g., `https://yourdomain.com`)
- Backend: Same domain with port or subdomain (e.g., `https://yourdomain.com:5003` or `https://api.yourdomain.com`)

## Step 5: Test Your Deployment

1. Visit your frontend domain
2. Test creating, editing, and viewing vouchers
3. Verify that data is being stored in your MySQL database

## Important Notes

- The backend runs on port 5003 by default. Adjust if needed based on your hosting provider's restrictions
- Some hosting providers may require a reverse proxy configuration to serve the backend on standard ports (80/443)
- Make sure CORS is configured properly if frontend and backend domains differ
- For production, ensure SSL certificates are properly configured for both frontend and backend

## Troubleshooting

- If you get "connection refused" errors, verify your backend server is running
- If database connection fails, double-check your MySQL credentials
- If the frontend can't reach the backend, verify the API URL is correct
- Check server logs for detailed error messages

## Security Considerations

- Use strong passwords for your MySQL database
- Consider using SSL/TLS for all connections
- Regularly update dependencies
- Backup your database regularly