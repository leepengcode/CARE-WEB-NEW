let googleMapsLoaded = false;
let googleMapsLoading = false;
let googleMapsCallbacks = [];

export function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (googleMapsLoaded && window.google) {
      resolve(window.google);
      return;
    }

    // If already loading, add to callbacks
    if (googleMapsLoading) {
      googleMapsCallbacks.push({ resolve, reject });
      return;
    }

    googleMapsLoading = true;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists but not loaded yet, wait for it
      const checkGoogle = () => {
        if (window.google && window.google.maps) {
          googleMapsLoaded = true;
          googleMapsLoading = false;
          resolve(window.google);
          // Resolve any pending callbacks
          googleMapsCallbacks.forEach(cb => cb.resolve(window.google));
          googleMapsCallbacks = [];
        } else {
          setTimeout(checkGoogle, 100);
        }
      };
      checkGoogle();
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY;
    
    if (!apiKey) {
      reject(new Error('Google Maps API key not found. Please set VITE_GOOGLE_MAP_KEY in your .env file.'));
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      googleMapsLoaded = true;
      googleMapsLoading = false;
      resolve(window.google);
      // Resolve any pending callbacks
      googleMapsCallbacks.forEach(cb => cb.resolve(window.google));
      googleMapsCallbacks = [];
    };

    script.onerror = () => {
      googleMapsLoading = false;
      const error = new Error('Failed to load Google Maps API');
      reject(error);
      // Reject any pending callbacks
      googleMapsCallbacks.forEach(cb => cb.reject(error));
      googleMapsCallbacks = [];
    };

    document.head.appendChild(script);
  });
}

export function isGoogleMapsLoaded() {
  return googleMapsLoaded && window.google && window.google.maps;
} 