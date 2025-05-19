import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { processNotifications, requestNotificationPermission } from './firebase/notification-service';
import MobileLayout from './components/MobileLayout';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';
import GiftManager from './components/GiftManager';
import Profile from './components/Profile';
import PricingPage from './pages/PricingPage';
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
import ThankYouTrackerPage from './pages/ThankYouTrackerPage';
import GiftHistoryPage from './pages/GiftHistoryPage';
import GuestManagerPage from './pages/GuestManagerPage';
import FirebaseTest from './pages/FirebaseTest';
import RemindersPage from './pages/RemindersPage';
import ReportsPage from './pages/ReportsPage';
import WishlistPage from './pages/WishlistPage';
import CollaboratorsPage from './pages/CollaboratorsPage';

// Import your page components here
// import Home from '@/pages/Home';
// import Features from '@/pages/Features';
// import Pricing from '@/pages/Pricing';
// import PrivacyPolicy from '@/pages/PrivacyPolicy';
// import TermsOfService from '@/pages/TermsOfService';

const App: React.FC = () => {
  // Initialize notification system
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Request notification permission if not already granted
        const permissionGranted = await requestNotificationPermission();
        
        if (permissionGranted) {
          // Process any pending notifications
          await processNotifications();
          console.log('Notifications initialized and processed');
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };
    
    initializeNotifications();
    
    // Set up interval to check for new notifications every 5 minutes
    const notificationInterval = setInterval(() => {
      processNotifications();
    }, 5 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(notificationInterval);
  }, []);
  
  return (
    <Router>
      <AuthProvider>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/firebase-test" element={<FirebaseTest />} />
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
              path="/thank-you"
              element={
                <PrivateRoute>
                  <ThankYouTrackerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/gift-history"
              element={
                <PrivateRoute>
                  <GiftHistoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/guests"
              element={
                <PrivateRoute>
                  <GuestManagerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <PrivateRoute>
                  <RemindersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PrivateRoute>
                  <WishlistPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/collaborators"
              element={
                <PrivateRoute>
                  <CollaboratorsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/events/:eventId/guests"
              element={
                <PrivateRoute>
                  <GuestManagerPage />
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
        </MobileLayout>
      </AuthProvider>
      {/* Analytics component to track page views */}
      <Analytics />
      <CookieConsent />
    </Router>
  );
};

export default App; 