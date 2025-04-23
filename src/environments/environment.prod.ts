declare global {
  interface Window {
    NEXT_PUBLIC_API_KEY: string;
  }
}

export const environment = {
  production: true,
  apiKey: window.NEXT_PUBLIC_API_KEY
}; 