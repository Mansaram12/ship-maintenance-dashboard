import React from 'react';
import { useApp } from '../context/AppContext';
import { Ship, Package, Wrench, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { state } = useApp();

  // Calculate KPIs
  const totalShips = state.ships.length;
  const activeShips = state.ships.filter(ship => ship.status === 'Active').length;
  const totalComponents = state.components.length;
  const criticalComponents = state.components.filter(comp => comp.status === 'Critical').length;
  const totalJobs = state.jobs.length;
  const openJobs = state.jobs.filter(job => job.status === 'Open').length;
  const inProgressJobs = state.jobs.filter(job => job.status === 'In Progress').length;
  const completedJobs = state.jobs.filter(job => job.status === 'Completed').length;

  // Chart data
  const shipStatusData = [
    { name: 'Active', value: state.ships.filter(s => s.status === 'Active').length, color: '#10b981' },
    { name: 'Under Maintenance', value: state.ships.filter(s => s.status === 'Under Maintenance').length, color: '#f59e0b' },
    { name: 'Inactive', value: state.ships.filter(s => s.status === 'Inactive').length, color: '#ef4444' },
  ];

  const jobStatusData = [
    { name: 'Open', value: openJobs, color: '#3b82f6' },
    { name: 'In Progress', value: inProgressJobs, color: '#f59e0b' },
    { name: 'Completed', value: completedJobs, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'Low', value: state.jobs.filter(j => j.priority === 'Low').length },
    { name: 'Medium', value: state.jobs.filter(j => j.priority === 'Medium').length },
    { name: 'High', value: state.jobs.filter(j => j.priority === 'High').length },
    { name: 'Critical', value: state.jobs.filter(j => j.priority === 'Critical').length },
  ];

  const recentJobs = state.jobs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingJobs = state.jobs
    .filter(job => job.status === 'Open' || job.status === 'In Progress')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Fleet overview and maintenance insights</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ships</p>
              <p className="text-2xl font-bold text-gray-900">{totalShips}</p>
              <p className="text-sm text-green-600">{activeShips} active</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Ship className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Components</p>
              <p className="text-2xl font-bold text-gray-900">{totalComponents}</p>
              <p className="text-sm text-red-600">{criticalComponents} critical</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{openJobs + inProgressJobs}</p>
              <p className="text-sm text-blue-600">{openJobs} pending</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Wrench className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0}%
              </p>
              <p className="text-sm text-green-600">+5% this month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ship Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={shipStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {shipStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center space-x-4">
            {shipStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={jobStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Priority Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={priorityData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
          <div className="space-y-3">
            {recentJobs.map((job) => {
              const ship = state.ships.find(s => s.id === job.shipId);
              const component = state.components.find(c => c.id === job.componentId);
              return (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{job.type}</p>
                    <p className="text-sm text-gray-600">{ship?.name} - {component?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {job.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Jobs</h3>
          <div className="space-y-3">
            {upcomingJobs.map((job) => {
              const ship = state.ships.find(s => s.id === job.shipId);
              const component = state.components.find(c => c.id === job.componentId);
              const isOverdue = new Date(job.scheduledDate) < new Date();
              return (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{job.type}</p>
                    <p className="text-sm text-gray-600">{ship?.name} - {component?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        job.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.priority}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                      {new Date(job.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}