import React, { useEffect, useState } from 'react';

// ----------------------------------------------------------------
// FIX: Mocking missing dependencies to make the component runnable
// ----------------------------------------------------------------

// Mock Spinner component
const Spinner = () => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
);

// Utility function to format currency
const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('en-US');
};

// Mock Table Component for sheet history (simplified for display)
const SheetHistoryTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-center py-4">No salary sheets available.</p>;
    }
    
    // Define table headers
    const headers = ['ID', 'Date', 'Employees', 'Salary Paid', 'Balance After', 'Status'];

    // Map sheet data to table rows
    const rows = data.map((sheet, index) => (
        <tr key={sheet.id} className={index % 2 !== 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{sheet.id}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{sheet.generatedDate}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">{sheet.totalEmployees}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600 text-right">{formatCurrency(sheet.salaryDetails)} Taka</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-right text-indigo-600">{formatCurrency(sheet.companyBalanceAfter)} Taka</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                <span className={`font-medium text-xs px-2 py-0.5 rounded-full 
                    ${sheet.failedCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {sheet.successfulCount} Success / {sheet.failedCount} Failed
                </span>
            </td>
        </tr>
    ));

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header) => (
                            <th 
                                key={header}
                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {rows}
                </tbody>
            </table>
        </div>
    );
};

// Mock Detailed Table (for single sheet view)
const DetailedSheetTable = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 text-center py-4">No employee details found for this sheet.</p>;
    
    const headers = ['ID', 'Name', 'Grade', 'Total Salary (Taka)'];
    
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md mt-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                    <tr>
                        {headers.map(header => (
                            <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-800">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map(emp => (
                        <tr key={emp.employeeId} className='hover:bg-blue-50'>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{emp.employeeId}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{emp.employeeName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{emp.grade}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-right text-green-700">{formatCurrency(emp.totalSalary)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// Mock Report Service (Replaces '../services/reportService')
const reportService = {
    // Mock for summary
    getCompanySummary: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { 
            totalPaidSalary: 378000, 
            remainingBalance: 14627260, 
            totalEmployees: 11, 
            accountNumber: '1001001001' 
        };
    },
    // Mock for all sheets history
    getAllSalarySheets: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: 'S003', generatedDate: '2025-10-21', totalEmployees: 11, salaryDetails: 378000, companyBalanceBefore: 8870510, companyBalanceAfter: 8492510, successfulCount: 11, failedCount: 0 },
            { id: 'S002', generatedDate: '2025-09-20', totalEmployees: 10, salaryDetails: 344250, companyBalanceBefore: 10003750, companyBalanceAfter: 9659500, successfulCount: 10, failedCount: 0 },
            { id: 'S001', generatedDate: '2025-08-20', totalEmployees: 10, salaryDetails: 344250, companyBalanceBefore: 510000, companyBalanceAfter: 165750, successfulCount: 9, failedCount: 1 },
        ];
    },
    // Mock for single sheet details
    getSalarySheet: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (id === 'S003') {
            return {
                sheetId: id,
                generatedDate: '2025-10-21',
                salaryDetails: [
                    { employeeId: 'E001', employeeName: 'Alice Johnson', grade: 'A5', basicSalary: 50000, houseRent: 20000, medicalAllowance: 5000, totalSalary: 75000 },
                    { employeeId: 'E002', employeeName: 'Bob Smith', grade: 'B3', basicSalary: 45000, houseRent: 18000, medicalAllowance: 4000, totalSalary: 67000 },
                    { employeeId: 'E003', employeeName: 'Charlie Brown', grade: 'C1', basicSalary: 30000, houseRent: 12000, medicalAllowance: 3000, totalSalary: 45000 },
                    { employeeId: 'E004', employeeName: 'Diana Prince', grade: 'A2', basicSalary: 60000, houseRent: 25000, medicalAllowance: 6000, totalSalary: 91000 },
                    { employeeId: 'E005', employeeName: 'Eve Harrington', grade: 'B5', basicSalary: 35000, houseRent: 14000, medicalAllowance: 3500, totalSalary: 52500 },
                    { employeeId: 'E006', employeeName: 'Frank Sinatra', grade: 'C3', basicSalary: 25000, houseRent: 10000, medicalAllowance: 2500, totalSalary: 37500 },
                ]
            };
        }
        throw new Error(`Sheet ID ${id} not found.`);
    },
    // Mock for generation
    generateSalarySheet: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Simulate a successful generation
        return true; 
    }
};

// ----------------------------------------------------------------
// END MOCKING
// ----------------------------------------------------------------


