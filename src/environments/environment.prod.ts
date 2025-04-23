declare global {
  interface Window {
    NEXT_PUBLIC_API_KEY: string;
  }
}

export const environment = {
  production: true,
  apiKey: process.env['NEXT_PUBLIC_API_KEY']
}; 