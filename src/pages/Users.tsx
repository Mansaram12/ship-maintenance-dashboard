import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users as UsersIcon, Plus, Edit, Trash2, Search, Shield, User } from 'lucide-react';

export default function Users() {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Only admins can access this page
  if (state.currentUser?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = state.users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Inspector':
        return 'bg-blue-100 text-blue-800';
      case 'Engineer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-5 w-5" />;
      case 'Inspector':
        return <Search className="h-5 w-5" />;
      case 'Engineer':
        return <User className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  // Get user statistics
  const getUserStats = (userId: string) => {
    const userJobs = state.jobs.filter(job => job.assignedEngineerId === userId);
    const completedJobs = userJobs.filter(job => job.status === 'Completed');
    const activeJobs = userJobs.filter(job => job.status === 'Open' || job.status === 'In Progress');
    
    return {
      totalJobs: userJobs.length,
      completedJobs: completedJobs.length,
      activeJobs: activeJobs.length,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const stats = getUserStats(user.id);
          
          return (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span>{user.role}</span>
                    </span>
                  </div>
                </div>

                {user.role === 'Engineer' && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Jobs:</span>
                      <span className="font-medium">{stats.totalJobs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium text-green-600">{stats.completedJobs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active:</span>
                      <span className="font-medium text-blue-600">{stats.activeJobs}</span>
                    </div>
                    {stats.totalJobs > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completion Rate:</span>
                        <span className="font-medium">
                          {Math.round((stats.completedJobs / stats.totalJobs) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    <p>User ID: {user.id}</p>
                    <p>Account Status: Active</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'No users are currently in the system'
            }
          </p>
        </div>
      )}

      {/* Role Descriptions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Admin</h3>
              <p className="text-sm text-gray-600">Full system access, can manage all ships, components, jobs, and users</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Inspector</h3>
              <p className="text-sm text-gray-600">Can view all data, manage ships and create maintenance jobs</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Engineer</h3>
              <p className="text-sm text-gray-600">Can view ships, manage components, and update assigned maintenance jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}