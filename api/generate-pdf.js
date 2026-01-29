import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';

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
      return res.status(404).json({ message: 'No vouchers found to generate PDF' });
    }

    // Create PDF in memory
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=vouchers-${new Date().toISOString().split('T')[0]}.pdf`);

    // Pipe PDF content to response
    doc.pipe(res);

    for (let i = 0; i < vouchers.length; i++) {
      const voucher = vouchers[i];
      
      if (i > 0) {
        doc.addPage();
      }

      // Add watermark
      doc.fillColor('#000000', 0.1)
         .fontSize(100)
         .font('Helvetica')
         .text('VOUCHER', 150, 300, {
           width: 300,
           align: 'center'
         });

      // Reset opacity for content
      doc.fillColor('#000000', 1);

      // Header
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .text('NESTORIA BUILDCON PVT. LTD.', 50, 50, {
           width: 500,
           align: 'center'
         });

      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('PAYMENT VOUCHER', 50, 80, {
           width: 500,
           align: 'center'
         });

      // Voucher details
      doc.fontSize(12)
         .font('Helvetica');

      // Row 1
      doc.text(`Voucher No: ${voucher.voucherNo || ''}`, 50, 120);
      doc.text(`Date: ${voucher.date || ''}`, 400, 120);

      // Row 2
      doc.text(`Name: ${voucher.name || ''}`, 50, 140);
      doc.text(`Paid To: ${voucher.paidTo || ''}`, 300, 140);

      // Row 3
      doc.text(`Debit: ${voucher.debit || ''}`, 50, 160);
      
      // On A/C Of with team leader name and vehicle number if applicable
      let onAccountOfDisplay = voucher.onAccountOf || '';
      if (voucher.teamLeaderName) {
        onAccountOfDisplay += ` (${voucher.teamLeaderName})`;
      }
      if (voucher.vehicleNumber && voucher.onAccountOf && voucher.onAccountOf.includes('Fuel Exp.')) {
        onAccountOfDisplay += ` (${voucher.vehicleNumber})`;
      }
      
      doc.text(`On A/C Of: ${onAccountOfDisplay}`, 300, 160);

      // Particulars table header
      const tableTop = 190;
      const rowHeight = 20;
      
      doc.font('Helvetica-Bold')
         .text('Particulars', 50, tableTop)
         .text('Rs.', 350, tableTop)
         .text('Ps.', 450, tableTop);

      // Particulars rows
      doc.font('Helvetica');
      let yPos = tableTop + rowHeight;
      
      if (voucher.particulars && Array.isArray(voucher.particulars)) {
        voucher.particulars.forEach(particular => {
          doc.text(particular.description || '', 50, yPos);
          doc.text(particular.rs || '', 350, yPos);
          doc.text(particular.ps || '', 450, yPos);
          yPos += rowHeight;
        });
      }

      // Amount in words
      yPos += 10;
      doc.font('Helvetica-Bold')
         .text('RUPEES IN WORDS', 50, yPos);
      
      yPos += rowHeight;
      doc.font('Helvetica')
         .text(voucher.amountInWords || '', 50, yPos);

      // Total amount
      yPos += 20;
      doc.font('Helvetica-Bold')
         .text('TOTAL', 50, yPos)
         .text(Math.floor(voucher.totalAmount || 0).toString(), 350, yPos)
         .text(Math.round(((voucher.totalAmount || 0) % 1) * 100).toString(), 450, yPos);

      // Authorization section
      yPos += 40;
      doc.font('Helvetica-Bold')
         .text(`Authorized by L1: ${voucher.authorizedByL1 || ''}`, 50, yPos)
         .text(`Prepared By: ${voucher.preparedBy || ''}`, 50, yPos + 20)
         .text(`Authorized by L2: ${voucher.authorizedByL2 || ''}`, 350, yPos);

      // Receiver signature
      doc.rect(450, yPos + 40, 100, 40).stroke();
      doc.font('Helvetica')
         .text('RECEIVER\'S SIGN', 450, yPos + 85, {
           width: 100,
           align: 'center'
         });
    }

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
}