export function initGoogleAnalytics(measurementId) {
  if (!measurementId) {
    // No GA ID provided; skip initialization
    return;
  }
  // Avoid double-initializing
  if (window.gtag) return;

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
    send_page_view: true
  });
}





