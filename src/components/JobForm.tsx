import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Save } from 'lucide-react';
import { MaintenanceJob } from '../types';

interface JobFormProps {
  job?: MaintenanceJob | null;
  onClose: () => void;
}

export default function JobForm({ job, onClose }: JobFormProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    shipId: job?.shipId || '',
    componentId: job?.componentId || '',
    type: job?.type || 'Inspection',
    priority: job?.priority || 'Medium',
    status: job?.status || 'Open',
    assignedEngineerId: job?.assignedEngineerId || '',
    scheduledDate: job?.scheduledDate || '',
    description: job?.description || '',
    notes: job?.notes || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter components based on selected ship
  const availableComponents = state.components.filter(c => c.shipId === formData.shipId);
  const engineers = state.users.filter(u => u.role === 'Engineer');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.shipId) {
      newErrors.shipId = 'Ship is required';
    }

    if (!formData.componentId) {
      newErrors.componentId = 'Component is required';
    }

    if (!formData.assignedEngineerId) {
      newErrors.assignedEngineerId = 'Assigned engineer is required';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const jobData: MaintenanceJob = {
      id: job?.id || `j${Date.now()}`,
      shipId: formData.shipId,
      componentId: formData.componentId,
      type: formData.type as MaintenanceJob['type'],
      priority: formData.priority as MaintenanceJob['priority'],
      status: formData.status as MaintenanceJob['status'],
      assignedEngineerId: formData.assignedEngineerId,
      scheduledDate: formData.scheduledDate,
      description: formData.description.trim(),
      notes: formData.notes.trim() || undefined,
      createdAt: job?.createdAt || new Date().toISOString().split('T')[0],
      completedDate: formData.status === 'Completed' ? (job?.completedDate || new Date().toISOString().split('T')[0]) : undefined,
    };

    if (job) {
      dispatch({ type: 'UPDATE_JOB', payload: jobData });
      
      // Create notification for job update
      const notification = {
        id: `n${Date.now()}`,
        type: 'job_updated' as const,
        title: 'Job Status Updated',
        message: `${jobData.type} job for ${state.ships.find(s => s.id === jobData.shipId)?.name} has been updated to ${jobData.status}`,
        timestamp: new Date().toISOString(),
        read: false,
        userId: jobData.assignedEngineerId,
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    } else {
      dispatch({ type: 'ADD_JOB', payload: jobData });
      
      // Create notification for new job
      const notification = {
        id: `n${Date.now()}`,
        type: 'job_created' as const,
        title: 'New Job Created',
        message: `${jobData.type} job has been created for ${state.ships.find(s => s.id === jobData.shipId)?.name}`,
        timestamp: new Date().toISOString(),
        read: false,
        userId: jobData.assignedEngineerId,
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset component when ship changes
      if (name === 'shipId') {
        newData.componentId = '';
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {job ? 'Edit Maintenance Job' : 'Create New Maintenance Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="shipId" className="block text-sm font-medium text-gray-700 mb-2">
                Ship *
              </label>
              <select
                id="shipId"
                name="shipId"
                value={formData.shipId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.shipId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a ship</option>
                {state.ships.map(ship => (
                  <option key={ship.id} value={ship.id}>{ship.name}</option>
                ))}
              </select>
              {errors.shipId && <p className="mt-1 text-sm text-red-600">{errors.shipId}</p>}
            </div>

            <div>
              <label htmlFor="componentId" className="block text-sm font-medium text-gray-700 mb-2">
                Component *
              </label>
              <select
                id="componentId"
                name="componentId"
                value={formData.componentId}
                onChange={handleChange}
                disabled={!formData.shipId}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.componentId ? 'border-red-300' : 'border-gray-300'
                } ${!formData.shipId ? 'bg-gray-100' : ''}`}
              >
                <option value="">Select a component</option>
                {availableComponents.map(component => (
                  <option key={component.id} value={component.id}>{component.name}</option>
                ))}
              </select>
              {errors.componentId && <p className="mt-1 text-sm text-red-600">{errors.componentId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Inspection">Inspection</option>
                <option value="Repair">Repair</option>
                <option value="Replacement">Replacement</option>
                <option value="Preventive">Preventive</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label htmlFor="assignedEngineerId" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Engineer *
              </label>
              <select
                id="assignedEngineerId"
                name="assignedEngineerId"
                value={formData.assignedEngineerId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.assignedEngineerId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select an engineer</option>
                {engineers.map(engineer => (
                  <option key={engineer.id} value={engineer.id}>{engineer.name}</option>
                ))}
              </select>
              {errors.assignedEngineerId && <p className="mt-1 text-sm text-red-600">{errors.assignedEngineerId}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Date *
            </label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the maintenance work to be performed..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes or comments..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{job ? 'Update Job' : 'Create Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}