const fs = require('fs');
const path = require('path');

// Получаем значение переменной окружения
const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

console.log('✅ NEXT_PUBLIC_API_KEY from env:', apiKey); // <-- отладка

// Путь до файла src/assets/env.js
const outputPath = path.join(__dirname, '../src/assets/env.js');

// Содержание env.js с API ключом
const content = `
(function(window) {
  try {
    window._env_ = window._env_ || {};
    window._env_.NEXT_PUBLIC_API_KEY = '${apiKey}';

    if (!window._env_.NEXT_PUBLIC_API_KEY) {
      console.error('API key not found in environment variables');
    }
  } catch (e) {
    console.error('Error setting environment variables:', e);
  }
})(typeof window !== 'undefined' ? window : {});
`;

// Запись env.js
fs.writeFileSync(outputPath, content);
console.log(`✅ env.js successfully generated at ${outputPath}`);
