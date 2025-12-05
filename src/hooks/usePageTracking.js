import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from '../analytics';

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view using gtag directly
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_title: document.title || 'Apnaaapan',
      });
    }
    
    // Also use the trackPageView function for consistency
    const pageTitle = document.title || 'Apnaaapan';
    trackPageView(location.pathname + location.search, pageTitle);
    
    console.log('Page tracked:', location.pathname + location.search);
  }, [location]);
}

export default usePageTracking;

