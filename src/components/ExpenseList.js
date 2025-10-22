import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ onEditExpense }) => {
  const { expenses } = useExpense();
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const categories = [
    'All Categories',
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  const filteredExpenses = expenses.filter(expense => 
    filterCategory === '' || filterCategory === 'All Categories' || expense.category === filterCategory
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'date':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Expense History
        </h2>
        <div className="text-sm text-gray-600">
          {sortedExpenses.length} expense{sortedExpenses.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            id="categoryFilter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category === 'All Categories' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Date (Newest First)</option>
            <option value="amount">Amount (Highest First)</option>
            <option value="title">Title (A-Z)</option>
            <option value="category">Category (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Expense List */}
      {sortedExpenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {filterCategory ? 'No expenses found in this category' : 'No expenses yet'}
          </h3>
          <p className="text-gray-500">
            {filterCategory ? 'Try selecting a different category' : 'Add your first expense to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedExpenses.map(expense => (
            <ExpenseItem key={expense.id} expense={expense} onEdit={onEditExpense} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
