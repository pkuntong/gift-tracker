import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Analytics from '@/components/Analytics';
import CookieConsent from '@/components/CookieConsent';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import Contact from '@/pages/Contact';

// Import your page components here
// import Home from '@/pages/Home';
// import Features from '@/pages/Features';
// import Pricing from '@/pages/Pricing';
// import PrivacyPolicy from '@/pages/PrivacyPolicy';
// import TermsOfService from '@/pages/TermsOfService';

const App: React.FC = () => {
  return (
    <Router>
      {/* Analytics component to track page views */}
      <Analytics />
      <CookieConsent />
      
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<div>Home</div>} />
        <Route path="/features" element={<div>Features</div>} />
        <Route path="/pricing" element={<div>Pricing</div>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App; 