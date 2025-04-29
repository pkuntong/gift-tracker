// Analytics utility functions

// Google Analytics 4
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 measurement ID

// Facebook Pixel
export const FB_PIXEL_ID = 'XXXXXXXXXXXXX'; // Replace with your actual Facebook Pixel ID

// LinkedIn Insight Tag
export const LINKEDIN_PARTNER_ID = 'XXXXXXXX'; // Replace with your actual LinkedIn Partner ID

// Hotjar
export const HOTJAR_ID = 'XXXXXXXXXX'; // Replace with your actual Hotjar ID
export const HOTJAR_VERSION = '6';

// Google Analytics 4 initialization
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID);
  }
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Facebook Pixel initialization
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined') {
    // Load Facebook Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }
};

// LinkedIn Insight Tag initialization
export const initLinkedInInsight = () => {
  if (typeof window !== 'undefined') {
    // Load LinkedIn Insight Tag script
    const script = document.createElement('script');
    script.innerHTML = `
      _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
      (function(l) {
      if (!l){window.lint=function(){lint.c.push(arguments)};window.lint.c=[]}
      var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript";b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);})(window.lint);
    `;
    document.head.appendChild(script);
  }
};

// Hotjar initialization
export const initHotjar = () => {
  if (typeof window !== 'undefined') {
    // Load Hotjar script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${HOTJAR_ID},hjsv:${HOTJAR_VERSION}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);
  }
};

// Track conversions
export const trackConversion = (conversionType: string, value?: number) => {
  // Google Analytics conversion tracking
  event({
    action: 'conversion',
    category: 'conversion',
    label: conversionType,
    value: value,
  });

  // Facebook Pixel conversion tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: 'USD',
      content_name: conversionType,
    });
  }
};

// Initialize all tracking tools
export const initAnalytics = () => {
  initGA();
  initFacebookPixel();
  initLinkedInInsight();
  initHotjar();
};

// TypeScript declarations for window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    lint: (...args: any[]) => void;
    _linkedin_partner_id: string;
    _linkedin_data_partner_ids: string[];
    hj: (...args: any[]) => void;
    _hjSettings: {
      hjid: string;
      hjsv: string;
    };
  }
} 