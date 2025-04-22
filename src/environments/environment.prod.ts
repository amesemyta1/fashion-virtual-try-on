declare global {
  interface Window {
    _env_: {
      API_KEY: string;
    }
  }
}

export const environment = {
  production: true,
  apiUrl: 'https://api.example.com', // Замените на ваш реальный API URL
  apiKey: window._env_?.API_KEY || ''
}; 