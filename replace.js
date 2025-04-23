const fs = require('fs');
const path = require('path');

const targetPath = './src/environments/environment.prod.ts';
const envFile = fs.readFileSync(targetPath, 'utf8');
const updatedFile = envFile.replace(
  /'fa-sCr9KKRWkNx4-mplZVHfDbBKoGL1oBf4zqk7O'/g,
  `'${process.env.NEXT_PUBLIC_API_KEY}'`
);

fs.writeFileSync(targetPath, updatedFile); 