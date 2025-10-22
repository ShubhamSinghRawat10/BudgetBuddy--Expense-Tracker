import React, { useRef } from 'react';
import { useExpense } from '../context/ExpenseContext';

const Settings = () => {
  const { clearAllData, exportData, importData, expenses, totalIncome } = useExpense();
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importData(file);
      e.target.value = ''; // Reset file input
    }
  };

  const getStorageSize = () => {
    try {
      const expensesData = localStorage.getItem('expenseTracker_expenses') || '';
      const incomeData = localStorage.getItem('expenseTracker_income') || '';
      const totalSize = expensesData.length + incomeData.length;
      return (totalSize / 1024).toFixed(2); // Convert to KB
    } catch {
      return '0';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings & Data Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Export */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Data Export</h3>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-green-800">Export Data</h4>
              <button
                onClick={exportData}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm font-medium"
              >
                📥 Export
              </button>
            </div>
            <p className="text-sm text-green-700">
              Download all your expense data as a JSON file for backup purposes.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-800">Import Data</h4>
              <button
                onClick={handleImportClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium"
              >
                📤 Import
              </button>
            </div>
            <p className="text-sm text-blue-700">
              Import previously exported data to restore your expenses.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Data Management</h3>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-yellow-800">Clear All Data</h4>
              <button
                onClick={clearAllData}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition duration-200 text-sm font-medium"
              >
                🗑️ Clear
              </button>
            </div>
            <p className="text-sm text-yellow-700">
              Permanently delete all expenses and income data. This action cannot be undone.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Storage Information</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Expenses:</span>
                <span className="font-medium">{expenses.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Income:</span>
                <span className="font-medium">${totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Used:</span>
                <span className="font-medium">{getStorageSize()} KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Application Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-gray-800">Version</div>
            <div>1.0.0</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-gray-800">Framework</div>
            <div>React.js + Tailwind CSS</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-gray-800">Data Storage</div>
            <div>LocalStorage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
