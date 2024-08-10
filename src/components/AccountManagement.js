import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Trash2 } from 'react-feather';
import { AuthContext } from './context/AuthContext';

const AccountManagement = () => {
  const { authState } = useContext(AuthContext);
  const { userId, token } = authState;
  const [accounts, setAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`http://localhost:9506/api/bank-accounts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        });
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    if (userId && token) {
      fetchAccounts();
    }
  }, [userId, token]);

  const handleRemoveAccount = (accountId) => {
    // Implement remove account logic here
  };

  const handleAddAccount = (event) => {
    event.preventDefault();
    // Implement add account logic here
  };

  return (
    <div>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Your Accounts</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {accounts.map(account => (
            <li key={account.bankAccountId} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600 truncate">{account.email}</p>
                  <p className="text-sm text-gray-500">{account.accountType}</p>
                </div>
                <div className="flex items-center">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${account.balance.toFixed(2)}
                  </p>
                  <button onClick={() => handleRemoveAccount(account.bankAccountId)} className="ml-2 text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <form onSubmit={handleAddAccount} className="flex items-center space-x-2">
          <input
            type="text"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            placeholder="Account Name"
            className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Add Account</button>
        </form>
      </div>
    </div>
  );
};

export default AccountManagement;