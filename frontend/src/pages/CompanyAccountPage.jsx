import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import companyAccountService from '../services/companyAccountService';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const CompanyAccountPage = () => {
    const { setCompanyBalance } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [accountNumber, setAccountNumber] = useState(''); // For search
    const [accountDetails, setAccountDetails] = useState(null);
    const [allAccounts, setAllAccounts] = useState([]);
    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false); // NEW STATE
    const [newAccountData, setNewAccountData] = useState({
        accountName: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        balance: 0
    });
    const [addAmount, setAddAmount] = useState(0);

    // --- Data Fetching Logic (unchanged) ---

    const fetchAllAccounts = async () => {
        setLoading(true);
        try {
            const response = await companyAccountService.getAllAccounts();
            setAllAccounts(response?.data || []);
        } catch (err) {
            setError('Failed to fetch all accounts.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAccounts();
    }, []);

    const fetchAccountDetails = async (number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await companyAccountService.getCompanyAccount(number);
            const data = response?.data || null;
            setAccountDetails(data);
            setCompanyBalance(data?.balance || 0);
        } catch (err) {
            setError(`Account ${number} not found or failed to fetch details.`);
            setAccountDetails(null);
            setCompanyBalance(0);
        } finally {
            setLoading(false);
        }
    };

    // --- Handler Logic ---

    const handleAddFunds = async () => {
        if (!accountDetails?.accountNumber) return;
        if (addAmount <= 0) {
            setError('Please enter a valid amount greater than 0.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await companyAccountService.addFunds(accountDetails.accountNumber, addAmount);
            await fetchAccountDetails(accountDetails.accountNumber);
            setAddAmount(0); // reset input
        } catch (err) {
            setError('Failed to add funds. Check server logs.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!accountNumber) {
            setError('Please enter an account number to search.');
            return;
        }
        fetchAccountDetails(accountNumber);
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!newAccountData.accountName || !newAccountData.accountNumber || newAccountData.balance < 0) {
             setError('Please fill out all required fields and ensure balance is non-negative.');
             return;
        }
        
        setLoading(true);
        setError(null);
        try {
            await companyAccountService.createAccount(newAccountData);
            await fetchAllAccounts(); // Re-fetch all accounts
            // Hide the form and reset data on success
            setIsCreateFormVisible(false); 
            setNewAccountData({
                accountName: '', bankName: '', branchName: '', accountNumber: '', balance: 0
            });
        } catch (err) {
            setError('Failed to create account. Account number may already exist.');
        } finally {
            setLoading(false);
        }
    };
    
    // --- Render ---
    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">🏦 Company Account Management</h1>

            {loading && <div className="text-center py-4"><Spinner /></div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            {/* Account Search and Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">Search Account & Add Funds</h2>
                
                {/* Search Input */}
                <div className="flex space-x-3 mb-4">
                    <input
                        type="text"
                        placeholder="Enter Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Button 
                        onClick={handleSearch} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150"
                    >
                        Search
                    </Button>
                </div>

                {/* Display searched account (unchanged) */}
                {accountDetails && (
                    <div className="border border-indigo-200 p-4 rounded-lg bg-indigo-50 mt-4">
                        <p className="font-semibold text-lg mb-2">Account Details</p>
                        <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                            <p><strong>Name:</strong> {accountDetails.accountName}</p>
                            <p><strong>Bank:</strong> {accountDetails.bankName}</p>
                            <p><strong>Branch:</strong> {accountDetails.branchName}</p>
                            <p><strong>Number:</strong> {accountDetails.accountNumber}</p>
                        </div>
                        <p className="text-xl font-bold mt-3 text-green-700">
                            Current Balance: {accountDetails.balance?.toLocaleString()} Taka
                        </p>

                        {/* Add Funds Input */}
                        <div className="flex space-x-3 mt-4 pt-4 border-t border-indigo-200">
                            <input
                                type="number"
                                placeholder="Enter amount to add"
                                value={addAmount || ''}
                                onChange={(e) => setAddAmount(Number(e.target.value))}
                                className="flex-grow p-2 border border-gray-300 rounded-lg"
                            />
                            <Button 
                                onClick={handleAddFunds}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150"
                                disabled={!accountDetails || addAmount <= 0}
                            >
                                Add Funds
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Create New Account Button & Conditional Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-600">
                        {isCreateFormVisible ? 'Fill Account Details' : 'Create New Account'}
                    </h2>
                    <Button 
                        onClick={() => setIsCreateFormVisible(!isCreateFormVisible)}
                        className={`font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 ${
                            isCreateFormVisible 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isCreateFormVisible ? 'Cancel' : '+ New Account'}
                    </Button>
                </div>
                
                {/* Form is only rendered when isCreateFormVisible is true */}
                {isCreateFormVisible && (
                    <form onSubmit={handleCreateAccount} className="grid grid-cols-2 gap-4 pt-2">
                        <input
                            type="text"
                            placeholder="Account Name *"
                            required
                            value={newAccountData.accountName}
                            onChange={(e) => setNewAccountData({ ...newAccountData, accountName: e.target.value })}
                            className="col-span-2 p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Bank Name"
                            value={newAccountData.bankName}
                            onChange={(e) => setNewAccountData({ ...newAccountData, bankName: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Branch Name"
                            value={newAccountData.branchName}
                            onChange={(e) => setNewAccountData({ ...newAccountData, branchName: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Account Number *"
                            required
                            value={newAccountData.accountNumber}
                            onChange={(e) => setNewAccountData({ ...newAccountData, accountNumber: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Initial Balance (0 or greater) *"
                            required
                            value={newAccountData.balance}
                            onChange={(e) => setNewAccountData({ ...newAccountData, balance: Number(e.target.value) })}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                        <Button 
                            type="submit"
                            className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 mt-2"
                        >
                            Confirm Create Account
                        </Button>
                    </form>
                )}
            </div>

            {/* All Accounts Table Card (unchanged from last update) */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">All Company Accounts</h2>
                
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Account Name', 'Bank', 'Branch', 'Account Number', 'Balance', 'Action'].map(header => (
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
                            {allAccounts.map((acc, index) => (
                                <tr 
                                    key={acc.accountNumber} 
                                    className={index % 2 !== 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{acc.accountName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{acc.bankName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{acc.branchName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{acc.accountNumber}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                                        {acc.balance?.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => fetchAccountDetails(acc.accountNumber)}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allAccounts.length === 0 && !loading && (
                         <p className="text-center py-4 text-gray-500">No company accounts found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyAccountPage;