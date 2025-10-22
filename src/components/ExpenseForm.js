import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

const ExpenseForm = ({ editingExpense, onEditComplete }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { addExpense, updateExpense, expenses } = useExpense();

  // Handle external editing
  React.useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        description: editingExpense.description || ''
      });
      setIsEditing(true);
      setEditingId(editingExpense.id);
    }
  }, [editingExpense]);

  const categories = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (isEditing) {
      updateExpense({ ...expenseData, id: editingId });
      setIsEditing(false);
      setEditingId(null);
      if (onEditComplete) onEditComplete();
    } else {
      addExpense(expenseData);
    }

    setFormData({
      title: '',
      amount: '',
      category: '',
      description: ''
    });
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || ''
    });
    setIsEditing(true);
    setEditingId(expense.id);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      amount: '',
      category: '',
      description: ''
    });
    if (onEditComplete) onEditComplete();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter expense title"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter expense description (optional)"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
          
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
