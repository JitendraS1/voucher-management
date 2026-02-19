// Test script to verify MySQL connection
const { testConnection, initializeDatabase } = require('./database');

async function testDatabase() {
  console.log('Testing MySQL database connection...');
  
  try {
    await testConnection();
    console.log('✓ Database connection successful');
    
    await initializeDatabase();
    console.log('✓ Database tables verified/created');
    
    console.log('\nDatabase setup complete! You can now start the server with: npm start');
  } catch (error) {
    console.error('✗ Database setup failed:', error.message);
    console.log('\nPlease check your MySQL configuration and try again.');
  }
  
  process.exit(0);
}

testDatabase();