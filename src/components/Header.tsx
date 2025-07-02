import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, LogOut, User } from 'lucide-react';

export default function Header() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {state.currentUser?.name}
          </h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Bell className="h-6 w-6" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-800">{state.currentUser?.name}</p>
              <p className="text-gray-600">{state.currentUser?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}