import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login process
    setTimeout(() => {
      if (formData.username && formData.password) {
        // Simple validation - in real app, this would be server-side
        const userData = {
          username: formData.username,
          loginTime: new Date().toISOString(),
          rememberMe: formData.rememberMe
        };
        
        login(userData);
      } else {
        setError('Please enter both username and password');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      username: 'demo_user',
      loginTime: new Date().toISOString(),
      rememberMe: false
    };
    login(demoUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-pink-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your finances with style
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/50"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/50"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition duration-200">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try the demo</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
            >
              🚀 Try Demo Version
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Don't have an account? 
              <a href="#" className="text-blue-600 hover:text-blue-800 ml-1 transition duration-200">
                Sign up here
              </a>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-700">Analytics</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">💾</div>
            <div className="text-sm font-medium text-gray-700">Secure</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-medium text-gray-700">Responsive</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
