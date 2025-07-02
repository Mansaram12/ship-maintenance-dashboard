import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Ship, 
  Wrench, 
  Calendar, 
  Bell, 
  BarChart3, 
  Settings,
  Users,
  Package
} from 'lucide-react';

export default function Sidebar() {
  const { state } = useApp();
  const user = state.currentUser;

  const navigationItems = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard', roles: ['Admin', 'Inspector', 'Engineer'] },
    { to: '/ships', icon: Ship, label: 'Ships', roles: ['Admin', 'Inspector', 'Engineer'] },
    { to: '/components', icon: Package, label: 'Components', roles: ['Admin', 'Engineer'] },
    { to: '/jobs', icon: Wrench, label: 'Maintenance Jobs', roles: ['Admin', 'Inspector', 'Engineer'] },
    { to: '/calendar', icon: Calendar, label: 'Calendar', roles: ['Admin', 'Inspector', 'Engineer'] },
    { to: '/notifications', icon: Bell, label: 'Notifications', roles: ['Admin', 'Inspector', 'Engineer'] },
    { to: '/users', icon: Users, label: 'Users', roles: ['Admin'] },
  ];

  const visibleItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center space-x-3">
          <Ship className="h-8 w-8 text-blue-300" />
          <div>
            <h1 className="text-xl font-bold">Ship Maintenance</h1>
            <p className="text-blue-300 text-sm">ENTNT Maritime</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-blue-300">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}