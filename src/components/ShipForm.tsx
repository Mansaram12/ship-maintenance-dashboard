import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Save } from 'lucide-react';
import { Ship } from '../types';

interface ShipFormProps {
  ship?: Ship | null;
  onClose: () => void;
}

export default function ShipForm({ ship, onClose }: ShipFormProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: ship?.name || '',
    imo: ship?.imo || '',
    flag: ship?.flag || '',
    status: ship?.status || 'Active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ship name is required';
    }

    if (!formData.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imo)) {
      newErrors.imo = 'IMO number must be 7 digits';
    }

    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const shipData: Ship = {
      id: ship?.id || `s${Date.now()}`,
      name: formData.name.trim(),
      imo: formData.imo.trim(),
      flag: formData.flag.trim(),
      status: formData.status as Ship['status'],
      createdAt: ship?.createdAt || new Date().toISOString().split('T')[0],
      lastInspection: ship?.lastInspection,
    };

    if (ship) {
      dispatch({ type: 'UPDATE_SHIP', payload: shipData });
    } else {
      dispatch({ type: 'ADD_SHIP', payload: shipData });
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
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {ship ? 'Edit Ship' : 'Add New Ship'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ship Name *
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
              placeholder="Enter ship name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="imo" className="block text-sm font-medium text-gray-700 mb-2">
              IMO Number *
            </label>
            <input
              type="text"
              id="imo"
              name="imo"
              value={formData.imo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.imo ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter 7-digit IMO number"
              maxLength={7}
            />
            {errors.imo && <p className="mt-1 text-sm text-red-600">{errors.imo}</p>}
          </div>

          <div>
            <label htmlFor="flag" className="block text-sm font-medium text-gray-700 mb-2">
              Flag *
            </label>
            <input
              type="text"
              id="flag"
              name="flag"
              value={formData.flag}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.flag ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter flag country"
            />
            {errors.flag && <p className="mt-1 text-sm text-red-600">{errors.flag}</p>}
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
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Inactive">Inactive</option>
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
              <span>{ship ? 'Update Ship' : 'Add Ship'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}