import mongoose from 'mongoose';
import XLSX from 'xlsx';

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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectDB();

  try {
    const vouchers = await Voucher.find({});

    if (vouchers.length === 0) {
      return res.status(404).json({ message: 'No vouchers found to export' });
    }

    // Prepare data for Excel
    const excelData = vouchers.map(voucher => {
      // Format On A/C Of with team leader name and vehicle number
      let formattedOnAccountOf = voucher.onAccountOf || '';
      if (voucher.teamLeaderName) {
        formattedOnAccountOf += ` (${voucher.teamLeaderName})`;
      }
      if (voucher.vehicleNumber && voucher.onAccountOf && voucher.onAccountOf.includes('Fuel Exp.')) {
        formattedOnAccountOf += ` (${voucher.vehicleNumber})`;
      }

      return {
        'Voucher No': voucher.voucherNo || '',
        'Date': voucher.date || '',
        'Name': voucher.name || '',
        'Paid To': voucher.paidTo || '',
        'Debit': voucher.debit || '',
        'On A/C Of': formattedOnAccountOf,
        'Particulars': voucher.particulars ? voucher.particulars.map(p => `${p.description} (Rs: ${p.rs || 0}, Ps: ${p.ps || 0})`).join('; ') : '',
        'Total Amount': voucher.totalAmount || 0,
        'Amount In Words': voucher.amountInWords || '',
        'Prepared By': voucher.preparedBy || '',
        'Authorized By L1': voucher.authorizedByL1 || '',
        'Authorized By L2': voucher.authorizedByL2 || ''
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Vouchers');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=vouchers-${new Date().toISOString().split('T')[0]}.xlsx`);

    // Send Excel file
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: 'Failed to generate Excel file', details: error.message });
  }
}