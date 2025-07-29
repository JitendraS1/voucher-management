// index.js
const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = process.env.PORT || 5000; // Ensure this matches your frontend's API_BASE_URL

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all routes (adjust for production if needed)

// --- Supabase Configuration ---
// IMPORTANT: Replace with your actual Supabase Project URL and Anon Public Key
// It's highly recommended to use environment variables for these in production.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jclxiuvcfihdcbckeyzm.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjbHhpdXZjZmloZGNiY2tleXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzkzOTEsImV4cCI6MjA2OTA1NTM5MX0.wH6vUV2AnzZtsK7_gdqXDiX6B2ed_44FLOPNg9aErA4';

// Axios instance for Supabase requests
const supabaseApi = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`, // Supabase REST API base URL
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation' // Ensures response includes the inserted/updated data
  }
});

// --- API Endpoints for Vouchers ---

// GET all vouchers
app.get('/vouchers', async (req, res) => {
  try {
    const { data, error } = await supabaseApi.get('/vouchers');
    if (error) {
      console.error('Error fetching vouchers from Supabase:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error('Network or unexpected error fetching vouchers:', err.message);
    // Log Supabase specific error details if available
    if (err.response) {
      console.error('Supabase Response Data:', err.response.data);
      console.error('Supabase Response Status:', err.response.status);
      console.error('Supabase Response Headers:', err.response.headers);
      return res.status(err.response.status).json({ error: err.response.data.message || 'Supabase error', details: err.response.data });
    }
    res.status(500).json({ error: 'Failed to fetch vouchers', details: err.message });
  }
});

// GET a single voucher by ID
app.get('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabaseApi.get(`/vouchers?id=eq.${id}`);
    if (error) {
      console.error(`Error fetching voucher ${id} from Supabase:`, error);
      return res.status(500).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.status(200).json(data[0]);
  } catch (err) {
    console.error(`Network or unexpected error fetching voucher ${id}:`, err.message);
    if (err.response) {
      console.error('Supabase Response Data:', err.response.data);
      console.error('Supabase Response Status:', err.response.status);
      console.error('Supabase Response Headers:', err.response.headers);
      return res.status(err.response.status).json({ error: err.response.data.message || 'Supabase error', details: err.response.data });
    }
    res.status(500).json({ error: 'Failed to fetch voucher', details: err.message });
  }
});

// POST a new voucher
app.post('/vouchers', async (req, res) => {
  const newVoucher = req.body;
  try {
    const { data, error } = await supabaseApi.post('/vouchers', newVoucher);
    if (error) {
      console.error('Error inserting new voucher to Supabase:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data[0]); // Supabase returns an array for POST
  } catch (err) {
    console.error('Network or unexpected error creating voucher:', err.message);
    if (err.response) {
      console.error('Supabase Response Data:', err.response.data);
      console.error('Supabase Response Status:', err.response.status);
      console.error('Supabase Response Headers:', err.response.headers);
      // Return the actual Supabase error status and message
      return res.status(err.response.status).json({ error: err.response.data.message || 'Supabase error', details: err.response.data });
    }
    res.status(500).json({ error: 'Failed to create voucher', details: err.message });
  }
});

// PUT (update) an existing voucher by ID
app.put('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  const updatedVoucher = req.body;
  try {
    const { data, error } = await supabaseApi.patch(`/vouchers?id=eq.${id}`, updatedVoucher);
    if (error) {
      console.error(`Error updating voucher ${id} in Supabase:`, error);
      return res.status(500).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: 'Voucher not found for update' });
    }
    res.status(200).json(data[0]); // Supabase returns an array for PATCH
  } catch (err) {
    console.error(`Network or unexpected error updating voucher ${id}:`, err.message);
    if (err.response) {
      console.error('Supabase Response Data:', err.response.data);
      console.error('Supabase Response Status:', err.response.status);
      console.error('Supabase Response Headers:', err.response.headers);
      return res.status(err.response.status).json({ error: err.response.data.message || 'Supabase error', details: err.response.data });
    }
    res.status(500).json({ error: 'Failed to update voucher', details: err.message });
  }
});

// DELETE a voucher by ID
app.delete('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseApi.delete(`/vouchers?id=eq.${id}`);
    if (error) {
      console.error(`Error deleting voucher ${id} from Supabase:`, error);
      return res.status(500).json({ error: error.message });
    }
    // Supabase delete returns an empty array if successful, or error if not found/issue
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (err) {
    console.error(`Network or unexpected error deleting voucher ${id}:`, err.message);
    if (err.response) {
      console.error('Supabase Response Data:', err.response.data);
      console.error('Supabase Response Status:', err.response.status);
      console.error('Supabase Response Headers:', err.response.headers);
      return res.status(err.response.status).json({ error: err.response.data.message || 'Supabase error', details: err.response.data });
    }
    res.status(500).json({ error: 'Failed to delete voucher', details: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Node.js REST API listening on port ${PORT}`);
  console.log(`Supabase URL: ${SUPABASE_URL}`);
});
