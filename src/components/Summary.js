import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import Charts from './Charts';

const Summary = () => {
  const { totalIncome, totalExpenses, balance, expenses, setIncome } = useExpense();
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState(totalIncome.toString());

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    const income = parseFloat(newIncome);
    if (!isNaN(income) && income >= 0) {
      setIncome(income);
      setIsEditingIncome(false);
    }
  };

  const handleIncomeCancel = () => {
    setNewIncome(totalIncome.toString());
    setIsEditingIncome(false);
  };

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-red-500',
      'Transportation': 'bg-blue-500',
      'Shopping': 'bg-purple-500',
      'Entertainment': 'bg-green-500',
      'Bills & Utilities': 'bg-yellow-500',
      'Healthcare': 'bg-pink-500',
      'Education': 'bg-indigo-500',
      'Travel': 'bg-orange-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Summary</h2>
        
        {/* Income Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Monthly Income</h3>
            {!isEditingIncome && (
              <button
                onClick={() => setIsEditingIncome(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>
          
          {isEditingIncome ? (
            <form onSubmit={handleIncomeSubmit} className="flex space-x-2">
              <input
                type="number"
                value={newIncome}
                onChange={(e) => setNewIncome(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleIncomeCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </form>
          ) : (
            <p className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </p>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-1">Total Expenses</h4>
            <p className="text-xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${balance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <h4 className={`text-sm font-medium mb-1 ${balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              Balance
            </h4>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {totalIncome > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Expense Ratio</span>
              <span>{((totalExpenses / totalIncome) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  (totalExpenses / totalIncome) > 0.8 ? 'bg-red-500' :
                  (totalExpenses / totalIncome) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((totalExpenses / totalIncome) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Top Categories */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Categories</h2>
        
        {topCategories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📊</div>
            <p className="text-gray-500">No expenses to categorize yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                  <span className="text-gray-700 font-medium">{category}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-800">
                    ${amount.toFixed(2)}
                  </span>
                  <div className="text-xs text-gray-500">
                    {((amount / totalExpenses) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Charts Section */}
      <Charts />
    </div>
  );
};

export default Summary;
