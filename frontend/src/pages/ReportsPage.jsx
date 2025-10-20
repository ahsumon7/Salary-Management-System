import React, { useEffect, useState } from 'react';
import reportService from '../services/reportService'; // default import
import Table from '../components/common/Table';
import Spinner from '../components/common/Spinner';

const ReportsPage = () => {
  const [salarySheets, setSalarySheets] = useState([]);
  const [companySummary, setCompanySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const sheets = await reportService.getAllSalarySheets();
        const summary = await reportService.getCompanySummary('YOUR_ACCOUNT_NUMBER'); // pass account number here
        setSalarySheets(sheets);
        setCompanySummary(summary);
      } catch (err) {
        setError(err.message || 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <Spinner />;

  if (error) return <div className='error'>Error: {error}</div>;

  return (
    <div className='container'>
      <h1>Salary Reports</h1>

      {companySummary && (
        <div className='company-summary'>
          <h2>Company Summary</h2>
          <p>Total Paid Salary: {companySummary.totalPaidSalary}</p>
          <p>Remaining Balance: {companySummary.remainingBalance}</p>
        </div>
      )}

      <Table data={salarySheets} />
    </div>
  );
};

export default ReportsPage;
