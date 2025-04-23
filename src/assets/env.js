(function(window) {
    try {
        window["NEXT_PUBLIC_API_KEY"] = '%NEXT_PUBLIC_API_KEY%';
        
        // Verify the environment variable is set
        if (!window["NEXT_PUBLIC_API_KEY"] || window["NEXT_PUBLIC_API_KEY"] === '%NEXT_PUBLIC_API_KEY%') {
            console.warn('API key not found in environment variables');
        }
    } catch (e) {
        console.error('Error setting environment variables:', e);
    }
})(typeof window !== 'undefined' ? window : {}); 