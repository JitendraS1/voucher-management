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
  const { method, query } = req;

  await connectDB();

  switch (method) {
    case 'GET':
      try {
        const { id } = query;
        if (id) {
          const voucher = await Voucher.findById(id);
          if (!voucher) {
            return res.status(404).json({ error: 'Voucher not found' });
          }
          res.status(200).json(voucher);
        } else {
          const vouchers = await Voucher.find({});
          res.status(200).json(vouchers);
        }
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
    case 'PUT':
      try {
        const { id } = query;
        const updatedVoucher = await Voucher.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });
        if (!updatedVoucher) {
          return res.status(404).json({ error: 'Voucher not found' });
        }
        res.status(200).json(updatedVoucher);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update voucher' });
      }
      break;
    case 'DELETE':
      try {
        const { id } = query;
        const deletedVoucher = await Voucher.findByIdAndDelete(id);
        if (!deletedVoucher) {
          return res.status(404).json({ error: 'Voucher not found' });
        }
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete voucher' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}