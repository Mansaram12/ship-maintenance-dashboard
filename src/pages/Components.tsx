import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Plus, Edit, Trash2, Search, Filter, Ship, Calendar } from 'lucide-react';
import ComponentForm from '../components/ComponentForm';

export default function Components() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shipFilter, setShipFilter] = useState('all');

  const canManageComponents = state.currentUser?.role === 'Admin' || state.currentUser?.role === 'Engineer';

  const filteredComponents = state.components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || component.status === statusFilter;
    const matchesShip = shipFilter === 'all' || component.shipId === shipFilter;
    return matchesSearch && matchesStatus && matchesShip;
  });

  const handleDelete = (componentId: string) => {
    if (window.confirm('Are you sure you want to delete this component? This will also delete all associated maintenance jobs.')) {
      dispatch({ type: 'DELETE_COMPONENT', payload: componentId });
    }
  };

  const handleEdit = (component: any) => {
    setEditingComponent(component);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingComponent(null);
  };

  const getStatusColor = (status: string) => {
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

  const isMaintenanceOverdue = (nextMaintenanceDate?: string) => {
    if (!nextMaintenanceDate) return false;
    return new Date(nextMaintenanceDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Components</h1>
          <p className="text-gray-600">Manage ship components and maintenance schedules</p>
        </div>
        {canManageComponents && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Component</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search components..."
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
              <option value="Good">Good</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="relative">
            <Ship className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => {
          const ship = state.ships.find(s => s.id === component.shipId);
          const componentJobs = state.jobs.filter(j => j.componentId === component.id);
          const activeJobs = componentJobs.filter(j => j.status === 'Open' || j.status === 'In Progress');
          const isOverdue = isMaintenanceOverdue(component.nextMaintenanceDate);

          return (
            <div key={component.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{component.name}</h3>
                      <p className="text-sm text-gray-600">S/N: {component.serialNumber}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(component.status)}`}>
                      {component.status}
                    </span>
                    {isOverdue && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ship:</span>
                    <span className="font-medium">{ship?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Installed:</span>
                    <span className="font-medium">{new Date(component.installDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Maintenance:</span>
                    <span className="font-medium">{new Date(component.lastMaintenanceDate).toLocaleDateString()}</span>
                  </div>
                  {component.nextMaintenanceDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Maintenance:</span>
                      <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                        {new Date(component.nextMaintenanceDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Jobs:</span>
                    <span className="font-medium">{activeJobs.length}</span>
                  </div>
                </div>

                {canManageComponents && (
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(component)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Edit component"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(component.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete component"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || shipFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding components to your ships'
            }
          </p>
          {canManageComponents && !searchTerm && statusFilter === 'all' && shipFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Component</span>
            </button>
          )}
        </div>
      )}

      {/* Component Form Modal */}
      {showForm && (
        <ComponentForm
          component={editingComponent}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}