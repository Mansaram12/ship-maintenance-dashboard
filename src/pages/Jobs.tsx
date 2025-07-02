import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, Plus, Edit, Trash2, Search, Filter, AlertTriangle, Calendar, User } from 'lucide-react';
import JobForm from '../components/JobForm';

export default function Jobs() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [shipFilter, setShipFilter] = useState('all');

  const canManageJobs = state.currentUser?.role === 'Admin' || state.currentUser?.role === 'Inspector';
  const canEditJobs = canManageJobs || state.currentUser?.role === 'Engineer';

  const filteredJobs = state.jobs.filter(job => {
    const ship = state.ships.find(s => s.id === job.shipId);
    const component = state.components.find(c => c.id === job.componentId);
    
    const matchesSearch = job.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ship?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    const matchesShip = shipFilter === 'all' || job.shipId === shipFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesShip;
  });

  const handleDelete = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance job?')) {
      dispatch({ type: 'DELETE_JOB', payload: jobId });
    }
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (scheduledDate: string, status: string) => {
    return new Date(scheduledDate) < new Date() && status !== 'Completed';
  };

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    // Sort by priority first (Critical, High, Medium, Low)
    const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by scheduled date
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Jobs</h1>
          <p className="text-gray-600">Track and manage maintenance tasks</p>
        </div>
        {canManageJobs && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Job</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div className="relative">
            <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={shipFilter}
              onChange={(e) => setShipFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Ships</option>
              {state.ships.map(ship => (
                <option key={ship.id} value={ship.id}>{ship.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {sortedJobs.map((job) => {
          const ship = state.ships.find(s => s.id === job.shipId);
          const component = state.components.find(c => c.id === job.componentId);
          const engineer = state.users.find(u => u.id === job.assignedEngineerId);
          const overdueJob = isOverdue(job.scheduledDate, job.status);

          return (
            <div key={job.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${
              overdueJob ? 'border-l-red-500' : 
              job.priority === 'Critical' ? 'border-l-red-500' :
              job.priority === 'High' ? 'border-l-orange-500' :
              job.priority === 'Medium' ? 'border-l-yellow-500' :
              'border-l-green-500'
            } border-t border-r border-b border-gray-200`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wrench className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.type}</h3>
                        {overdueJob && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      </div>
                      <p className="text-gray-600 mb-2">{job.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{ship?.name} - {component?.name}</span>
                        <span>•</span>
                        <span>Assigned to: {engineer?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Scheduled:</span>
                    <span className={`font-medium ${overdueJob ? 'text-red-600' : ''}`}>
                      {new Date(job.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Engineer:</span>
                    <span className="font-medium">{engineer?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {job.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{job.notes}</p>
                  </div>
                )}

                {canEditJobs && (
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(job)}
                      className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    {canManageJobs && (
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-800 font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sortedJobs.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || shipFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first maintenance job'
            }
          </p>
          {canManageJobs && !searchTerm && statusFilter === 'all' && priorityFilter === 'all' && shipFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Job</span>
            </button>
          )}
        </div>
      )}

      {/* Job Form Modal */}
      {showForm && (
        <JobForm
          job={editingJob}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}