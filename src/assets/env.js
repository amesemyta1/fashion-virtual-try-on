(function(window) {
    try {
        window["NEXT_PUBLIC_API_KEY"] = '%NEXT_PUBLIC_API_KEY%';
    } catch (e) {
        console.error('Error setting environment variables:', e);
    }
})(typeof window !== 'undefined' ? window : {}); 