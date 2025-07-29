"use client";
import React from "react";
import axios from 'axios'; // Import axios for making HTTP requests

// Define the base URL for your Render API, without the specific resource path
const API_ROOT_URL = 'https://nestoria-voucher-api.onrender.com/api/nestoria-payment-voucher';

function SubmittedVouchersPage({ onPrintVoucher, onBackToForm, onEditVoucher }) {
  const [submittedVouchers, setSubmittedVouchers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState(''); // New state for search query

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

export default SubmittedVouchersPage;
