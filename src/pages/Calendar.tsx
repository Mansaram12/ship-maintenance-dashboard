import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wrench, AlertTriangle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function Calendar() {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get jobs for the current month
  const monthJobs = state.jobs.filter(job => {
    const jobDate = new Date(job.scheduledDate);
    return isSameMonth(jobDate, currentDate);
  });

  // Get jobs for a specific date
  const getJobsForDate = (date: Date) => {
    return state.jobs.filter(job => isSameDay(new Date(job.scheduledDate), date));
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(selectedDate) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
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

  const isOverdue = (scheduledDate: string, status: string) => {
    return new Date(scheduledDate) < new Date() && status !== 'Completed';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
          <p className="text-gray-600">Schedule and track maintenance activities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map(date => {
                const dayJobs = getJobsForDate(date);
                const isToday = isSameDay(date, new Date());
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const hasJobs = dayJobs.length > 0;
                const hasOverdueJobs = dayJobs.some(job => isOverdue(job.scheduledDate, job.status));

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`relative p-2 h-16 text-left border rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-blue-100 border-blue-300'
                        : isToday
                        ? 'bg-blue-50 border-blue-200'
                        : hasOverdueJobs
                        ? 'bg-red-50 border-red-200 hover:bg-red-100'
                        : hasJobs
                        ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {format(date, 'd')}
                    </div>
                    {hasJobs && (
                      <div className="mt-1 space-y-1">
                        {dayJobs.slice(0, 2).map((job, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${getPriorityColor(job.priority)}`}
                          />
                        ))}
                        {dayJobs.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayJobs.length - 2}</div>
                        )}
                      </div>
                    )}
                    {hasOverdueJobs && (
                      <AlertTriangle className="absolute top-1 right-1 h-3 w-3 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </h2>
            </div>
          </div>

          <div className="p-6">
            {selectedDate ? (
              selectedDateJobs.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateJobs.map(job => {
                    const ship = state.ships.find(s => s.id === job.shipId);
                    const component = state.components.find(c => c.id === job.componentId);
                    const engineer = state.users.find(u => u.id === job.assignedEngineerId);
                    const overdueJob = isOverdue(job.scheduledDate, job.status);

                    return (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Wrench className="h-4 w-4 text-gray-600" />
                            <h3 className="font-medium text-gray-900">{job.type}</h3>
                            {overdueJob && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div>Ship: {ship?.name}</div>
                          <div>Component: {component?.name}</div>
                          <div>Engineer: {engineer?.name}</div>
                          <div className="flex items-center space-x-2">
                            <span>Priority:</span>
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              job.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                              job.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                              job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {job.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs scheduled</h3>
                  <p className="text-gray-600">No maintenance jobs are scheduled for this date.</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a date</h3>
                <p className="text-gray-600">Click on a date to view scheduled maintenance jobs.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')} Summary
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{monthJobs.length}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {monthJobs.filter(j => j.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {monthJobs.filter(j => j.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {monthJobs.filter(j => isOverdue(j.scheduledDate, j.status)).length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}