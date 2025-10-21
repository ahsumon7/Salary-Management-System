import React, { useEffect, useState } from 'react';
import api from '../api/api'; // your Axios instance with auth headers
import { useNavigate } from 'react-router-dom';

const SalaryReportPage = () => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await api.get('/api/v1/salary/all');
        if (response.data.success) {
          setSalaries(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching salary report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  const totalSalaryPaid = salaries.reduce((sum, emp) => sum + (emp.totalSalary || 0), 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Salary Sheet</h1>

      {loading ? (
        <p>Loading salary data...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Employee ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Grade</th>
                  <th className="py-2 px-4 border-b">Basic Salary</th>
                  <th className="py-2 px-4 border-b">House Rent</th>
                  <th className="py-2 px-4 border-b">Medical Allowance</th>
                  <th className="py-2 px-4 border-b">Total Salary</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map(emp => (
                  <tr key={emp.employeeId} className="text-center">
                    <td className="py-2 px-4 border-b">{emp.employeeId}</td>
                    <td className="py-2 px-4 border-b">{emp.employeeName}</td>
                    <td className="py-2 px-4 border-b">{emp.grade}</td>
                    <td className="py-2 px-4 border-b">{emp.basicSalary.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{emp.houseRent.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{emp.medicalAllowance.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b font-semibold">{emp.totalSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-200 font-bold">
                  <td colSpan="6" className="py-2 px-4 text-right border-t">Total Salary Paid:</td>
                  <td className="py-2 px-4 border-t">{totalSalaryPaid.toLocaleString()} Taka</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 flex justify-start gap-4 flex-wrap">
            <button
              className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SalaryReportPage;
