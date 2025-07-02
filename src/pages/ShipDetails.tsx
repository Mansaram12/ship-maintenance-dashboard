import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Ship, Package, Wrench, Plus, Edit } from 'lucide-react';
import ComponentForm from '../components/ComponentForm';

export default function ShipDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const [showComponentForm, setShowComponentForm] = useState(false);

  const ship = state.ships.find(s => s.id === id);
  const shipComponents = state.components.filter(c => c.shipId === id);
  const shipJobs = state.jobs.filter(j => j.shipId === id);

  const canManageComponents = state.currentUser?.role === 'Admin' || state.currentUser?.role === 'Engineer';

  if (!ship) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Ship not found</h3>
          <button
            onClick={() => navigate('/ships')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Ships
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComponentStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-green-100 text-green-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeJobs = shipJobs.filter(j => j.status === 'Open' || j.status === 'In Progress');
  const completedJobs = shipJobs.filter(j => j.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/ships')}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{ship.name}</h1>
          <p className="text-gray-600">Ship Details and Management</p>
        </div>
      </div>

      {/* Ship Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Ship className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{ship.name}</h2>
              <p className="text-gray-600">IMO: {ship.imo}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(ship.status)}`}>
            {ship.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Flag</h3>
            <p className="text-lg font-semibold text-gray-900">{ship.flag}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Components</h3>
            <p className="text-lg font-semibold text-gray-900">{shipComponents.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Active Jobs</h3>
            <p className="text-lg font-semibold text-gray-900">{activeJobs.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Inspection</h3>
            <p className="text-lg font-semibold text-gray-900">
              {ship.lastInspection ? new Date(ship.lastInspection).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Components Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Components</h2>
            </div>
            {canManageComponents && (
              <button
                onClick={() => setShowComponentForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Component</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {shipComponents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shipComponents.map(component => (
                <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{component.name}</h3>
                      <p className="text-sm text-gray-600">S/N: {component.serialNumber}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getComponentStatusColor(component.status)}`}>
                      {component.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Installed:</span>
                      <span>{new Date(component.installDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Maintenance:</span>
                      <span>{new Date(component.lastMaintenanceDate).toLocaleDateString()}</span>
                    </div>
                    {component.nextMaintenanceDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Maintenance:</span>
                        <span className={new Date(component.nextMaintenanceDate) < new Date() ? 'text-red-600' : ''}>
                          {new Date(component.nextMaintenanceDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No components</h3>
              <p className="text-gray-600 mb-4">This ship doesn't have any components yet.</p>
              {canManageComponents && (
                <button
                  onClick={() => setShowComponentForm(true)}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Component</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Jobs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wrench className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Maintenance Jobs</h2>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Jobs
            </button>
          </div>
        </div>

        <div className="p-6">
          {shipJobs.length > 0 ? (
            <div className="space-y-4">
              {shipJobs.slice(0, 5).map(job => {
                const component = state.components.find(c => c.id === job.componentId);
                const engineer = state.users.find(u => u.id === job.assignedEngineerId);
                return (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.type}</h3>
                        <p className="text-sm text-gray-600">{component?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{job.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Assigned to: {engineer?.name}</span>
                      <span>Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance jobs</h3>
              <p className="text-gray-600">This ship doesn't have any maintenance jobs yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Component Form Modal */}
      {showComponentForm && (
        <ComponentForm
          shipId={ship.id}
          onClose={() => setShowComponentForm(false)}
        />
      )}
    </div>
  );
}