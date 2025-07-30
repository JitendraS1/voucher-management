"use client";
import React from "react";
import axios from 'axios'; // Import axios for making HTTP requests

// Define the base URL for your Render API, without the specific resource path
const API_ROOT_URL = 'https://nestoria-voucher-api.onrender.com/api/nestoria-payment-voucher';

function MainComponent() {
  // PrintVoucherComponent (moved directly into MainComponent)
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

  // SubmittedVouchersPage Component - Now nested inside MainComponent
  function SubmittedVouchersPage({ onPrintVoucher, onBackToForm, onEditVoucher }) {
    const [submittedVouchers, setSubmittedVouchers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState('');
    const [searchQuery, setSearchQuery] = React.useState(''); // New state for search query

    // Debounce function
    const debounce = (func, delay) => {
      let timeout;
      return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
      };
    };

    // Function to fetch vouchers from the API
    const fetchVouchers = React.useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        // GET all vouchers: uses API_ROOT_URL + /voucherData
        const response = await axios.get(`${API_ROOT_URL}/voucherData`);
        let data = response.data;

        // Apply date filter
        if (selectedDate) {
          data = data.filter(voucher => voucher.date === selectedDate);
        }

        // Apply search query filter (case-insensitive)
        if (searchQuery) {
          data = data.filter(voucher =>
            voucher.name && voucher.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setSubmittedVouchers(data);
      } catch (err) {
        console.error("Failed to fetch vouchers:", err);
        setError("Failed to load vouchers. Please ensure your Render API is running and accessible at " + API_ROOT_URL + ". Error: " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }, [selectedDate, searchQuery]); // Dependencies for useCallback

    React.useEffect(() => {
      fetchVouchers();
    }, [fetchVouchers]); // Re-fetch when fetchVouchers (which depends on selectedDate/searchQuery) changes

    // Debounced search handler
    const debouncedSetSearchQuery = React.useCallback(
      debounce((value) => {
        setSearchQuery(value);
      }, 500), // 500ms debounce delay
      []
    );

    const handleSearchInputChange = (e) => {
      debouncedSetSearchQuery(e.target.value);
    };


    const handlePrintClick = (voucher) => {
      if (typeof onPrintVoucher === 'function') {
        onPrintVoucher(voucher);
      } else {
        console.warn("onPrintVoucher prop is not a function or is missing.");
      }
    };

    const handleEditClick = (voucher) => {
      if (typeof onEditVoucher === 'function') {
        onEditVoucher(voucher);
      } else {
        console.warn("onEditVoucher prop is not a function or is missing.");
      }
    };

    const handleDeleteClick = async (id) => {
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
      messageBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
          <p class="text-xl font-semibold mb-4">Are you sure you want to delete this voucher?</p>
          <div class="flex justify-center space-x-4">
            <button id="confirmDelete" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes, Delete</button>
            <button id="cancelDelete" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">No, Cancel</button>
          </div>
        </div>
      `;
      document.body.appendChild(messageBox);

      document.getElementById('confirmDelete').onclick = async () => {
        document.body.removeChild(messageBox);
        try {
          // DELETE a voucher: uses API_ROOT_URL + /:id
          await axios.delete(`${API_ROOT_URL}/${id}`);
          console.log('Delete Success');
          const successMessageBox = document.createElement('div');
          successMessageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
          successMessageBox.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl text-center">
              <p class="text-xl font-semibold mb-4">Voucher deleted successfully!</p>
              <button id="closeSuccessMessageBox" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">OK</button>
            </div>
          `;
          document.body.appendChild(successMessageBox);
          document.getElementById('closeSuccessMessageBox').onclick = () => {
            document.body.removeChild(successMessageBox);
            fetchVouchers(); // Re-fetch after deletion
          };
        } catch (error) {
          console.error('Delete Error:', error);
          const errorMessageBox = document.createElement('div');
          errorMessageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
          errorMessageBox.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl text-center">
              <p class="text-xl font-semibold mb-4">Failed to delete voucher. Error: ${error.response?.data?.error || error.message}</p>
              <button id="closeErrorMessageBox" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">OK</button>
            </div>
          `;
          document.body.appendChild(errorMessageBox);
          document.getElementById('closeErrorMessageBox').onclick = () => {
            document.body.removeChild(errorMessageBox);
          };
        }
      };

      document.getElementById('cancelDelete').onclick = () => {
        document.body.removeChild(messageBox);
      };
    };

    const exportToExcel = () => {
      if (submittedVouchers.length === 0) {
        const messageBox = document.createElement('div');
        messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
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

      submittedVouchers.forEach((voucher) => {
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
            index === 0 ? voucher.totalAmount?.toFixed(2) : "",
            index === 0 ? voucher.amountInWords : "",
            index === 0 ? voucher.preparedBy : "",
            index === 0 ? voucher.authorizedByL1 : "",
            index === 0 ? voucher.authorizedByL2 : "",
          ]);
        });
      });

      const csvContent = wsData
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "submitted_vouchers.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-xl font-semibold text-gray-700">Loading submitted vouchers...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="text-xl font-semibold text-red-600 mb-4">{error}</div>
          <button
            onClick={onBackToForm}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Back to Form
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-4 font-sans antialiased">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
              Submitted Vouchers
            </h1>
            <div className="flex items-center space-x-3">
              <label htmlFor="filterDate" className="block text-sm font-semibold text-gray-700">
                Filter by Date:
              </label>
              <input
                type="date"
                id="filterDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Search by name..."
                onChange={handleSearchInputChange} // Use debounced handler
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
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
                Export to Excel ({submittedVouchers.length})
              </button>
              <button
                onClick={onBackToForm}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Back to Form
              </button>
            </div>
          </div>


          {submittedVouchers.length === 0 ? (
            <div className="text-center text-gray-600 text-lg py-10">
              No vouchers have been submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On A/C Of</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submittedVouchers.map((voucher) => (
                    <tr key={voucher._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voucher.voucherNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voucher.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voucher.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voucher.paidTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voucher.debit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voucher.onAccountOf}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">₹{voucher.totalAmount?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(voucher)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded-md transition duration-150 ease-in-out hover:bg-blue-200 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handlePrintClick(voucher)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 px-3 py-1 rounded-md transition duration-150 ease-in-out hover:bg-indigo-200 mr-2"
                        >
                          Print
                        </button>
                        <button
                          onClick={() => handleDeleteClick(voucher._id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded-md transition duration-150 ease-in-out hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }


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

  const [currentVoucherToPrint, setCurrentVoucherToPrint] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('form'); // 'form' or 'submitted' or 'print'
  const [editingVoucherId, setEditingVoucherId] = React.useState(null); // New state for tracking editing

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
    "GUJARAT GAS LTD",
    "GALLOPS PETROLEUM",
    "SHELL PETROLEUM",
    "H.P PETROLEUM",
    "GRAND MILLENNIUM AHMEDABAD",
    "GALLOPS FOOD COURT",
    "ADANI KANCHAN ENTERPRISES ",
    "TORAN FOOD COURT",
    "UDAY PETROLEUM",
    "ISCON GANTHIYA",
    "LAKSHYA PETROLEUM",
    "SHRRDHA PETROLEUM",
    "SHREE LAKSHMI NARAYAN AUTOMOBILES",
    "JASHBHI PATEL & CORPORATION",
    "Manual Entry",
  ];

  const debitOptions = ["CASH", "CARD", "UPI", "Manual Entry"];

  const onAccountOfOptions = [
    "Fuel Exp.",
    "Food Exp.",
    "OTHER EXP.",
    "OTHER EXP PANCHER",
    "Parking",
    "Manual Entry",
  ];

  // Auto-generate voucher number on initial load or when starting a new form
  React.useEffect(() => {
    // Only generate a new voucher number if it's a new form (not editing)
    // and the current voucherNo is empty or was from a previous session/reset
    if (!editingVoucherId && (viewMode === 'form' && !formData.voucherNo)) {
      setFormData((prev) => ({
        ...prev,
        voucherNo: `NB${Date.now().toString().slice(-6)}`,
      }));
    }
  }, [viewMode, editingVoucherId]); // Dependencies: only re-run if viewMode or editingVoucherId changes. formData.voucherNo is *not* a dependency here to prevent loop.

  // Helper function to check if a value is a manual entry (has the prefix)
  const isManualPrefixed = (value) => value.startsWith("Manual Entry:");

  // Auto-generate description when relevant fields change
  React.useEffect(() => {
    const cleanedName = isManualPrefixed(formData.name) ? formData.name.replace("Manual Entry:", "") : formData.name;
    const cleanedPaidTo = isManualPrefixed(formData.paidTo) ? formData.paidTo.replace("Manual Entry:", "") : formData.paidTo;
    const cleanedOnAccountOf = isManualPrefixed(formData.onAccountOf) ? formData.onAccountOf.replace("Manual Entry:", "") : formData.onAccountOf;

    const autoGeneratedText = `Amount Being paid To ${cleanedPaidTo} For ${cleanedOnAccountOf} By ${cleanedName}`;
    const currentDescription = formData.particulars[0]?.description || "";

    const shouldAutoGenerate =
      formData.name &&
      formData.paidTo &&
      formData.onAccountOf &&
      formData.name !== "Manual Entry" &&
      formData.paidTo !== "Manual Entry" &&
      formData.onAccountOf !== "Manual Entry";

    // Check if the current description is empty OR if it matches the auto-generated pattern
    // This prevents overwriting a manually typed description unless it was already auto-generated
    const isCurrentDescriptionAutoGenerated = currentDescription.startsWith("Amount Being paid To");

    if (shouldAutoGenerate) {
      // Only update if the current description is empty or was previously auto-generated
      // AND if the description actually needs to change
      if ((!currentDescription || isCurrentDescriptionAutoGenerated) && currentDescription !== autoGeneratedText) {
        setFormData((prev) => ({
          ...prev,
          particulars: prev.particulars.map((item, index) =>
            index === 0 ? { ...item, description: autoGeneratedText } : item
          ),
        }));
      }
    } else {
      // If auto-generation criteria are not met, clear the description if it was previously auto-generated
      // AND if the description is not already empty
      if (isCurrentDescriptionAutoGenerated && currentDescription !== "") {
        setFormData((prev) => ({
          ...prev,
          particulars: prev.particulars.map((item, index) =>
            index === 0 ? { ...item, description: "" } : item
          ),
        }));
      }
    }
  }, [formData.name, formData.paidTo, formData.onAccountOf, formData.particulars]); // Added formData.particulars to dependencies for completeness, though the specific elements are accessed.

  // Convert number to words (Indian numbering system)
  const numberToWords = (num) => {
    if (isNaN(num) || num === null || num === undefined) return "";
    
    // Ensure num is a number and has two decimal places for consistent splitting
    const [rupees, paise] = num.toFixed(2).split('.').map(Number);

    const units = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    ];
    const teens = [
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
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

    let rupeesWords = [];
    let n = rupees;

    if (n === 0) {
      rupeesWords.push("Zero");
    } else {
      if (n >= 10000000) {
        rupeesWords.push(convertChunk(Math.floor(n / 10000000)) + "Crore");
        n %= 10000000;
      }
      if (n >= 100000) {
        rupeesWords.push(convertChunk(Math.floor(n / 100000)) + "Lakh");
        n %= 100000;
      }
      if (n >= 1000) {
        rupeesWords.push(convertChunk(Math.floor(n / 1000)) + "Thousand");
        n %= 1000;
      }
      if (n > 0) {
        rupeesWords.push(convertChunk(n));
      }
    }

    let result = rupeesWords.join(" ").trim();
    if (result) {
      result += " Rupees";
    }

    if (paise > 0) {
      let paiseWords = [];
      let p = paise;

      if (p >= 20) {
        paiseWords.push(tens[Math.floor(p / 10)] + " ");
        p %= 10;
      }
      if (p >= 10) {
        paiseWords.push(teens[p - 10] + " ");
      } else if (p > 0) {
        paiseWords.push(units[p] + " ");
      }
      
      const finalPaiseWords = paiseWords.join(" ").trim();
      if (finalPaiseWords) {
        result += ` and ${finalPaiseWords} Paise`;
      }
    }

    return result + " Only";
  };

  // Calculate total amount from particulars
  const calculateTotal = () => {
    return formData.particulars.reduce((total, item) => {
      // Use parseFloat for calculation, ensure it's 0 if empty string
      const rs = parseFloat(item.rs || '0') || 0;
      const ps = parseFloat(item.ps || '0') || 0;
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
    let processedValue = value;

    if (field === 'rs' || field === 'ps') {
      // Remove any non-digit characters
      const numericValue = value.replace(/[^0-9]/g, '');
      
      if (numericValue === '') {
        processedValue = ''; // Allow empty string for clearing input
      } else {
        if (field === 'ps') {
          // For paise, parse and cap at 99, then convert back to string
          processedValue = Math.min(parseInt(numericValue, 10), 99).toString();
        } else {
          // For rupees, just store the cleaned numeric string
          processedValue = numericValue;
        }
      }
    }

    newParticulars[index][field] = processedValue;
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

  // Function to reset form data to initial empty state
  const resetFormData = () => {
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
    setEditingVoucherId(null);
  };

  // Handle form submission (now handles both create and update)
  const handleSaveVoucher = async () => {
    // Validation Logic
    const errors = [];

    // Helper to get cleaned value for validation
    const getCleanedValue = (fieldValue) =>
      fieldValue.startsWith("Manual Entry:") ? fieldValue.replace("Manual Entry:", "").trim() : fieldValue.trim();

    if (!getCleanedValue(formData.name)) {
      errors.push("Name");
    }
    if (!getCleanedValue(formData.date)) {
      errors.push("Date");
    }
    if (!getCleanedValue(formData.paidTo)) {
      errors.push("Paid To");
    }
    if (!getCleanedValue(formData.debit)) {
      errors.push("Debit");
    }
    if (!getCleanedValue(formData.onAccountOf)) {
      errors.push("On A/C Of");
    }

    if (errors.length > 0) {
      const message = `Please fill in or select valid options for the following fields: ${errors.join(", ")}.`;
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
      messageBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
          <p class="text-xl font-semibold mb-4 text-red-600">${message}</p>
          <button id="closeMessageBox" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeMessageBox').onclick = () => {
        document.body.removeChild(messageBox);
      };
      return; // Stop submission if validation fails
    }


    // Extract actual values if "Manual Entry:" prefix is present
    const cleanValue = (value) =>
      value.startsWith("Manual Entry:") ? value.replace("Manual Entry:", "") : value;

    const voucherDataToSave = {
      ...formData,
      name: cleanValue(formData.name),
      paidTo: cleanValue(formData.paidTo),
      debit: cleanValue(formData.debit),
      onAccountOf: cleanValue(formData.onAccountOf),
      totalAmount: calculateTotal(),
      amountInWords: numberToWords(calculateTotal()), // Pass full calculated total
    };

    try {
      let response;
      if (editingVoucherId) {
        // Update existing voucher: uses API_ROOT_URL + /:id
        response = await axios.put(`${API_ROOT_URL}/${editingVoucherId}`, voucherDataToSave);
      } else {
        // Create new voucher: uses API_ROOT_URL (root of the router)
        response = await axios.post(API_ROOT_URL, voucherDataToSave);
      }

      console.log('API Operation Success:', response.data);
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity50 flex items-center justify-center z-50';
      messageBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
          <p class="text-xl font-semibold mb-4">Voucher ${editingVoucherId ? 'updated' : 'submitted'} successfully!</p>
          <button id="closeMessageBox" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeMessageBox').onclick = () => {
        document.body.removeChild(messageBox);
        resetFormData(); // Reset form after successful submission/update
        setViewMode('submitted'); // Go back to submitted list after save
      };
    } catch (error) {
      console.error('API Operation Error:', error);
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
      messageBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
          <p class="text-xl font-semibold mb-4">Failed to ${editingVoucherId ? 'update' : 'submit'} voucher. Error: ${error.response?.data?.error || error.message}</p>
          <button id="closeErrorMessageBox" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeErrorMessageBox').onclick = () => {
        document.body.removeChild(messageBox);
      };
    }
  };

  // Function to initiate printing from either form or submitted list
  const handlePrintInitiate = (voucherDataToPrint) => {
    setCurrentVoucherToPrint(voucherDataToPrint);
    setViewMode('print'); // Switch to print view
    // Use setTimeout to allow React to render the print view before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Function to initiate editing a voucher
  const handleEditInitiate = (voucherToEdit) => {
    // Populate formData with the voucher data
    const prepareValueForInput = (value, options) => {
      const optionExists = options.includes(value);
      if (optionExists) {
        return value;
      } else if (value) {
        return `Manual Entry:${value}`;
      }
      return "";
    };

    setFormData({
      ...voucherToEdit,
      name: prepareValueForInput(voucherToEdit.name, nameOptions),
      paidTo: prepareValueForInput(voucherToEdit.paidTo, paidToOptions),
      debit: prepareValueForInput(voucherToEdit.debit, debitOptions),
      onAccountOf: prepareValueForInput(voucherToEdit.onAccountOf, onAccountOfOptions),
      // Ensure particulars is an array, even if empty or single item
      particulars: voucherToEdit.particulars && voucherToEdit.particulars.length > 0
        ? voucherToEdit.particulars.map(item => ({
            ...item,
            rs: String(item.rs), // Ensure rs and ps are strings for input fields
            ps: String(item.ps)
          }))
        : [{ description: "", rs: "", ps: "" }],
    });
    setEditingVoucherId(voucherToEdit._id); // Changed to voucherToEdit._id
    setViewMode('form'); // Switch to form view
  };

  // Function to go back from print view
  const handleBackFromPrint = () => {
    setCurrentVoucherToPrint(null);
    // Go back to the previous view (either 'form' or 'submitted')
    setViewMode(prevMode => prevMode === 'submitted' ? 'submitted' : 'form');
  };

  // Function to go back to form from submitted list
  const handleBackToFormFromSubmitted = () => {
    resetFormData(); // Reset form when navigating back to it
    setViewMode('form');
  };


  // Export all submitted vouchers to Excel (CSV format)
  const exportToExcel = () => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center">
        <p class="text-xl font-semibold mb-4">Export functionality is now on the "Submitted Vouchers" page.</p>
        <button id="closeMessageBox" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">OK</button>
      </div>
    `;
    document.body.appendChild(messageBox);
    document.getElementById('closeMessageBox').onclick = () => {
    document.body.removeChild(messageBox);
    };
  };

  // Conditional Rendering based on viewMode
  if (viewMode === 'print') {
    return <PrintVoucherComponent voucherData={currentVoucherToPrint} onBack={handleBackFromPrint} />;
  }

  if (viewMode === 'submitted') {
    // Pass PrintVoucherComponent as a prop to SubmittedVouchersPage if it needs to render it
    // Or, as done here, directly render SubmittedVouchersPage which has its own logic
    return <SubmittedVouchersPage onPrintVoucher={handlePrintInitiate} onBackToForm={handleBackToFormFromSubmitted} onEditVoucher={handleEditInitiate} />;
  }

  // Default view: form
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
            Voucher Management System
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setViewMode('submitted')}
              className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
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
                  d="M9 17v-2m3 2v-4m3 2v-6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              View Submitted Vouchers
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
                {numberToWords(calculateTotal())}
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
                value="MADHUR JI"
                // value={formData.preparedBy}
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
              onClick={handleSaveVoucher}
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
              {editingVoucherId ? 'Update Voucher' : 'Submit Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default MainComponent;
