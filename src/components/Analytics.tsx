import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, pageview } from '@/utils/analytics';

/**
 * Analytics component that initializes tracking tools and tracks page views
 */
const Analytics = () => {
  const location = useLocation();

  // Initialize analytics on component mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Track page views when route changes
  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return null; // This component doesn't render anything
};

export default Analytics; 