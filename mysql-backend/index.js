// MySQL Backend API for Voucher Management
const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
const { pool, testConnection, initializeDatabase } = require('./database');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Test database connection on startup
testConnection();
initializeDatabase();

// Routes for vouchers
app.get('/vouchers', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM vouchers ORDER BY createdAt DESC');
    
    // Parse JSON particulars
    const vouchers = rows.map(voucher => ({
      ...voucher,
      particulars: typeof voucher.particulars === 'string' 
        ? JSON.parse(voucher.particulars) 
        : voucher.particulars
    }));
    
    res.status(200).json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch vouchers', details: error.message });
  }
});

app.get('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM vouchers WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    
    const voucher = {
      ...rows[0],
      particulars: typeof rows[0].particulars === 'string' 
        ? JSON.parse(rows[0].particulars) 
        : rows[0].particulars
    };
    
    res.status(200).json(voucher);
  } catch (error) {
    console.error(`Error fetching voucher ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch voucher', details: error.message });
  }
});

app.post('/vouchers', async (req, res) => {
  const newVoucher = req.body;
  try {
    const {
      voucherNo, date, name, paidTo, debit, onAccountOf, 
      teamLeaderName, vehicleNumber, particulars, totalAmount, 
      amountInWords, preparedBy, authorizedByL1, authorizedByL2
    } = newVoucher;

    const [result] = await pool.execute(
      `INSERT INTO vouchers 
      (voucherNo, date, name, paidTo, debit, onAccountOf, teamLeaderName, 
       vehicleNumber, particulars, totalAmount, amountInWords, preparedBy, 
       authorizedByL1, authorizedByL2) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        voucherNo, date, name, paidTo, debit, onAccountOf, 
        teamLeaderName || null, vehicleNumber || null, 
        JSON.stringify(particulars || []), 
        totalAmount, amountInWords, preparedBy, 
        authorizedByL1, authorizedByL2
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM vouchers WHERE id = ?', [result.insertId]);
    const voucher = {
      ...rows[0],
      particulars: typeof rows[0].particulars === 'string' 
        ? JSON.parse(rows[0].particulars) 
        : rows[0].particulars
    };

    res.status(201).json(voucher);
  } catch (error) {
    console.error('Error adding voucher:', error);
    res.status(500).json({ error: 'Failed to add voucher', details: error.message });
  }
});

app.put('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  const updatedVoucher = req.body;
  try {
    const {
      voucherNo, date, name, paidTo, debit, onAccountOf, 
      teamLeaderName, vehicleNumber, particulars, totalAmount, 
      amountInWords, preparedBy, authorizedByL1, authorizedByL2
    } = updatedVoucher;

    await pool.execute(
      `UPDATE vouchers SET 
      voucherNo = ?, date = ?, name = ?, paidTo = ?, debit = ?, 
      onAccountOf = ?, teamLeaderName = ?, vehicleNumber = ?, 
      particulars = ?, totalAmount = ?, amountInWords = ?, 
      preparedBy = ?, authorizedByL1 = ?, authorizedByL2 = ? 
      WHERE id = ?`,
      [
        voucherNo, date, name, paidTo, debit, onAccountOf, 
        teamLeaderName || null, vehicleNumber || null, 
        JSON.stringify(particulars || []), 
        totalAmount, amountInWords, preparedBy, 
        authorizedByL1, authorizedByL2, id
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM vouchers WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    const voucher = {
      ...rows[0],
      particulars: typeof rows[0].particulars === 'string' 
        ? JSON.parse(rows[0].particulars) 
        : rows[0].particulars
    };

    res.status(200).json(voucher);
  } catch (error) {
    console.error(`Error updating voucher ${id}:`, error);
    res.status(500).json({ error: 'Failed to update voucher', details: error.message });
  }
});

app.delete('/vouchers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM vouchers WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting voucher ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete voucher', details: error.message });
  }
});

// Additional route to match the frontend API expectations
app.get('/voucherData', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM vouchers ORDER BY createdAt DESC');
    
    const vouchers = rows.map(voucher => ({
      ...voucher,
      particulars: typeof voucher.particulars === 'string' 
        ? JSON.parse(voucher.particulars) 
        : voucher.particulars
    }));
    
    res.status(200).json(vouchers);
  } catch (error) {
    console.error('Error fetching voucher data:', error);
    res.status(500).json({ error: 'Failed to fetch voucher data', details: error.message });
  }
});

// Generate PDF endpoint
app.get('/generate-pdf', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM vouchers ORDER BY createdAt DESC');
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No vouchers found to generate PDF' });
    }

    const vouchers = rows.map(voucher => ({
      ...voucher,
      particulars: typeof voucher.particulars === 'string' 
        ? JSON.parse(voucher.particulars) 
        : voucher.particulars
    }));

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
});

// Generate Excel endpoint
app.get('/generate-excel', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM vouchers ORDER BY createdAt DESC');
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No vouchers found to export' });
    }

    const vouchers = rows.map(voucher => ({
      ...voucher,
      particulars: typeof voucher.particulars === 'string' 
        ? JSON.parse(voucher.particulars) 
        : voucher.particulars
    }));

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
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MySQL backend is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`MySQL API server listening on port ${PORT}`);
});

module.exports = app;