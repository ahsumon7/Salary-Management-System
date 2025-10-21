import React, { useEffect, useState } from 'react';
import api from '../api/api'; // your Axios instance with auth headers
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner'; // Assuming you have a Spinner component
import Button from '../components/common/Button'; // Assuming you have a styled Button component

const SalaryReportPage = () => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/v1/salary/all');
        if (response.data.success) {
          // Ensure all salary components are numbers for calculation/display
          const formattedData = response.data.data.map(emp => ({
            ...emp,
            basicSalary: Number(emp.basicSalary || 0),
            houseRent: Number(emp.houseRent || 0),
            medicalAllowance: Number(emp.medicalAllowance || 0),
            totalSalary: Number(emp.totalSalary || 0),
          }));
          setSalaries(formattedData);
        } else {
          setError('API returned success: false');
        }
      } catch (error) {
        console.error('Error fetching salary report:', error);
        setError('Failed to load salary data. Please check the network connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  const totalSalaryPaid = salaries.reduce((sum, emp) => sum + (emp.totalSalary || 0), 0);

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl text-center py-20">
        <Spinner />
        <p className="mt-4 text-gray-600">Loading salary data...</p>
      </div>
    );
  }
  
  // Use a comma separated function for cleaner display
  const formatCurrency = (amount) => amount.toLocaleString('en-US');

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">💰 Monthly Salary Sheet</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {salaries.length === 0 && !error ? (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-gray-600">No salary records found for this period.</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">Employee Payroll Summary</h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Employee ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Grade</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Basic Salary (Taka)</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">House Rent (Taka)</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Medical Allowance (Taka)</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-800 bg-yellow-100">Total Salary (Taka)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map((emp, index) => (
                  <tr 
                    key={emp.employeeId} 
                    className={index % 2 !== 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{emp.employeeId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{emp.employeeName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{emp.grade}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">{formatCurrency(emp.basicSalary)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">{formatCurrency(emp.houseRent)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">{formatCurrency(emp.medicalAllowance)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-right text-green-700 bg-yellow-50">{formatCurrency(emp.totalSalary)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-indigo-50 font-extrabold text-indigo-800">
                  <td colSpan="6" className="py-3 px-4 text-right border-t border-indigo-200 text-lg">GRAND TOTAL PAYROLL:</td>
                  <td className="py-3 px-4 border-t border-indigo-200 text-right text-lg text-green-700">
                    {formatCurrency(totalSalaryPaid)} Taka
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-start gap-4">
        <Button
          onClick={() => navigate('/dashboard')}
          // Using the styled Button component for consistent look
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
        >
          ← Back to Dashboard
        </Button>
        {/* Placeholder for Print/Export button */}
        {salaries.length > 0 && (
            <Button
              // You'd implement print logic here, maybe window.print()
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
            >
              🖨️ Print Report
            </Button>
        )}
      </div>
    </div>
  );
};

export default SalaryReportPage;