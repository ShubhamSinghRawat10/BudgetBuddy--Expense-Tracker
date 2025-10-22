import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useExpense } from '../context/ExpenseContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts = () => {
  const { expenses } = useExpense();

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Calculate expenses by month
  const expensesByMonth = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  // Chart colors
  const colors = [
    '#EF4444', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
    '#EC4899', '#6366F1', '#F97316', '#6B7280', '#14B8A6'
  ];

  // Pie Chart Data
  const pieData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: colors.slice(0, Object.keys(expensesByCategory).length),
        borderColor: colors.slice(0, Object.keys(expensesByCategory).length).map(color => color),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: Object.keys(expensesByMonth),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.values(expensesByMonth),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Spending Trends',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Expenses by Category',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Visualization</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No data to visualize</h3>
          <p className="text-gray-500">Add some expenses to see beautiful charts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Visualization</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="h-80">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="h-80">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Object.keys(expensesByCategory).length}
          </div>
          <div className="text-sm text-blue-800">Categories Used</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(expensesByMonth).length}
          </div>
          <div className="text-sm text-green-800">Months Tracked</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {expenses.length}
          </div>
          <div className="text-sm text-purple-800">Total Transactions</div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
