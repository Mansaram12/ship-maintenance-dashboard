import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ships from './pages/Ships';
import ShipDetails from './pages/ShipDetails';
import Components from './pages/Components';
import Jobs from './pages/Jobs';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import Users from './pages/Users';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  return state.currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { state } = useApp();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={state.currentUser ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ships" element={<ProtectedRoute><Ships /></ProtectedRoute>} />
          <Route path="/ships/:id" element={<ProtectedRoute><ShipDetails /></ProtectedRoute>} />
          <Route path="/components" element={<ProtectedRoute><Components /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;