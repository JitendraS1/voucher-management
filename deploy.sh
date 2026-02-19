#!/bin/bash
# Deployment script for Voucher Management System

echo "Voucher Management System Deployment Script"
echo "============================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if out directory exists
if [ ! -d "out" ]; then
    echo "Building the application..."
    npm run build
else
    echo "Using existing build in 'out' directory"
fi

echo ""
echo "Deployment Steps:"
echo "1. Upload contents of 'out' directory to your web server's document root (e.g., public_html)"
echo "2. Upload 'mysql-backend' directory to a separate location on your server"
echo "3. Configure your MySQL database and update mysql-backend/.env with credentials"
echo "4. Run 'npm install' in the mysql-backend directory"
echo "5. Start the backend server with 'node index.js' or 'pm2 start index.js'"
echo "6. Update the API URL in your frontend if needed"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"