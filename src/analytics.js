// Google Analytics Configuration
let GA_MEASUREMENT_ID = null;
let GA_ENABLED = false;

/**
 * Initialize Google Analytics (GA4)
 * @param {string} measurementId - GA4 Measurement ID (e.g., 'G-XXXXXXXXXX')
 */
export function initGoogleAnalytics(measurementId) {
  if (!measurementId) {
    console.log('Google Analytics: No measurement ID provided');
    GA_ENABLED = false;
    return;
  }
  
  GA_MEASUREMENT_ID = measurementId;
  
  // Avoid double-initializing
  if (window.gtag) {
    console.log('Google Analytics: Already initialized');
    GA_ENABLED = true;
    return;
  }

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: true,
    page_path: window.location.pathname + window.location.search
  });
  
  GA_ENABLED = true;
  console.log('Google Analytics: Initialized with ID', measurementId);
}

/**
 * Track page views
 * @param {string} pagePath - The path of the page
 * @param {string} pageTitle - The title of the page
 */
export function trackPageView(pagePath, pageTitle) {
  if (!GA_ENABLED || !window.gtag) {
    return;
  }
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: pageTitle
  });
  
  console.log('GA Page View:', { pagePath, pageTitle });
}

/**
 * Track custom events
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional event parameters
 */
export function trackEvent(eventName, eventParams = {}) {
  if (!GA_ENABLED || !window.gtag) {
    console.log('GA Event (not sent - GA disabled):', eventName, eventParams);
    return;
  }
  
  window.gtag('event', eventName, {
    ...eventParams,
    timestamp: new Date().toISOString()
  });
  
  console.log('GA Event:', eventName, eventParams);
}

/**
 * Track button clicks
 * @param {string} buttonName - Name/ID of the button
 * @param {string} location - Where the button is located
 */
export function trackButtonClick(buttonName, location = 'unknown') {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: location
  });
}

/**
 * Track form submissions
 * @param {string} formName - Name of the form
 * @param {boolean} success - Whether submission was successful
 */
export function trackFormSubmit(formName, success = true) {
  trackEvent('form_submit', {
    form_name: formName,
    success: success
  });
}

/**
 * Track link clicks
 * @param {string} linkText - Text of the link
 * @param {string} linkUrl - URL of the link
 */
export function trackLinkClick(linkText, linkUrl) {
  trackEvent('link_click', {
    link_text: linkText,
    link_url: linkUrl
  });
}

/**
 * Track scroll depth
 * @param {number} percentage - Scroll depth percentage (0-100)
 */
export function trackScrollDepth(percentage) {
  trackEvent('scroll_depth', {
    scroll_percentage: percentage
  });
}

/**
 * Track video interactions
 * @param {string} videoTitle - Title of the video
 * @param {string} action - Action (play, pause, complete, etc.)
 */
export function trackVideoInteraction(videoTitle, action) {
  trackEvent('video_interaction', {
    video_title: videoTitle,
    action: action
  });
}

/**
 * Track search queries
 * @param {string} searchTerm - The search term
 */
export function trackSearch(searchTerm) {
  trackEvent('search', {
    search_term: searchTerm
  });
}

/**
 * Get current GA status
 * @returns {object} Status object with enabled state and measurement ID
 */
export function getGAStatus() {
  return {
    enabled: GA_ENABLED,
    measurementId: GA_MEASUREMENT_ID,
    gtagAvailable: typeof window !== 'undefined' && !!window.gtag
  };
}






