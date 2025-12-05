# Google Analytics Setup Guide

This project includes Google Analytics 4 (GA4) tracking that sends data to your Google Analytics dashboard.

## Features

- ✅ **Automatic Page View Tracking**: Tracks page views on route changes
- ✅ **Event Tracking Functions**: Pre-built functions for common tracking needs
- ✅ **Environment Variable Configuration**: Configure via `.env` file
- ✅ **View Analytics in Google Analytics Dashboard**: All data flows to your GA4 property

## Quick Start

1. **Get Your GA4 Measurement ID**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Select your property (or create a new one)
   - Click on **Admin** (gear icon) in the bottom left
   - Under **Property**, click **Data Streams**
   - Click on your web stream (or create a new one)
   - Copy the **Measurement ID** (format: G-XXXXXXXXXX)

2. **Configure in Your Project**:
   - Create a `.env` file in the root directory (copy from `env.example`)
   - Add your Measurement ID:
     ```
     REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
     ```
   - Restart your development server: `npm start`

3. **Verify It's Working**:
   - Visit your website and navigate between pages
   - Go to Google Analytics → Reports → Realtime
   - You should see your visits appearing in real-time

4. **View Your Analytics**:
   - All your website analytics will be available in the [Google Analytics Dashboard](https://analytics.google.com)
   - Check Reports, Realtime, Engagement, and other sections for detailed insights

## Viewing Your Analytics Data

Once configured, all your website analytics data will be available in the official Google Analytics dashboard:

1. **Go to Google Analytics**: [https://analytics.google.com](https://analytics.google.com)
2. **Select Your Property**: Choose the property you configured
3. **View Reports**:
   - **Realtime**: See live visitors and events
   - **Reports**: View detailed analytics (users, sessions, page views, etc.)
   - **Engagement**: See how users interact with your site
   - **Acquisition**: Track where your traffic comes from
   - **Monetization**: Track conversions and revenue (if configured)

All tracking data from your website automatically flows to Google Analytics, where you can view comprehensive reports and insights.

## Using Tracking Functions in Your Components

Import the tracking functions from `analytics.js`:

```javascript
import { 
  trackEvent, 
  trackButtonClick, 
  trackFormSubmit, 
  trackLinkClick 
} from '../analytics';
```

### Examples

#### Track Button Clicks
```javascript
<button onClick={() => {
  trackButtonClick('Contact Form Submit', 'Hero Section');
  // Your button logic here
}}>
  Contact Us
</button>
```

#### Track Form Submissions
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Your form submission logic
    trackFormSubmit('Contact Form', true);
  } catch (error) {
    trackFormSubmit('Contact Form', false);
  }
};
```

#### Track Link Clicks
```javascript
<a 
  href="https://example.com" 
  onClick={() => trackLinkClick('External Link', 'https://example.com')}
>
  Visit Example
</a>
```

#### Track Custom Events
```javascript
trackEvent('video_play', {
  video_title: 'Product Demo',
  video_duration: 120
});
```

## Available Tracking Functions

- `trackPageView(pagePath, pageTitle)` - Track page views (automatically called on route changes)
- `trackEvent(eventName, eventParams)` - Track custom events
- `trackButtonClick(buttonName, location)` - Track button clicks
- `trackFormSubmit(formName, success)` - Track form submissions
- `trackLinkClick(linkText, linkUrl)` - Track link clicks
- `trackScrollDepth(percentage)` - Track scroll depth
- `trackVideoInteraction(videoTitle, action)` - Track video interactions
- `trackSearch(searchTerm)` - Track search queries
- `getGAStatus()` - Get current GA status
- `updateMeasurementId(newId)` - Update Measurement ID programmatically
- `disableGA()` - Disable Google Analytics

## Notes

- Page views are automatically tracked when routes change in `App.js`
- All tracking functions check if GA is enabled before sending events
- Console logs are included for debugging (can be removed in production)
- To update your Measurement ID, change it in `.env` and restart the server

## Troubleshooting

### Events not showing in Google Analytics

1. Verify your Measurement ID is correct (format: G-XXXXXXXXXX)
2. Check that `.env` file has `REACT_APP_GA_MEASUREMENT_ID` set correctly
3. Restart your development server after changing `.env`
4. Check browser console for any errors
5. Check Google Analytics Real-Time reports (may take a few seconds)
6. Ensure ad blockers are disabled (they may block GA scripts)

### Page views not tracking

- Verify GA is initialized (check browser console for "Google Analytics: Initialized" message)
- Ensure `trackPageView` is called in `App.js` useEffect (already included)
- Check browser console for errors
- Verify your `.env` file is in the root directory and has the correct variable name

