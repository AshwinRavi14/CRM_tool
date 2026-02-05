import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Opportunities from './pages/Opportunities';
import Projects from './pages/Projects';
import Accounts from './pages/Accounts';
import Contacts from './pages/Contacts';
import Reports from './pages/Reports';
import ReportList from './pages/ReportList';
import ProjectDetails from './pages/ProjectDetails';
import AccountDetails from './pages/AccountDetails';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import Forecasts from './pages/Forecasts';
import ActivitiesReport from './pages/ActivitiesReport';
import LandingPage from './pages/LandingPage';
import './styles/tokens.css';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Signup from './pages/Signup';
import GuidedOnboarding from './pages/GuidedOnboarding';


// Placeholder Pages for future implementation
const Placeholder = ({ name }) => (
  <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
    <h1 style={{ color: 'var(--primary)', marginBottom: '16px' }}>{name} Module</h1>
    <p style={{ color: 'var(--text-secondary)' }}>This module is currently under development to match the Zoho CRM reference.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Main Application Routes - Protected by AuthContext in MainLayout */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/:id" element={<AccountDetails />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="reports" element={<Reports />}>
            <Route index element={<Navigate to="sales" replace />} />
            <Route path="activity/salesperson" element={<ActivitiesReport />} />
            <Route path=":category" element={<ReportList />} />
          </Route>
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="forecasts" element={<Forecasts />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding/:token" element={<Onboarding />} />
        <Route path="/guided-onboarding" element={<GuidedOnboarding />} />


        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
