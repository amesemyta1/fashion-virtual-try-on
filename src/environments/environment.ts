export const environment = {
  production: process.env['NODE_ENV'] === 'production',
  apiUrl: process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4200',
  apiKey: process.env['NEXT_PUBLIC_API_KEY']
}; 