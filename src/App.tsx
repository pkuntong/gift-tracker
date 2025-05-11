import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import GiftManager from './components/GiftManager';
import Profile from './components/Profile';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Blog from './pages/Blog';
import PrivateRoute from './components/PrivateRoute';
import Analytics from '@/components/Analytics';
import CookieConsent from '@/components/CookieConsent';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import NotFound from './pages/NotFound';
import Events from './pages/Events';

// Import your page components here
// import Home from '@/pages/Home';
// import Features from '@/pages/Features';
// import Pricing from '@/pages/Pricing';
// import PrivacyPolicy from '@/pages/PrivacyPolicy';
// import TermsOfService from '@/pages/TermsOfService';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/gifts"
              element={
                <PrivateRoute>
                  <GiftManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <Events />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
      {/* Analytics component to track page views */}
      <Analytics />
      <CookieConsent />
    </Router>
  );
};

export default App; 