"use client";
import React from 'react';

// Define the base URL for your Render API (if needed in this component, though it's not currently used)
// const API_ROOT_URL = 'https://nestoria-voucher-api.onrender.com/api/nestoria-payment-voucher';

function PrintVoucherComponent({ voucherData, onBack }) {
  if (!voucherData) {
    return null; // Don't render if no voucher data is provided
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto bg-white border-2 border-gray-600 p-8 relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="https://ik.imagekit.io/bhadoriyaji/fav%20icon.png?updatedAt=1749496082614"
            alt="Nestoria Watermark"
            className="w-74 h-64 opacity-10"
          />
        </div>

        {/* Header for print view */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center">
            <img
              src="https://ik.imagekit.io/bhadoriyaji/nestoria-logo-new.png?updatedAt=1753868377250"
              alt="Nestoria Group Logo"
              className="w-20 h-20 mr-4"
            />
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Nestoria Buildcon Pvt. Ltd.
            </h1>
            <h2 className="text-xl font-semibold text-gray-800">
              PAYMENT VOUCHER
            </h2>
          </div>
        </div>

        {/* Form Fields for print view */}
        <div className="space-y-4 mb-6 relative z-10">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-gray-800 font-semibold mr-2">
                PAID TO
              </span>
              <div className="border-b border-black flex-1 min-w-[300px] pb-1">
                {voucherData.paidTo}
              </div>
            </div>
            <div className="flex items-center ml-8">
              <span className="text-gray-800 font-semibold mr-2">NO.:</span>
              <div className="border-b border-black min-w-[100px] pb-1">
                {voucherData.voucherNo}
              </div>
            </div>
            <div className="flex items-center ml-8">
              <span className="text-gray-800 font-semibold mr-2">DATE:</span>
              <div className="border-b border-black min-w-[120px] pb-1">
                {voucherData.date}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-gray-800 font-semibold mr-2">DEBIT</span>
            <div className="border-b border-black flex-1 pb-1">
              {voucherData.debit}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-gray-800 font-semibold mr-2">
              ON A/C OF
            </span>
            <div className="border-b border-black flex-1 pb-1">
              {voucherData.onAccountOf}
            </div>
          </div>
        </div>

        {/* Particulars Table for print view */}
        <div className="border-2 border-gray-600 rounded-lg mb-6 relative z-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left p-3 text-gray-800 font-semibold">
                  PARTICULARS:
                </th>
                <th className="text-center p-3 text-gray-800 font-semibold border-l border-gray-600 w-24">
                  Rs.
                </th>
                <th className="text-center p-3 text-gray-800 font-semibold border-l border-gray-600 w-24">
                  Ps.
                </th>
              </tr>
            </thead>
            <tbody>
              {voucherData.particulars.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="p-3">{item.description}</td>
                  <td className="p-3 text-center border-l border-gray-600">
                    {item.rs}
                  </td>
                  <td className="p-3 text-center border-l border-gray-600">
                    {item.ps}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-gray-300">
                <td className="p-3 font-semibold text-gray-800">
                  RUPEES IN WORDS
                </td>
                <td className="p-3 border-l border-gray-600"></td>
                <td className="p-3 border-l border-gray-600"></td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-3">{voucherData.amountInWords}</td>
                <td className="p-3 border-l border-gray-600"></td>
                <td className="p-3 border-l border-gray-600"></td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-right">TOTAL</td>
                <td className="p-3 text-center border-l border-gray-600 font-semibold">
                  {Math.floor(voucherData.totalAmount)}
                </td>
                <td className="p-3 text-center border-l border-gray-600 font-semibold">
                  {Math.round((voucherData.totalAmount % 1) * 100)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Authorization Section for print view */}
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-gray-800 font-semibold mr-2">
                Authorized by L1
              </span>
              <div className="border-b border-black min-w-[150px] pb-1">
                {voucherData.authorizedByL1}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-800 font-semibold mr-2">
                Prepared By
              </span>
              <div className="border-b border-black min-w-[150px] pb-1">
                {voucherData.preparedBy}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-gray-800 font-semibold mr-2">
              Authorized by L2
            </span>
            <div className="border-b border-black min-w-[150px] pb-1">
              {voucherData.authorizedByL2}
            </div>
          </div>

          <div className="text-center">
            <div className="w-24 h-16 border border-black mb-2"></div>
            <div className="text-sm text-gray-600">RECEIVER'S SIGN</div>
          </div>
        </div>
      </div>

      {/* Back button for print view (hidden during print) */}
      <div className="text-center mt-8 no-print">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {/* Global print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.3;
          }

          @page {
            size: A5 landscape;
            margin: 0.5in;
          }

          .print-container {
            width: 100%;
            height: 5.8in;
            padding: 10px 20px;
            box-sizing: border-box;
            font-size: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .max-w-4xl {
            max-width: 100%;
            width: 100%;
            margin: 0;
          }

          .print-header,
          .print-fields,
          .print-table,
          .print-auth {
            margin-bottom: 6px;
          }

          .print-header h2,
          .print-header h3 {
            margin: 0;
            font-size: 10px;
          }

          .print-table table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }

          .print-table th,
          .print-table td {
            border: 1px solid #000;
            padding: 3px 4px;
            text-align: left;
          }
          .print-table td {
            font-size: 16px;
            font-weight: 900;
          }

          .print-auth {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }

          .signature-box {
            border: 1px solid #000;
            width: 80px;
            height: 40px;
            margin-left: auto;
          }

          .print-container + .print-container {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
}

export default PrintVoucherComponent;
