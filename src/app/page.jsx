"use client";
import React from "react";

function MainComponent() {
  const [formData, setFormData] = React.useState({
    name: "",
    paidTo: "",
    debit: "",
    onAccountOf: "",
    voucherNo: "",
    date: "",
    particulars: [{ description: "", rs: "", ps: "" }],
    preparedBy: "",
    authorizedByL1: "",
    authorizedByL2: "",
  });

  const [vouchers, setVouchers] = React.useState([]);
  const [showPrint, setShowPrint] = React.useState(false);
  const [currentVoucher, setCurrentVoucher] = React.useState(null);

  // Options for select fields
  const nameOptions = [
    "Naresh Sharma ji",
    "Sohanlal Patidar ji",
    "Gopal Singh Tomar ji",
    "Tarun Badgujar Ji",
    "Krishna Singh Tomar Ji",
    "Pushpraj Singh Tomar Ji",
    "Rupendra Sharma Ji",
    "Banwari Lal Sharma Ji",
    "Manu Pratap Parmar Ji",
    "Monu Parmar Ji",
    "Kamal Singh Tomar Ji",
    "Komal Singh Ji",
    "Manual Entry",
  ];

  const paidToOptions = [
    "RK PETROLEUM",
    "GUJRAT GAS LTD",
    "GALLOPS PETROLEUM",
    "SHELL PETROLEUM",
    "H.P PETROLEUM",
    "GRAND MILLENNIUM AHMEDABAD",
    "GALLOPS FOOD COURT",
    "Manual Entry",
  ];

  const debitOptions = ["CASH", "CARD", "UPI", "Manual Entry"];

  const onAccountOfOptions = [
    "Fuel Exp.",
    "Food Exp.",
    "Parking",
    "Manual Entry",
  ];

  // Auto-generate voucher number on initial load
  React.useEffect(() => {
    if (!formData.voucherNo) {
      setFormData((prev) => ({
        ...prev,
        voucherNo: `NB${Date.now().toString().slice(-6)}`,
      }));
    }
  }, [formData.voucherNo]); // Depend on voucherNo to prevent re-generation if user manually changes it

  // Helper function to check if a value is a manual entry (has the prefix)
  const isManualPrefixed = (value) => value.startsWith("Manual Entry:");

  // Auto-generate description when relevant fields change
  React.useEffect(() => {
    // Get the cleaned values for use in the auto-generated description
    const cleanedName = isManualPrefixed(formData.name) ? formData.name.replace("Manual Entry:", "") : formData.name;
    const cleanedPaidTo = isManualPrefixed(formData.paidTo) ? formData.paidTo.replace("Manual Entry:", "") : formData.paidTo;
    const cleanedOnAccountOf = isManualPrefixed(formData.onAccountOf) ? formData.onAccountOf.replace("Manual Entry:", "") : formData.onAccountOf;

    // Condition to auto-generate: all fields must be selected and NOT the literal "Manual Entry" option
    // This means if "Manual Entry" is chosen from the dropdown, auto-generation is disabled.
    const shouldAutoGenerate =
      formData.name &&
      formData.paidTo &&
      formData.onAccountOf &&
      formData.name !== "Manual Entry" &&
      formData.paidTo !== "Manual Entry" &&
      formData.onAccountOf !== "Manual Entry";

    if (shouldAutoGenerate) {
      const autoDescription = `Amount Being paid To ${cleanedPaidTo} For ${cleanedOnAccountOf} By ${cleanedName}`;
      setFormData((prev) => ({
        ...prev,
        particulars: prev.particulars.map((item, index) =>
          index === 0 ? { ...item, description: autoDescription } : item
        ),
      }));
    } else {
      // If auto-generation criteria are not met, clear the description if it was previously auto-generated
      // This prevents the auto-generated text from staying when a manual option is selected.
      if (formData.particulars[0].description.startsWith("Amount Being paid To")) {
        setFormData((prev) => ({
          ...prev,
          particulars: prev.particulars.map((item, index) =>
            index === 0 ? { ...item, description: "" } : item
          ),
        }));
      }
    }
  }, [formData.name, formData.paidTo, formData.onAccountOf]); // Re-run effect when these fields change

  // Convert number to words (Indian numbering system)
  const numberToWords = (num) => {
    if (isNaN(num) || num === null || num === undefined) return "";
    num = Math.floor(num); // Ensure we only convert the integer part for words

    if (num === 0) return "Zero Only";

    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertChunk = (n) => {
      let s = "";
      if (n >= 100) {
        s += units[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 20) {
        s += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n >= 10) {
        s += teens[n - 10] + " ";
      } else if (n > 0) {
        s += units[n] + " ";
      }
      return s;
    };

    let words = [];
    let n = num;

    if (n >= 10000000) {
      words.push(convertChunk(Math.floor(n / 10000000)) + "Crore");
      n %= 10000000;
    }
    if (n >= 100000) {
      words.push(convertChunk(Math.floor(n / 100000)) + "Lakh");
      n %= 100000;
    }
    if (n >= 1000) {
      words.push(convertChunk(Math.floor(n / 1000)) + "Thousand");
      n %= 1000;
    }
    if (n > 0) {
      words.push(convertChunk(n));
    }

    return words.join(" ").trim() + " Only";
  };

  // Calculate total amount from particulars
  const calculateTotal = () => {
    return formData.particulars.reduce((total, item) => {
      const rs = parseFloat(item.rs) || 0;
      const ps = parseFloat(item.ps) || 0;
      return total + rs + ps / 100;
    }, 0);
  };

  // Handle changes in main form fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle changes in particulars table rows
  const handleParticularChange = (index, field, value) => {
    const newParticulars = [...formData.particulars];
    newParticulars[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      particulars: newParticulars,
    }));
  };

  // Add a new row to particulars table
  const addParticular = () => {
    setFormData((prev) => ({
      ...prev,
      particulars: [...prev.particulars, { description: "", rs: "", ps: "" }],
    }));
  };

  // Remove a row from particulars table
  const removeParticular = (index) => {
    if (formData.particulars.length > 1) {
      const newParticulars = formData.particulars.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        particulars: newParticulars,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Extract actual values if "Manual Entry:" prefix is present
    const cleanValue = (value) =>
      value.startsWith("Manual Entry:") ? value.replace("Manual Entry:", "") : value;

    const newVoucher = {
      ...formData,
      name: cleanValue(formData.name),
      paidTo: cleanValue(formData.paidTo),
      debit: cleanValue(formData.debit),
      onAccountOf: cleanValue(formData.onAccountOf),
      id: Date.now(),
      totalAmount: calculateTotal(),
      amountInWords: numberToWords(Math.floor(calculateTotal())),
    };

    setVouchers((prev) => [...prev, newVoucher]);

    // Reset form to initial state for a new entry
    setFormData({
      name: "",
      paidTo: "",
      debit: "",
      onAccountOf: "",
      voucherNo: `NB${Date.now().toString().slice(-6)}`, // Generate new voucher number
      date: "",
      particulars: [{ description: "", rs: "", ps: "" }],
      preparedBy: "",
      authorizedByL1: "",
      authorizedByL2: "",
    });

    // Using a custom message box instead of alert()
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center">
        <p class="text-xl font-semibold mb-4">Voucher submitted successfully!</p>
        <button id="closeMessageBox" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">OK</button>
      </div>
    `;
    document.body.appendChild(messageBox);
    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  // Handle printing of the current voucher
  const handlePrint = () => {
    const cleanValue = (value) =>
      value.startsWith("Manual Entry:") ? value.replace("Manual Entry:", "") : value;

    const voucherToPrint = {
      ...formData,
      // Ensure manual entries are cleaned for printing
      name: cleanValue(formData.name),
      paidTo: cleanValue(formData.paidTo),
      debit: cleanValue(formData.debit),
      onAccountOf: cleanValue(formData.onAccountOf),
      totalAmount: calculateTotal(),
      amountInWords: numberToWords(Math.floor(calculateTotal())),
    };
    setCurrentVoucher(voucherToPrint);
    setShowPrint(true);

    // Use setTimeout to allow React to render the print view before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Export all submitted vouchers to Excel (CSV format)
  const exportToExcel = () => {
    if (vouchers.length === 0) {
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity50 flex items-center justify-center z-50';
      messageBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
          <p class="text-xl font-semibold mb-4">No vouchers to export!</p>
          <button id="closeMessageBox" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeMessageBox').onclick = () => {
        document.body.removeChild(messageBox);
      };
      return;
    }

    // Create workbook data for CSV
    const wsData = [
      [
        "Voucher No",
        "Date",
        "Name",
        "Paid To",
        "Debit",
        "On A/C Of",
        "Particulars Description",
        "Amount (Rs)",
        "Amount (Ps)",
        "Total Amount",
        "Amount in Words",
        "Prepared By",
        "Authorized By L1",
        "Authorized By L2",
      ],
    ];

    vouchers.forEach((voucher) => {
      voucher.particulars.forEach((particular, index) => {
        wsData.push([
          index === 0 ? voucher.voucherNo : "",
          index === 0 ? voucher.date : "",
          index === 0 ? voucher.name : "",
          index === 0 ? voucher.paidTo : "",
          index === 0 ? voucher.debit : "",
          index === 0 ? voucher.onAccountOf : "",
          particular.description,
          particular.rs,
          particular.ps,
          index === 0 ? voucher.totalAmount.toFixed(2) : "",
          index === 0 ? voucher.amountInWords : "",
          index === 0 ? voucher.preparedBy : "",
          index === 0 ? voucher.authorizedByL1 : "",
          index === 0 ? voucher.authorizedByL2 : "",
        ]);
      });
    });

    // Create CSV content from data
    const csvContent = wsData
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")) // Handle commas and quotes in data
      .join("\n");

    // Download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vouchers.csv";
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a); // Clean up
    window.URL.revokeObjectURL(url);
  };

  // Render the print view if showPrint is true
  if (showPrint && currentVoucher) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto bg-white border-2 border-gray-600 p-8 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src="https://ucarecdn.com/326c2bf5-cf90-469a-98fd-707a7a29595f/-/format/auto/"
              alt="Nestoria Watermark"
              className="w-74 h-64 opacity-10"
            />
          </div>

          {/* Header for print view */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center">
              <img
                src="https://ucarecdn.com/e61275b6-136c-4dd7-902a-e74491326b5c/-/format/auto/"
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
                  {currentVoucher.paidTo}
                </div>
              </div>
              <div className="flex items-center ml-8">
                <span className="text-gray-800 font-semibold mr-2">NO.:</span>
                <div className="border-b border-black min-w-[100px] pb-1">
                  {currentVoucher.voucherNo}
                </div>
              </div>
              <div className="flex items-center ml-8">
                <span className="text-gray-800 font-semibold mr-2">DATE:</span>
                <div className="border-b border-black min-w-[120px] pb-1">
                  {currentVoucher.date}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-gray-800 font-semibold mr-2">DEBIT</span>
              <div className="border-b border-black flex-1 pb-1">
                {currentVoucher.debit}
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-gray-800 font-semibold mr-2">
                ON A/C OF
              </span>
              <div className="border-b border-black flex-1 pb-1">
                {currentVoucher.onAccountOf}
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
                {currentVoucher.particulars.map((item, index) => (
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
                  <td className="p-3">{currentVoucher.amountInWords}</td>
                  <td className="p-3 border-l border-gray-600"></td>
                  <td className="p-3 border-l border-gray-600"></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-right">TOTAL</td>
                  <td className="p-3 text-center border-l border-gray-600 font-semibold">
                    {Math.floor(currentVoucher.totalAmount)}
                  </td>
                  <td className="p-3 text-center border-l border-gray-600 font-semibold">
                    {Math.round((currentVoucher.totalAmount % 1) * 100)}
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
                  {currentVoucher.authorizedByL1}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-800 font-semibold mr-2">
                  Prepared By
                </span>
                <div className="border-b border-black min-w-[150px] pb-1">
                  {currentVoucher.preparedBy}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-gray-800 font-semibold mr-2">
                Authorized by L2
              </span>
              <div className="border-b border-black min-w-[150px] pb-1">
                {currentVoucher.authorizedByL2}
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
            onClick={() => setShowPrint(false)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to Form
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
              size: A4 landscape;
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

  // Render the main form view
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
            Voucher Management System
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Export to Excel ({vouchers.length})
            </button>
          </div>
        </div>

        <form className="space-y-7">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                Name
              </label>
              <select
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              >
                <option value="">Select Name</option>
                {nameOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {formData.name.startsWith("Manual Entry") && (
                <input
                  type="text"
                  placeholder="Enter name manually"
                  value={
                    formData.name.startsWith("Manual Entry:")
                      ? formData.name.replace("Manual Entry:", "")
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("name", `Manual Entry:${e.target.value}`)
                  }
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
            <div>
              <label htmlFor="voucherNo" className="block text-sm font-semibold text-gray-700 mb-1">
                Voucher No.
              </label>
              <input
                type="text"
                id="voucherNo"
                value={formData.voucherNo}
                onChange={(e) => handleInputChange("voucherNo", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>

          <div>
            <label htmlFor="paidTo" className="block text-sm font-semibold text-gray-700 mb-1">
              Paid To
            </label>
            <select
              id="paidTo"
              value={formData.paidTo}
              onChange={(e) => handleInputChange("paidTo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="">Select Paid To</option>
              {paidToOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formData.paidTo.startsWith("Manual Entry") && (
              <input
                type="text"
                placeholder="Enter paid to manually"
                value={
                  formData.paidTo.startsWith("Manual Entry:")
                    ? formData.paidTo.replace("Manual Entry:", "")
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("paidTo", `Manual Entry:${e.target.value}`)
                }
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          <div>
            <label htmlFor="debit" className="block text-sm font-semibold text-gray-700 mb-1">
              Debit
            </label>
            <select
              id="debit"
              value={formData.debit}
              onChange={(e) => handleInputChange("debit", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="">Select Debit</option>
              {debitOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formData.debit.startsWith("Manual Entry") && (
              <input
                type="text"
                placeholder="Enter debit manually"
                value={
                  formData.debit.startsWith("Manual Entry:")
                    ? formData.debit.replace("Manual Entry:", "")
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("debit", `Manual Entry:${e.target.value}`)
                }
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          <div>
            <label htmlFor="onAccountOf" className="block text-sm font-semibold text-gray-700 mb-1">
              On A/C Of
            </label>
            <select
              id="onAccountOf"
              value={formData.onAccountOf}
              onChange={(e) => handleInputChange("onAccountOf", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="">Select On A/C Of</option>
              {onAccountOfOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formData.onAccountOf.startsWith("Manual Entry") && (
              <input
                type="text"
                placeholder="Enter on A/C of manually"
                value={
                  formData.onAccountOf.startsWith("Manual Entry:")
                    ? formData.onAccountOf.replace("Manual Entry:", "")
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("onAccountOf", `Manual Entry:${e.target.value}`)
                }
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          {/* Particulars Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-lg font-bold text-gray-800">
                Particulars
              </label>
              <button
                type="button"
                onClick={addParticular}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Row
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 gap-0 bg-gray-100 p-3 font-semibold text-gray-700 border-b border-gray-300">
                <div className="col-span-6 px-2">Description</div>
                <div className="col-span-2 text-center px-2">Rs.</div>
                <div className="col-span-2 text-center px-2">Ps.</div>
                <div className="col-span-2 text-center px-2">Action</div>
              </div>

              {formData.particulars.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-0 p-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="col-span-6 px-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleParticularChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="col-span-2 px-2">
                    <input
                      type="number"
                      value={item.rs}
                      onChange={(e) =>
                        handleParticularChange(index, "rs", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2 px-2">
                    <input
                      type="number"
                      value={item.ps}
                      onChange={(e) =>
                        handleParticularChange(index, "ps", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      placeholder="0"
                      max="99"
                    />
                  </div>
                  <div className="col-span-2 px-2">
                    <button
                      type="button"
                      onClick={() => removeParticular(index)}
                      className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={formData.particulars.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-blue-50 rounded-lg shadow-inner border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800 text-lg">Total Amount:</span>
                <span className="text-2xl font-extrabold text-blue-700">
                  ₹{calculateTotal().toFixed(2)}
                </span>
              </div>
              <div className="text-md text-gray-600">
                <strong className="text-gray-700">In Words:</strong>{" "}
                {numberToWords(Math.floor(calculateTotal()))}
              </div>
            </div>
          </div>

          {/* Authorization Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="preparedBy" className="block text-sm font-semibold text-gray-700 mb-1">
                Prepared By
              </label>
              <input
                type="text"
                id="preparedBy"
                value={formData.preparedBy}
                onChange={(e) =>
                  handleInputChange("preparedBy", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="authorizedByL1" className="block text-sm font-semibold text-gray-700 mb-1">
                Authorized By L1
              </label>
              <input
                type="text"
                id="authorizedByL1"
                value={formData.authorizedByL1}
                onChange={(e) =>
                  handleInputChange("authorizedByL1", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="authorizedByL2" className="block text-sm font-semibold text-gray-700 mb-1">
                Authorized By L2
              </label>
              <input
                type="text"
                id="authorizedByL2"
                value={formData.authorizedByL2}
                onChange={(e) =>
                  handleInputChange("authorizedByL2", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 font-bold flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Submit Voucher
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 font-bold flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2M7 12h.01M17 12h.01"
                ></path>
              </svg>
              Print Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MainComponent;
