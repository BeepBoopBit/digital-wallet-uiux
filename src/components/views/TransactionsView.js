import React, { useState, useEffect, useContext } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function TransactionsView() {
  const { authState } = useContext(AuthContext);
  const { userId, token } = authState;
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const accountsResponse = await axios.get(`http://localhost:9506/api/bank-accounts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const accounts = accountsResponse.data;
        let allTransactions = [];

        for (const account of accounts) {
          const transactionsResponse = await axios.get(`http://localhost:9501/api/transaction/user/${account.bankAccountId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          allTransactions = allTransactions.concat(transactionsResponse.data.map(transaction => ({
            id: transaction.transactionId,
            date: `${transaction.createdYear}-${String(transaction.createdMonth).padStart(2, '0')}-${String(transaction.createdDay).padStart(2, '0')}`,
            description: transaction.description,
            amount: transaction.amount
          })));
        }

        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (userId && token) {
      fetchTransactions();
    }
  }, [userId, token]);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center bg-white shadow rounded-lg p-2">
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          placeholder="Search transactions..."
          className="flex-grow outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsView;