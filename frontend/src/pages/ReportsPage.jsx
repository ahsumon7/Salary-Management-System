import React, { useEffect, useState } from 'react';
import reportService from '../services/reportService';
import Table from '../components/common/Table';
import Spinner from '../components/common/Spinner';

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
    setError(null);
    try {
      const sheet = await reportService.getSalarySheet(sheetId);
      setSingleSheet(sheet);
    } catch (err) {
      setError(err.message || 'Failed to fetch sheet');
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
      setGenerateMessage('Salary sheet generated successfully');
      await fetchAllSheets(); // refresh all sheets
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

  return (
    <div className="container">
      <h1>Salary Reports</h1>

      {error && <div className="error">{error}</div>}

      {/* Company Summary */}
      {loadingSummary ? (
        <Spinner />
      ) : (
        companySummary && (
          <div className="company-summary">
            <h2>Company Summary</h2>
            <p>Total Paid Salary: {companySummary.totalPaidSalary}</p>
            <p>Remaining Balance: {companySummary.remainingBalance}</p>
            <p>Total Employees: {companySummary.totalEmployees}</p>
            <p>Account Number: {companySummary.accountNumber}</p>
          </div>
        )
      )}

      {/* Generate Sheet */}
      <div className="generate-sheet">
        <h2>Generate Salary Sheet</h2>
        <button onClick={generateSheet} disabled={generating}>
          {generating ? 'Generating...' : 'Generate Sheet'}
        </button>
        {generateMessage && <p>{generateMessage}</p>}
      </div>

      {/* Fetch Single Sheet */}
      <div className="single-sheet">
        <h2>Get Salary Sheet by ID</h2>
        <input
          type="text"
          placeholder="Enter Sheet ID"
          value={sheetId}
          onChange={(e) => setSheetId(e.target.value)}
        />
        <button onClick={fetchSingleSheet} disabled={loadingSheet}>
          {loadingSheet ? 'Fetching...' : 'Fetch Sheet'}
        </button>

        {singleSheet && (
          <div className="sheet-details">
            {singleSheet.salaryDetails && singleSheet.salaryDetails.length > 0 ? (
              <Table data={singleSheet.salaryDetails} />
            ) : (
              <pre>{JSON.stringify(singleSheet, null, 2)}</pre>
            )}
          </div>
        )}
      </div>

      {/* All Salary Sheets */}
      <div className="all-sheets">
        <h2>All Salary Sheets</h2>
        {loadingSheets ? (
          <Spinner />
        ) : salarySheets && salarySheets.length > 0 ? (
          <Table data={salarySheets} />
        ) : (
          <p>No salary sheets available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
