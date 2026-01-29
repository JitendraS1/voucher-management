import mongoose from 'mongoose';

// Initialize MongoDB connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Voucher Schema
const voucherSchema = new mongoose.Schema({
  voucherNo: String,
  date: String,
  name: String,
  paidTo: String,
  debit: String,
  onAccountOf: String,
  teamLeaderName: String,
  vehicleNumber: String,
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
  timestamps: true
});

const Voucher = mongoose.models.Voucher || mongoose.model('Voucher', voucherSchema);

export default async function handler(req, res) {
  await connectDB();

  try {
    const vouchers = await Voucher.find({});
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voucher data' });
  }
}