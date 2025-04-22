declare const process: {
  env: {
    API_KEY: string;
  };
};

export const environment = {
  production: true,
  apiUrl: 'https://api.example.com', // Замените на ваш реальный API URL
  apiKey: process.env.API_KEY
}; 