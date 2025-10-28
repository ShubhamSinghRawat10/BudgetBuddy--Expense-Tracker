import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Summary from './components/Summary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Settings from './components/Settings';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

function AppContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', component: null },
    { id: 'expenses', label: '💰 Expenses', component: null },
    { id: 'profile', label: '👤 Profile', component: <UserProfile /> },
    { id: 'settings', label: '⚙️ Settings', component: <Settings /> }
  ];

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setActiveTab('expenses'); // Switch to expenses tab to show the form
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)` }}
    >
      <div className="absolute inset-0 bg-white/60"></div>
      {/* Background overlay only; decorative circles removed */}

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* User Profile Picture */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  💰Budget Buddy 
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome , {user?.firstName || user?.username}! Track all your expenses and manage your budget effectively
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* <div className="text-sm text-gray-500">
                Built by ❤️Shubham Singh Rawat
              </div> */}
              <button
                onClick={() => setActiveTab('profile')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-200 text-sm font-medium"
              >
                👤 Profile
              </button>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-200 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <>
            {/* Summary Section */}
            <Summary />
            
            {/* Form Section */}
            <ExpenseForm editingExpense={editingExpense} onEditComplete={() => setEditingExpense(null)} />
          </>
        )}
        
        {activeTab === 'expenses' && (
          <>
            {/* Form Section */}
            <ExpenseForm editingExpense={editingExpense} onEditComplete={() => setEditingExpense(null)} />
            
            {/* Expense List Section */}
            <ExpenseList onEditExpense={handleEditExpense} />
          </>
        )}
        
        {activeTab === 'profile' && (
          <UserProfile />
        )}
        
        {activeTab === 'settings' && (
          <Settings />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-md border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 💸Budget Buddy --- Built by ❤️Shubham Singh Rawat </p>
            <p className="mt-1">Track all your finances with ease .</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)` }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
