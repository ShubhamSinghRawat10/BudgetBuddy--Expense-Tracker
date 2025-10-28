import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const ExpenseItem = ({ expense, onEdit }) => {
  const { deleteExpense } = useExpense();
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expense.id);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-red-100 text-red-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-green-100 text-green-800',
      'Bills & Utilities': 'bg-yellow-100 text-yellow-800',
      'Healthcare': 'bg-pink-100 text-pink-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Travel': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 hover:shadow-lg hover:bg-white/80 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {expense.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {expense.date}
          </p>
          {expense.description && (
            <p className="text-gray-600 text-sm mb-2">
              {expense.description}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-red-600">-{formatCurrency(expense.amount, currency)}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
          {expense.category}
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(expense)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
