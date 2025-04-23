declare global {
  interface Window {
    _env_: {
      NEXT_PUBLIC_API_KEY: string;
    };
  }
}

export const environment = {
  production: true,
  get apiKey(): string {
    if (typeof window !== 'undefined' && window._env_ && window._env_.NEXT_PUBLIC_API_KEY) {
      return window._env_.NEXT_PUBLIC_API_KEY;
    }
    console.error('API key not found in environment');
    return '';
  }
}; 