import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectChat = lazy(() => import('./pages/ProjectChat'));
const Profile = lazy(() => import('./pages/Profile'));
const ErrorPage = lazy(() => import('./pages/Error'));

// Loading Fallback
const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-mono animate-pulse">
    LOADING_MODULE...
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectChat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
