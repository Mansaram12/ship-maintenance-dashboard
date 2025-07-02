import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, Trash2, AlertTriangle, Wrench, CheckCircle } from 'lucide-react';

export default function Notifications() {
  const { state, dispatch } = useApp();

  const userNotifications = state.notifications
    .filter(n => n.userId === state.currentUser?.id || state.currentUser?.role === 'Admin')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const handleMarkAllAsRead = () => {
    userNotifications.forEach(notification => {
      if (!notification.read) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
      }
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_created':
        return <Wrench className="h-5 w-5 text-blue-600" />;
      case 'job_updated':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'job_completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'maintenance_due':
        return <Bell className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    const baseColor = read ? 'bg-gray-50' : 'bg-blue-50';
    const borderColor = read ? 'border-gray-200' : 'border-blue-200';
    return `${baseColor} ${borderColor}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with maintenance activities and system alerts
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {userNotifications.length > 0 ? (
          userNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-xl p-6 transition-colors ${getNotificationColor(notification.type, notification.read)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-lg font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! No new notifications to display.</p>
          </div>
        )}
      </div>

      {/* Notification Types Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Job Created</h3>
              <p className="text-sm text-gray-600">New maintenance job assigned</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Job Updated</h3>
              <p className="text-sm text-gray-600">Job status or details changed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Job Completed</h3>
              <p className="text-sm text-gray-600">Maintenance work finished</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bell className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Maintenance Due</h3>
              <p className="text-sm text-gray-600">Scheduled maintenance reminder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}