import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Save } from 'lucide-react';
import { Component } from '../types';

interface ComponentFormProps {
  component?: Component | null;
  shipId?: string;
  onClose: () => void;
}

export default function ComponentForm({ component, shipId, onClose }: ComponentFormProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: component?.name || '',
    serialNumber: component?.serialNumber || '',
    installDate: component?.installDate || '',
    lastMaintenanceDate: component?.lastMaintenanceDate || '',
    nextMaintenanceDate: component?.nextMaintenanceDate || '',
    status: component?.status || 'Good',
    shipId: component?.shipId || shipId || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }

    if (!formData.installDate) {
      newErrors.installDate = 'Install date is required';
    }

    if (!formData.lastMaintenanceDate) {
      newErrors.lastMaintenanceDate = 'Last maintenance date is required';
    }

    if (!formData.shipId) {
      newErrors.shipId = 'Ship is required';
    }

    // Validate dates
    if (formData.installDate && formData.lastMaintenanceDate) {
      if (new Date(formData.installDate) > new Date(formData.lastMaintenanceDate)) {
        newErrors.lastMaintenanceDate = 'Last maintenance date cannot be before install date';
      }
    }

    if (formData.lastMaintenanceDate && formData.nextMaintenanceDate) {
      if (new Date(formData.lastMaintenanceDate) >= new Date(formData.nextMaintenanceDate)) {
        newErrors.nextMaintenanceDate = 'Next maintenance date must be after last maintenance date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const componentData: Component = {
      id: component?.id || `c${Date.now()}`,
      name: formData.name.trim(),
      serialNumber: formData.serialNumber.trim(),
      installDate: formData.installDate,
      lastMaintenanceDate: formData.lastMaintenanceDate,
      nextMaintenanceDate: formData.nextMaintenanceDate || undefined,
      status: formData.status as Component['status'],
      shipId: formData.shipId,
    };

    if (component) {
      dispatch({ type: 'UPDATE_COMPONENT', payload: componentData });
    } else {
      dispatch({ type: 'ADD_COMPONENT', payload: componentData });
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {component ? 'Edit Component' : 'Add New Component'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!shipId && (
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
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Component Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter component name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Serial Number *
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.serialNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter serial number"
            />
            {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>}
          </div>

          <div>
            <label htmlFor="installDate" className="block text-sm font-medium text-gray-700 mb-2">
              Install Date *
            </label>
            <input
              type="date"
              id="installDate"
              name="installDate"
              value={formData.installDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.installDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.installDate && <p className="mt-1 text-sm text-red-600">{errors.installDate}</p>}
          </div>

          <div>
            <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-700 mb-2">
              Last Maintenance Date *
            </label>
            <input
              type="date"
              id="lastMaintenanceDate"
              name="lastMaintenanceDate"
              value={formData.lastMaintenanceDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lastMaintenanceDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.lastMaintenanceDate && <p className="mt-1 text-sm text-red-600">{errors.lastMaintenanceDate}</p>}
          </div>

          <div>
            <label htmlFor="nextMaintenanceDate" className="block text-sm font-medium text-gray-700 mb-2">
              Next Maintenance Date
            </label>
            <input
              type="date"
              id="nextMaintenanceDate"
              name="nextMaintenanceDate"
              value={formData.nextMaintenanceDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nextMaintenanceDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.nextMaintenanceDate && <p className="mt-1 text-sm text-red-600">{errors.nextMaintenanceDate}</p>}
          </div>

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
              <option value="Good">Good</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
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
              <span>{component ? 'Update Component' : 'Add Component'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}