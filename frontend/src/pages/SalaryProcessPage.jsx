import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getSalarySheet,
  processSalaryTransfer,
  addFundsToCompanyAccount,
} from "../services/salaryTransferService";
import { Button, Input, Modal } from "../components/common";

const SalaryProcessPage = () => {
  const { user } = useAuth();
  const [salaryData, setSalaryData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fundsToAdd, setFundsToAdd] = useState("");
  const [loading, setLoading] = useState(false);

  const accountNumber = user?.companyAccount?.accountNumber || "1001001001";

  // ✅ Load salary sheet
  const loadSalarySheet = async () => {
    try {
      setLoading(true);
      const response = await getSalarySheet(accountNumber);
      if (response.success && response.data) {
        setSalaryData(response.data);
      }
    } catch (err) {
      console.error("Error loading salary sheet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountNumber) loadSalarySheet();
  }, [accountNumber]);

  // ✅ Process salary
  const handleSalaryProcess = async () => {
    try {
      setLoading(true);
      const result = await processSalaryTransfer(accountNumber);
      if (result.success) {
        alert("Salary transfer processed successfully!");
        setSalaryData(result.data);
      } else {
        alert(result.message || "Salary processing failed");
      }
    } catch (err) {
      console.error("Error processing salary:", err);
      alert("Salary processing failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add funds
  const handleAddFunds = async () => {
    if (!fundsToAdd || Number(fundsToAdd) <= 0)
      return alert("Enter a valid amount");
    try {
      const result = await addFundsToCompanyAccount(accountNumber, fundsToAdd);
      if (result.success) {
        alert("Funds added successfully!");
        setFundsToAdd("");
        setShowModal(false);
        await loadSalarySheet();
      }
    } catch (err) {
      console.error("Error adding funds:", err);
      alert("Failed to add funds");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        💼 Salary Processing
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p>
            <strong>Account Number:</strong> {accountNumber}
          </p>
          <p>
            <strong>Company Balance:</strong>{" "}
            {salaryData?.companyBalanceAfter?.toLocaleString() || 0} Taka
          </p>
          <p>
            <strong>Total Paid Salary:</strong>{" "}
            {salaryData?.totalPaidSalary?.toLocaleString() || 0} Taka
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSalaryProcess}>Process Salaries</Button>
          <Button onClick={() => setShowModal(true)}>Add Funds</Button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Funds to Company Account"
      >
        <Input
          type="number"
          placeholder="Enter amount (e.g., 10000)"
          value={fundsToAdd}
          onChange={(e) => setFundsToAdd(e.target.value)}
        />
        <Button onClick={handleAddFunds} className="mt-3 w-full">
          Add Funds
        </Button>
      </Modal>

      <h2 className="text-xl font-semibold mt-6 mb-3">🧾 Salary Sheet</h2>

      {salaryData?.salaryDetails?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Employee Name</th>
                <th className="border px-3 py-2">Grade</th>
                <th className="border px-3 py-2">Basic</th>
                <th className="border px-3 py-2">House Rent</th>
                <th className="border px-3 py-2">Medical</th>
                <th className="border px-3 py-2">Total</th>
                <th className="border px-3 py-2">Payment Date</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.salaryDetails.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{item.employeeName}</td>
                  <td className="border px-3 py-2">{item.grade}</td>
                  <td className="border px-3 py-2">{item.basicSalary}</td>
                  <td className="border px-3 py-2">{item.houseRent}</td>
                  <td className="border px-3 py-2">{item.medicalAllowance}</td>
                  <td className="border px-3 py-2">{item.totalSalary}</td>
                  <td className="border px-3 py-2">{item.paymentDate}</td>
                  <td
                    className={`border px-3 py-2 font-medium ${
                      item.status === "SUCCESS"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Total Employees:</strong>{" "}
              {salaryData.totalEmployees || salaryData.salaryDetails.length}
            </p>
            <p>
              <strong>Generated Date:</strong> {salaryData.generatedDate}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No salary data available.</p>
      )}
    </div>
  );
};

export default SalaryProcessPage;