const ReportsPage = () => {
  const accountNumber = '1001001001';

  const [salarySheets, setSalarySheets] = useState([]);
  const [companySummary, setCompanySummary] = useState(null);
  const [singleSheet, setSingleSheet] = useState(null);
  const [sheetId, setSheetId] = useState('');

  const [loadingSheets, setLoadingSheets] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState(null);
  const [generateMessage, setGenerateMessage] = useState('');

  // Fetch all salary sheets
  const fetchAllSheets = async () => {
    setLoadingSheets(true);
    setError(null);
    try {
      const sheets = await reportService.getAllSalarySheets();
      setSalarySheets(sheets);
    } catch (err) {
      setError(err.message || 'Failed to fetch all sheets');
    } finally {
      setLoadingSheets(false);
    }
  };

  // Fetch company summary
  const fetchCompanySummary = async () => {
    setLoadingSummary(true);
    setError(null);
    try {
      const summary = await reportService.getCompanySummary(accountNumber);
      setCompanySummary(summary);
    } catch (err) {
      setError(err.message || 'Failed to fetch company summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch single sheet by ID
  const fetchSingleSheet = async () => {
    if (!sheetId) return;
    setLoadingSheet(true);
    setSingleSheet(null);
    setError(null);
    try {
      const sheet = await reportService.getSalarySheet(sheetId.trim());
      setSingleSheet(sheet);
    } catch (err) {
      setError(err.message || `Failed to fetch sheet ID: ${sheetId}`);
    } finally {
      setLoadingSheet(false);
    }
  };

  // Generate salary sheet
  const generateSheet = async () => {
    setGenerating(true);
    setError(null);
    setGenerateMessage('');
    try {
      await reportService.generateSalarySheet({ accountNumber });
      setGenerateMessage('Salary sheet generated successfully!');
      // Refresh both summary and sheets after successful generation
      await fetchAllSheets(); 
      await fetchCompanySummary();
    } catch (err) {
      setError(err.message || 'Failed to generate sheet');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchAllSheets();
    fetchCompanySummary();
  }, []);

  // Stat Card configuration
  const statCards = companySummary ? [
    { title: "Last Paid Salary", value: formatCurrency(companySummary.totalPaidSalary) + ' Taka', color: 'text-indigo-600', icon: '💸' },
    { title: "Remaining Balance", value: formatCurrency(companySummary.remainingBalance) + ' Taka', color: 'text-green-600', icon: '💰' },
    { title: "Total Employees", value: companySummary.totalEmployees.toLocaleString(), color: 'text-blue-600', icon: '👥' },
    { title: "Account Number", value: companySummary.accountNumber, color: 'text-gray-600', icon: '🏦' },
  ] : [];

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Salary Reports Dashboard</h1>

      {/* Global Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* --- 1. Company Summary --- */}
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Company Summary</h2>
      {loadingSummary ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-lg border-b-4 border-indigo-400 transition hover:shadow-xl">
                    <div className={`text-3xl mb-1 ${card.color}`}>{card.icon}</div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className={`text-xl font-bold mt-1 ${card.color}`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
      )}

      {/* --- 2. Action Block (Generate Sheet and Fetch Single Sheet) --- */}
      <div className="bg-white p-6 rounded-xl shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
              
              {/* Generate Sheet */}
              <div className="flex-1 p-4 border border-gray-200 rounded-lg bg-green-50">
                  <h3 className="text-lg font-semibold text-green-700 mb-3">Generate Monthly Sheet</h3>
                  <div className='flex items-center gap-4'>
                      <button 
                          onClick={generateSheet} 
                          disabled={generating}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-150 disabled:opacity-50"
                      >
                          {generating ? 'Generating...' : 'Generate Sheet'}
                      </button>
                      {generating && <Spinner />}
                  </div>
                  {generateMessage && <p className="mt-3 text-sm text-green-600 font-medium">{generateMessage}</p>}
              </div>

              {/* Fetch Single Sheet */}
              <div className="flex-1 p-4 border border-gray-200 rounded-lg bg-blue-50">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3">Get Salary Sheet by ID</h3>
                  <div className="flex gap-2">
                      <input
                          type="text"
                          placeholder="Enter Sheet ID (e.g., S003)"
                          value={sheetId}
                          onChange={(e) => setSheetId(e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button 
                          onClick={fetchSingleSheet} 
                          disabled={loadingSheet || !sheetId.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 disabled:opacity-50"
                      >
                          {loadingSheet ? 'Fetching...' : 'Fetch Sheet'}
                      </button>
                  </div>
                  {singleSheet && (
                      <div className="sheet-details mt-4 p-4 border border-blue-200 rounded-lg bg-white">
                          <h4 className='font-bold text-blue-800'>Sheet Details: {singleSheet.sheetId} ({singleSheet.generatedDate})</h4>
                          {singleSheet.salaryDetails && singleSheet.salaryDetails.length > 0 ? (
                            <DetailedSheetTable data={singleSheet.salaryDetails} />
                          ) : (
                            <p className="text-gray-500 mt-2">No employee data found.</p>
                          )}
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* --- 3. All Salary Sheets History --- */}
      <div className="all-sheets bg-white p-6 rounded-xl shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">All Salary Sheets History</h2>
        {loadingSheets ? (
          <Spinner />
        ) : salarySheets && salarySheets.length > 0 ? (
          <SheetHistoryTable data={salarySheets} />
        ) : (
          <p className="text-gray-600 text-center py-4">No salary sheets available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
