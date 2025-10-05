// Analytics Configuration for Lupo Grigio
// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 Measurement ID

export const ANALYTICS_CONFIG = {
  // Google Analytics 4 Measurement ID
  // Get this from: https://analytics.google.com/analytics/web/
  GA_MEASUREMENT_ID: 'GA_MEASUREMENT_ID', // Replace with your actual GA4 ID
  
  // Enhanced E-commerce Events
  ENABLE_ECOMMERCE_TRACKING: true,
  
  // Custom Events
  CUSTOM_EVENTS: {
    PRODUCT_VIEW: 'product_view',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    VIEW_CART: 'view_cart',
    CLEAR_CART: 'clear_cart',
    QUICK_VIEW: 'quick_view',
    CONTACT_CLICK: 'contact_click',
    INSTAGRAM_CLICK: 'instagram_click'
  },
  
  // Privacy Settings
  RESPECT_COOKIE_CONSENT: true,
  ANONYMIZE_IP: true,
  
  // Debug Mode (set to false in production)
  DEBUG_MODE: false
};

// Instructions for setup:
// 1. Go to https://analytics.google.com/analytics/web/
// 2. Create a new GA4 property for your website
// 3. Copy the Measurement ID (format: G-XXXXXXXXXX)
// 4. Replace 'GA_MEASUREMENT_ID' above with your actual ID
// 5. Update the GA_MEASUREMENT_ID in index.html as well
