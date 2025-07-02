import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Ship, Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import ShipForm from '../components/ShipForm';

export default function Ships() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingShip, setEditingShip] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const canManageShips = state.currentUser?.role === 'Admin' || state.currentUser?.role === 'Inspector';

  const filteredShips = state.ships.filter(ship => {
    const matchesSearch = ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ship.imo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ship.flag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (shipId: string) => {
    if (window.confirm('Are you sure you want to delete this ship? This will also delete all associated components and jobs.')) {
      dispatch({ type: 'DELETE_SHIP', payload: shipId });
    }
  };

  const handleEdit = (ship: any) => {
    setEditingShip(ship);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingShip(null);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ships</h1>
          <p className="text-gray-600">Manage your fleet vessels</p>
        </div>
        {canManageShips && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Ship</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search ships by name, IMO, or flag..."
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
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ships List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShips.map((ship) => {
          const shipComponents = state.components.filter(c => c.shipId === ship.id);
          const shipJobs = state.jobs.filter(j => j.shipId === ship.id);
          const activeJobs = shipJobs.filter(j => j.status === 'Open' || j.status === 'In Progress');

          return (
            <div key={ship.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Ship className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{ship.name}</h3>
                      <p className="text-sm text-gray-600">IMO: {ship.imo}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ship.status)}`}>
                    {ship.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Flag:</span>
                    <span className="font-medium">{ship.flag}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Components:</span>
                    <span className="font-medium">{shipComponents.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Jobs:</span>
                    <span className="font-medium">{activeJobs.length}</span>
                  </div>
                  {ship.lastInspection && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Inspection:</span>
                      <span className="font-medium">{new Date(ship.lastInspection).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/ships/${ship.id}`)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  
                  {canManageShips && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(ship)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Edit ship"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ship.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete ship"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredShips.length === 0 && (
        <div className="text-center py-12">
          <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ships found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first ship to the fleet'
            }
          </p>
          {canManageShips && !searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Ship</span>
            </button>
          )}
        </div>
      )}

      {/* Ship Form Modal */}
      {showForm && (
        <ShipForm
          ship={editingShip}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}