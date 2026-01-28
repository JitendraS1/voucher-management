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
  const { method } = req;

  await connectDB();

  switch (method) {
    case 'GET':
      try {
        const vouchers = await Voucher.find({});
        res.status(200).json(vouchers);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vouchers' });
      }
      break;
    case 'POST':
      try {
        const voucher = new Voucher(req.body);
        const savedVoucher = await voucher.save();
        res.status(201).json(savedVoucher);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create voucher' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}