export interface User {
  id: string;
  role: 'Admin' | 'Inspector' | 'Engineer';
  email: string;
  password: string;
  name: string;
}

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  createdAt: string;
  lastInspection?: string;
}

export interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate?: string;
  status: 'Good' | 'Warning' | 'Critical';
}

export interface MaintenanceJob {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Preventive';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'On Hold';
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  description: string;
  notes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'job_created' | 'job_updated' | 'job_completed' | 'maintenance_due';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
}

export interface AppState {
  users: User[];
  ships: Ship[];
  components: Component[];
  jobs: MaintenanceJob[];
  notifications: Notification[];
  currentUser: User | null;
}