import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, User, Ship, Component, MaintenanceJob, Notification } from '../types';
import { mockData } from '../data/mockData';

type Action =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_SHIP'; payload: Ship }
  | { type: 'UPDATE_SHIP'; payload: Ship }
  | { type: 'DELETE_SHIP'; payload: string }
  | { type: 'ADD_COMPONENT'; payload: Component }
  | { type: 'UPDATE_COMPONENT'; payload: Component }
  | { type: 'DELETE_COMPONENT'; payload: string }
  | { type: 'ADD_JOB'; payload: MaintenanceJob }
  | { type: 'UPDATE_JOB'; payload: MaintenanceJob }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'LOAD_DATA'; payload: AppState };

const initialState: AppState = {
  users: [],
  ships: [],
  components: [],
  jobs: [],
  notifications: [],
  currentUser: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_SHIP':
      return { ...state, ships: [...state.ships, action.payload] };
    case 'UPDATE_SHIP':
      return {
        ...state,
        ships: state.ships.map(ship =>
          ship.id === action.payload.id ? action.payload : ship
        ),
      };
    case 'DELETE_SHIP':
      return {
        ...state,
        ships: state.ships.filter(ship => ship.id !== action.payload),
        components: state.components.filter(comp => comp.shipId !== action.payload),
        jobs: state.jobs.filter(job => job.shipId !== action.payload),
      };
    case 'ADD_COMPONENT':
      return { ...state, components: [...state.components, action.payload] };
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(comp =>
          comp.id === action.payload.id ? action.payload : comp
        ),
      };
    case 'DELETE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(comp => comp.id !== action.payload),
        jobs: state.jobs.filter(job => job.componentId !== action.payload),
      };
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id ? action.payload : job
        ),
      };
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const savedData = localStorage.getItem('shipMaintenanceData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch({ type: 'LOAD_DATA', payload: parsedData });
    } else {
      // Initialize with mock data
      dispatch({ type: 'LOAD_DATA', payload: mockData });
      localStorage.setItem('shipMaintenanceData', JSON.stringify(mockData));
    }

    // Check for saved session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes (except currentUser)
    const dataToSave = {
      users: state.users,
      ships: state.ships,
      components: state.components,
      jobs: state.jobs,
      notifications: state.notifications,
      currentUser: null, // Don't persist current user in main data
    };
    
    if (state.users.length > 0) { // Only save if data is loaded
      localStorage.setItem('shipMaintenanceData', JSON.stringify(dataToSave));
    }
  }, [state.users, state.ships, state.components, state.jobs, state.notifications]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};