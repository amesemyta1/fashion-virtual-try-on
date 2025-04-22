# Virtual Try-On Web Application

A modern web application built with Angular that allows users to virtually try on clothing items using AI-powered image processing.

## Features

- Real-time virtual try-on of clothing items
- Camera integration for taking photos
- Support for both mobile and desktop devices
- Responsive design
- Error handling and status tracking
- Camera switching for mobile devices

## Technologies

- Angular 17+
- TypeScript
- RxJS
- Modern CSS (Grid, Flexbox)
- Progressive Web App features

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Angular CLI: `npm install -g @angular/cli`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/virtual-try-on.git
cd virtual-try-on
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment:
```bash
cp src/environments/environment.template.ts src/environments/environment.ts
```
Then edit `src/environments/environment.ts` and add your API credentials:
```typescript
export const environment = {
  production: false,
  apiUrl: 'YOUR_API_URL',
  apiKey: 'YOUR_API_KEY'
};
```

4. Start the development server:
```bash
ng serve
```

5. Open your browser and navigate to `http://localhost:4200`

## Development

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Tests

Run `ng test` to execute the unit tests via Karma.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 