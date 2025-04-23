(function(window) {
    try {
        window._env_ = window._env_ || {};
        window._env_.NEXT_PUBLIC_API_KEY = '%NEXT_PUBLIC_API_KEY%';
        
        // Verify the environment variable is set
        if (!window._env_.NEXT_PUBLIC_API_KEY || window._env_.NEXT_PUBLIC_API_KEY === '%NEXT_PUBLIC_API_KEY%') {
            console.error('API key not found in environment variables');
        }
    } catch (e) {
        console.error('Error setting environment variables:', e);
    }
})(typeof window !== 'undefined' ? window : {}); 