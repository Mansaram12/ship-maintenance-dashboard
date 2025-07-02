import { AppState } from '../types';
import { addDays, subDays, format } from 'date-fns';

export const mockData: AppState = {
  users: [
    { 
      id: '1', 
      role: 'Admin', 
      email: 'admin@entnt.in', 
      password: 'admin123',
      name: 'John Admin'
    },
    { 
      id: '2', 
      role: 'Inspector', 
      email: 'inspector@entnt.in', 
      password: 'inspect123',
      name: 'Sarah Inspector'
    },
    { 
      id: '3', 
      role: 'Engineer', 
      email: 'engineer@entnt.in', 
      password: 'engine123',
      name: 'Mike Engineer'
    },
    { 
      id: '4', 
      role: 'Engineer', 
      email: 'engineer2@entnt.in', 
      password: 'engine123',
      name: 'Lisa Engineer'
    }
  ],
  ships: [
    { 
      id: 's1', 
      name: 'Ever Given', 
      imo: '9811000', 
      flag: 'Panama', 
      status: 'Active',
      createdAt: '2020-01-10',
      lastInspection: '2024-03-12'
    },
    { 
      id: 's2', 
      name: 'Maersk Alabama', 
      imo: '9164263', 
      flag: 'USA', 
      status: 'Under Maintenance',
      createdAt: '2019-07-18',
      lastInspection: '2024-01-15'
    },
    { 
      id: 's3', 
      name: 'MSC Oscar', 
      imo: '9703291', 
      flag: 'Liberia', 
      status: 'Active',
      createdAt: '2021-03-22',
      lastInspection: '2024-02-28'
    },
    { 
      id: 's4', 
      name: 'OOCL Hong Kong', 
      imo: '9714314', 
      flag: 'Hong Kong', 
      status: 'Inactive',
      createdAt: '2018-11-05',
      lastInspection: '2023-10-20'
    }
  ],
  components: [
    { 
      id: 'c1', 
      shipId: 's1', 
      name: 'Main Engine', 
      serialNumber: 'ME-1234', 
      installDate: '2020-01-10', 
      lastMaintenanceDate: '2024-03-12',
      nextMaintenanceDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      status: 'Good'
    },
    { 
      id: 'c2', 
      shipId: 's2', 
      name: 'Radar System', 
      serialNumber: 'RAD-5678', 
      installDate: '2021-07-18', 
      lastMaintenanceDate: '2023-12-01',
      nextMaintenanceDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
      status: 'Warning'
    },
    { 
      id: 'c3', 
      shipId: 's1', 
      name: 'Navigation System', 
      serialNumber: 'NAV-9012', 
      installDate: '2020-02-15', 
      lastMaintenanceDate: '2024-01-20',
      nextMaintenanceDate: format(addDays(new Date(), 45), 'yyyy-MM-dd'),
      status: 'Good'
    },
    { 
      id: 'c4', 
      shipId: 's3', 
      name: 'Propeller', 
      serialNumber: 'PROP-3456', 
      installDate: '2021-03-22', 
      lastMaintenanceDate: '2023-11-15',
      nextMaintenanceDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      status: 'Critical'
    },
    { 
      id: 'c5', 
      shipId: 's2', 
      name: 'Communication Array', 
      serialNumber: 'COMM-7890', 
      installDate: '2019-08-10', 
      lastMaintenanceDate: '2024-02-28',
      nextMaintenanceDate: format(addDays(new Date(), 60), 'yyyy-MM-dd'),
      status: 'Good'
    }
  ],
  jobs: [
    { 
      id: 'j1', 
      componentId: 'c1', 
      shipId: 's1', 
      type: 'Inspection', 
      priority: 'High', 
      status: 'Open', 
      assignedEngineerId: '3', 
      scheduledDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      description: 'Routine engine inspection and performance check',
      createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd')
    },
    { 
      id: 'j2', 
      componentId: 'c2', 
      shipId: 's2', 
      type: 'Repair', 
      priority: 'Critical', 
      status: 'In Progress', 
      assignedEngineerId: '4', 
      scheduledDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      description: 'Radar calibration and sensor replacement',
      createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd')
    },
    { 
      id: 'j3', 
      componentId: 'c4', 
      shipId: 's3', 
      type: 'Preventive', 
      priority: 'Critical', 
      status: 'Open', 
      assignedEngineerId: '3', 
      scheduledDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      description: 'Propeller maintenance - overdue',
      createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd')
    },
    { 
      id: 'j4', 
      componentId: 'c3', 
      shipId: 's1', 
      type: 'Inspection', 
      priority: 'Medium', 
      status: 'Completed', 
      assignedEngineerId: '4', 
      scheduledDate: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      completedDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      description: 'Navigation system software update and testing',
      createdAt: format(subDays(new Date(), 7), 'yyyy-MM-dd')
    }
  ],
  notifications: [
    {
      id: 'n1',
      type: 'job_created',
      title: 'New Job Created',
      message: 'Propeller maintenance job has been created for MSC Oscar',
      timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
      read: false,
      userId: '3'
    },
    {
      id: 'n2',
      type: 'job_updated',
      title: 'Job Status Updated',
      message: 'Radar repair job is now in progress',
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      read: false,
      userId: '4'
    },
    {
      id: 'n3',
      type: 'maintenance_due',
      title: 'Maintenance Due',
      message: 'Propeller maintenance is overdue for MSC Oscar',
      timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
      read: true,
      userId: '1'
    }
  ],
  currentUser: null
};