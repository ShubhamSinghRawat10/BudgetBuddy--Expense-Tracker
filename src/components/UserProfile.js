import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, logout, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profilePicture: user?.profilePicture || null,
    currency: user?.currency || 'USD',
    dateFormat: user?.dateFormat || 'MM/DD/YYYY',
    theme: user?.theme || 'light'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
  ];

  const themes = [
    { value: 'light', label: 'Light Theme', icon: '☀️' },
    { value: 'dark', label: 'Dark Theme', icon: '🌙' },
    { value: 'auto', label: 'Auto (System)', icon: '🔄' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        setIsUploading(false);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        setIsUploading(false);
        return;
      }

      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: event.target.result
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Update user data using AuthContext
    updateProfile(profileData);
    setIsEditing(false);
    
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      profilePicture: user?.profilePicture || null,
      currency: user?.currency || 'USD',
      dateFormat: user?.dateFormat || 'MM/DD/YYYY',
      theme: user?.theme || 'light'
    });
    setIsEditing(false);
  };

  const removeProfilePicture = () => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: null
    }));
  };

  const getInitials = () => {
    const first = profileData.firstName?.charAt(0) || user?.username?.charAt(0) || 'U';
    const last = profileData.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-200 shadow-lg"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  '📷'
                )}
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {profileData.firstName && profileData.lastName 
                ? `${profileData.firstName} ${profileData.lastName}`
                : user?.username || 'User Profile'
              }
            </h1>
            <p className="text-gray-600 mb-2">
              {profileData.email || 'No email provided'}
            </p>
            <p className="text-sm text-gray-500">
              Member since {new Date(user?.loginTime || Date.now()).toLocaleDateString()}
            </p>
            
            {profileData.bio && (
              <p className="text-gray-700 mt-2 italic">
                "{profileData.bio}"
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 font-medium"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
                >
                  💾 Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Edit Profile Information' : 'Profile Information'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your location"
              />
            </div>
          </div>

          {/* Preferences & Bio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preferences & Bio</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={profileData.currency}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select
                name="dateFormat"
                value={profileData.dateFormat}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {dateFormats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme Preference
              </label>
              <select
                name="theme"
                value={profileData.theme}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {themes.map(theme => (
                  <option key={theme.value} value={theme.value}>
                    {theme.icon} {theme.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Profile Picture Actions */}
        {isEditing && profileData.profilePicture && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Picture</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={profileData.profilePicture}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                >
                  📷 Change Picture
                </button>
                <button
                  onClick={removeProfilePicture}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm"
                >
                  🗑️ Remove Picture
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-200 font-medium"
          >
            🚪 Logout
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                localStorage.removeItem('expenseTracker_user');
                localStorage.removeItem('expenseTracker_expenses');
                localStorage.removeItem('expenseTracker_income');
                window.location.reload();
              }
            }}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition duration-200 font-medium"
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
