import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import companyAccountService from '../services/companyAccountService';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const CompanyAccountPage = () => {
    const { companyBalance, setCompanyBalance } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [accountNumber, setAccountNumber] = useState(''); // For search
    const [accountDetails, setAccountDetails] = useState(null);
    const [allAccounts, setAllAccounts] = useState([]);
    const [newAccountData, setNewAccountData] = useState({
        accountName: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        balance: 0
    });
    const [addAmount, setAddAmount] = useState(0); // ✅ For user input

    // Fetch all accounts on mount
    useEffect(() => {
        const fetchAllAccounts = async () => {
            setLoading(true);
            try {
                const response = await companyAccountService.getAllAccounts();
                setAllAccounts(response?.data || []);
            } catch (err) {
                setError('Failed to fetch all accounts');
            } finally {
                setLoading(false);
            }
        };
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
            setError('Failed to fetch account details');
            setAccountDetails(null);
            setCompanyBalance(0);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFunds = async () => {
        if (!accountDetails?.accountNumber) return;
        if (!addAmount || addAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await companyAccountService.addFunds(accountDetails.accountNumber, addAmount);
            await fetchAccountDetails(accountDetails.accountNumber);
            setAddAmount(0); // reset input
        } catch (err) {
            setError('Failed to add funds');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!accountNumber) {
            setError('Please enter an account number');
            return;
        }
        fetchAccountDetails(accountNumber);
    };

    const handleCreateAccount = async () => {
        setLoading(true);
        setError(null);
        try {
            await companyAccountService.createAccount(newAccountData);
            const response = await companyAccountService.getAllAccounts();
            setAllAccounts(response?.data || []);
            setNewAccountData({
                accountName: '',
                bankName: '',
                branchName: '',
                accountNumber: '',
                balance: 0
            });
        } catch (err) {
            setError('Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Company Account Management</h1>

            {/* Search Account */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                <Button onClick={handleSearch} style={{ marginLeft: '10px' }}>
                    Search
                </Button>
            </div>

            {loading && <Spinner />}
            {error && <div className="error-message">{error}</div>}

            {/* Display searched account */}
            {accountDetails && (
                <div style={{ marginBottom: '30px' }}>
                    <p>Account Name: {accountDetails.accountName}</p>
                    <p>Bank: {accountDetails.bankName}</p>
                    <p>Branch: {accountDetails.branchName}</p>
                    <p>Account Number: {accountDetails.accountNumber}</p>
                    <p>Balance: {accountDetails.balance?.toLocaleString()} Taka</p>

                    {/* Add Funds Input */}
                    <div style={{ marginTop: '10px' }}>
                        <input
                            type="number"
                            placeholder="Enter amount to add"
                            value={addAmount}
                            onChange={(e) => setAddAmount(Number(e.target.value))}
                        />
                        <Button onClick={handleAddFunds} style={{ marginLeft: '10px' }}>
                            Add Funds
                        </Button>
                    </div>
                </div>
            )}

            {/* Create New Account */}
            <h2>Create New Account</h2>
            <input
                type="text"
                placeholder="Account Name"
                value={newAccountData.accountName}
                onChange={(e) => setNewAccountData({ ...newAccountData, accountName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Bank Name"
                value={newAccountData.bankName}
                onChange={(e) => setNewAccountData({ ...newAccountData, bankName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Branch Name"
                value={newAccountData.branchName}
                onChange={(e) => setNewAccountData({ ...newAccountData, branchName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Account Number"
                value={newAccountData.accountNumber}
                onChange={(e) => setNewAccountData({ ...newAccountData, accountNumber: e.target.value })}
            />
            <input
                type="number"
                placeholder="Balance"
                value={newAccountData.balance}
                onChange={(e) => setNewAccountData({ ...newAccountData, balance: Number(e.target.value) })}
            />
            <Button onClick={handleCreateAccount}>Create Account</Button>

            {/* All Accounts Table */}
            <h2>All Company Accounts</h2>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Account Name</th>
                        <th>Bank</th>
                        <th>Branch</th>
                        <th>Account Number</th>
                        <th>Balance</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {allAccounts.map((acc) => (
                        <tr key={acc.accountNumber}>
                            <td>{acc.accountName}</td>
                            <td>{acc.bankName}</td>
                            <td>{acc.branchName}</td>
                            <td>{acc.accountNumber}</td>
                            <td>{acc.balance?.toLocaleString()}</td>
                            <td>
                                <Button onClick={() => fetchAccountDetails(acc.accountNumber)}>View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompanyAccountPage;
