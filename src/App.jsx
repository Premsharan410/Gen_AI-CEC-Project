import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ColabConnectionModal from './components/ColabConnectionModal';
import StudioLaunchLoader from './components/StudioLaunchLoader';
import Home from './pages/Home';
import Generate from './pages/Generate';
import { RUNTIME_STATUS, getRuntimeMode, getApiBaseUrl } from './config/appConfig';
import { checkConnection } from './services/api';

// Helper component to scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [runtimeStatus, setRuntimeStatus] = useState(RUNTIME_STATUS.DEMO);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLaunchingStudio, setIsLaunchingStudio] = useState(false);

  // Initial check: if user previously set a live tunnel, verify connection without blocking UI
  useEffect(() => {
    const mode = getRuntimeMode();
    const url = getApiBaseUrl();

    if (mode === 'live' && url) {
      setRuntimeStatus(RUNTIME_STATUS.CONNECTING);
      checkConnection().then((res) => {
        if (res.ok) {
          setRuntimeStatus(RUNTIME_STATUS.CONNECTED);
        } else {
          setRuntimeStatus(RUNTIME_STATUS.ERROR);
        }
      });
    } else {
      setRuntimeStatus(RUNTIME_STATUS.DEMO);
    }
  }, []);

  // Studio launch transition handler: only triggers when navigating into the studio from outside
  const handleLaunchStudio = () => {
    // Rule: if already on /generate, never trigger loader or re-navigate
    if (location.pathname === '/generate') {
      return;
    }
    // Prevent repeated clicks during transition
    if (isLaunchingStudio) return;

    setIsLaunchingStudio(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = prefersReducedMotion ? 250 : 1300;

    setTimeout(() => {
      setIsLaunchingStudio(false);
      navigate('/generate');
    }, delay);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text bg-grid-pattern selection:bg-brand-blue/20 selection:text-brand-blue">
      {/* Studio Launch Loader Overlay */}
      <StudioLaunchLoader isOpen={isLaunchingStudio} />

      {/* Shared Navbar */}
      <Navbar
        runtimeStatus={runtimeStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLaunchStudio={handleLaunchStudio}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onOpenSettings={() => setIsSettingsOpen(true)}
                onLaunchStudio={handleLaunchStudio}
              />
            }
          />
          <Route
            path="/generate"
            element={
              <Generate
                runtimeStatus={runtimeStatus}
                setRuntimeStatus={setRuntimeStatus}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            }
          />
          {/* Fallback to Home */}
          <Route
            path="*"
            element={
              <Home
                onOpenSettings={() => setIsSettingsOpen(true)}
                onLaunchStudio={handleLaunchStudio}
              />
            }
          />
        </Routes>
      </main>

      {/* Shared Footer */}
      <Footer />

      {/* Colab Connection Modal */}
      <ColabConnectionModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onStatusChange={(newStatus) => setRuntimeStatus(newStatus)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
