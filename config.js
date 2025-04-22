const fs = require('fs');
const path = require('path');

console.log('Starting environment configuration...');
console.log('API_KEY:', process.env.API_KEY ? 'Present' : 'Missing');

const targetPath = path.join(process.cwd(), 'src/environments/environment.prod.ts');
const envFile = `
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  apiKey: '${process.env.API_KEY || ''}'
};
`;

fs.writeFileSync(targetPath, envFile);
console.log(`Environment file generated at ${targetPath}`);
console.log('Environment file contents:');
console.log(envFile); 