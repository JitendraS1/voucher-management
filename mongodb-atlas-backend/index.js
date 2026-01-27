// MongoDB Atlas Backend API
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jitendra_db:Bhadoriyaji%40182@cluster0.cz32o2h.mongodb.net/voucher-management?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => {
  console.error('MongoDB Atlas connection error:', err);
  process.exit(1);
});

// Voucher Schema
const voucherSchema = new mongoose.Schema({
  voucherNo: String,
  date: String,
  name: String,
  paidTo: String,
  debit: String,
  onAccountOf: String,
  particulars: [{
    description: String,
    rs: String,
    ps: String
  }],
  totalAmount: Number,
  amountInWords: String,
  preparedBy: String,
  authorizedByL1: String,
  authorizedByL2: String
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

const Voucher = mongoose.model('Voucher', voucherSchema);

// Routes for vouchers
app.get('/vouchers', async (req, res) => {
  try {
    const vouchers = await Voucher.find({});
    res.status(200).json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch vouchers', details: error.message });
  }
});

app.get('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const voucher = await Voucher.findById(id);
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    
    res.status(200).json(voucher);
  } catch (error) {
    console.error(`Error fetching voucher ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch voucher', details: error.message });
  }
});

app.post('/vouchers', async (req, res) => {
  const newVoucher = req.body;
  try {
    const voucher = new Voucher(newVoucher);
    const savedVoucher = await voucher.save();
    res.status(201).json(savedVoucher);
  } catch (error) {
    console.error('Error adding voucher:', error);
    res.status(500).json({ error: 'Failed to add voucher', details: error.message });
  }
});

app.put('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  const updatedVoucher = req.body;
  try {
    const voucher = await Voucher.findByIdAndUpdate(
      id, 
      updatedVoucher, 
      { new: true } // return updated document
    );
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    
    res.status(200).json(voucher);
  } catch (error) {
    console.error(`Error updating voucher ${id}:`, error);
    res.status(500).json({ error: 'Failed to update voucher', details: error.message });
  }
});

app.delete('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const voucher = await Voucher.findByIdAndDelete(id);
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error(`Error deleting voucher ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete voucher', details: error.message });
  }
});

// Additional route to match the frontend API expectations
app.get('/voucherData', async (req, res) => {
  try {
    const vouchers = await Voucher.find({});
    res.status(200).json(vouchers);
  } catch (error) {
    console.error('Error fetching voucher data:', error);
    res.status(500).json({ error: 'Failed to fetch voucher data', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MongoDB Atlas backend is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`MongoDB Atlas API server listening on port ${PORT}`);
});

module.exports = app;