declare global {
  interface Window {
    NEXT_PUBLIC_API_KEY: string;
  }
}

export const environment = {
  production: true,
  apiKey: typeof window !== 'undefined' ? window.NEXT_PUBLIC_API_KEY : undefined
}; 