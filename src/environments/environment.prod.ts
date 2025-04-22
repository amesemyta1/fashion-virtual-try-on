declare const ng: any;

export const environment = {
  production: true,
  apiUrl: 'https://api.example.com', // Замените на ваш реальный API URL
  apiKey: (typeof ng !== 'undefined' ? ng.process.env.NG_APP_API_KEY : '') || ''
}; 