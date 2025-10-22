import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Load data from localStorage
const loadFromStorage = () => {
  try {
    const savedExpenses = localStorage.getItem('expenseTracker_expenses');
    const savedIncome = localStorage.getItem('expenseTracker_income');
    return {
      expenses: savedExpenses ? JSON.parse(savedExpenses) : [],
      totalIncome: savedIncome ? parseFloat(savedIncome) : 0,
      totalExpenses: 0,
      balance: 0
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {
      expenses: [],
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0
    };
  }
};

// Initial state
const initialState = loadFromStorage();

// Action types
const ActionTypes = {
  ADD_EXPENSE: 'ADD_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  SET_INCOME: 'SET_INCOME',
  CALCULATE_TOTALS: 'CALCULATE_TOTALS'
};

// Reducer function
const expenseReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_EXPENSE:
      const newExpenses = [...state.expenses, action.payload];
      return {
        ...state,
        expenses: newExpenses,
        totalExpenses: newExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        balance: state.totalIncome - newExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      };
    
    case ActionTypes.DELETE_EXPENSE:
      const filteredExpenses = state.expenses.filter(expense => expense.id !== action.payload);
      return {
        ...state,
        expenses: filteredExpenses,
        totalExpenses: filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        balance: state.totalIncome - filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      };
    
    case ActionTypes.UPDATE_EXPENSE:
      const updatedExpenses = state.expenses.map(expense =>
        expense.id === action.payload.id ? action.payload : expense
      );
      return {
        ...state,
        expenses: updatedExpenses,
        totalExpenses: updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        balance: state.totalIncome - updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      };
    
    case ActionTypes.SET_INCOME:
      return {
        ...state,
        totalIncome: action.payload,
        balance: action.payload - state.totalExpenses
      };
    
    case ActionTypes.CALCULATE_TOTALS:
      const totalExp = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        ...state,
        totalExpenses: totalExp,
        balance: state.totalIncome - totalExp
      };
    
    default:
      return state;
  }
};

// Create context
const ExpenseContext = createContext();

// Save to localStorage functions
const saveExpensesToStorage = (expenses) => {
  try {
    localStorage.setItem('expenseTracker_expenses', JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses to localStorage:', error);
  }
};

const saveIncomeToStorage = (income) => {
  try {
    localStorage.setItem('expenseTracker_income', income.toString());
  } catch (error) {
    console.error('Error saving income to localStorage:', error);
  }
};

// Provider component
export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveExpensesToStorage(state.expenses);
  }, [state.expenses]);

  useEffect(() => {
    saveIncomeToStorage(state.totalIncome);
  }, [state.totalIncome]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: ActionTypes.ADD_EXPENSE, payload: newExpense });
  };

  const deleteExpense = (id) => {
    dispatch({ type: ActionTypes.DELETE_EXPENSE, payload: id });
  };

  const updateExpense = (expense) => {
    dispatch({ type: ActionTypes.UPDATE_EXPENSE, payload: expense });
  };

  const setIncome = (income) => {
    dispatch({ type: ActionTypes.SET_INCOME, payload: income });
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('expenseTracker_expenses');
      localStorage.removeItem('expenseTracker_income');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = {
      expenses: state.expenses,
      totalIncome: state.totalIncome,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.expenses && Array.isArray(data.expenses)) {
          // Clear existing data
          localStorage.removeItem('expenseTracker_expenses');
          localStorage.removeItem('expenseTracker_income');
          
          // Set new data
          data.expenses.forEach(expense => {
            dispatch({ type: ActionTypes.ADD_EXPENSE, payload: expense });
          });
          if (data.totalIncome) {
            dispatch({ type: ActionTypes.SET_INCOME, payload: data.totalIncome });
          }
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Error importing data: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const value = {
    ...state,
    addExpense,
    deleteExpense,
    updateExpense,
    setIncome,
    clearAllData,
    exportData,
    importData
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
