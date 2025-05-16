
# INFIWORLD Crypto Hub 🌐

INFIWORLD Crypto Hub is a comprehensive platform that enables users to interact with cryptocurrency in everyday scenarios, including marketplace transactions, freelance service payments, reservations, and location-based services.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/infiworld-crypto-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![INFIWORLD Screenshot](./public/assets/marketplace/ChatGPT%20Image%203%20%E0%B8%9E.%E0%B8%84.%202568%2018_28_43.png)

## 🚀 Features

- **Interactive User Interface**: Built with React, GSAP for animations, and TailwindCSS for responsive design
- **Comprehensive Services**:
  - Marketplace for buying/selling products with cryptocurrency
  - Freelancer platform for service providers
  - Reservation system for booking services
  - Map interface for finding crypto-friendly businesses
- **Secure Transactions**: Escrow system and payment verification
- **Multi-language Support**: Thai and English interfaces

## 📋 Table of Contents

- [Installation](#installation)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/infiworld-crypto-hub.git
   cd infiworld-crypto-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a Supabase project and get your API keys.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) to view the application in your browser.

## 🔧 Technologies

### Front-end
- **React**: Library for building user interfaces
- **TypeScript**: Typed JavaScript for better code quality
- **TailwindCSS**: Utility-first CSS framework
- **Shadcn UI**: Component library based on Radix UI
- **GSAP**: Animation library
- **Tanstack Query**: Data fetching and cache management
- **Lucide Icons**: SVG icon library
- **Recharts**: Chart library for data visualization
- **React Router**: Client-side routing

### Backend and Services
- **Supabase**: Database, authentication, and backend functions
- **GitHub Actions**: CI/CD pipeline
- **Mapbox**: Map visualization services

## 🏗️ Project Structure

```
src/
├── components/         # UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── freelance/      # Freelancer marketplace components
│   ├── layout/         # Layout components (navbar, footer)
│   ├── map/            # Map-related components
│   ├── marketplace/    # Marketplace components
│   ├── payments/       # Payment processing components
│   ├── reservations/   # Reservation system components
│   └── ui/             # UI element components (shadcn)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility libraries
├── pages/              # Page components
├── utils/              # Helper utilities
└── App.tsx             # Main application component
```

## ⚙️ Configuration

### Environment Variables

For local development, you'll need to set up the following environment variables:

1. Mapbox Token (via localStorage in the Map page)
2. Supabase URL and Key (via the Supabase client)

### Supabase Setup

This project uses Supabase for backend functionality. You'll need to create:

1. Authentication providers
2. Database tables for:
   - Users
   - Listings
   - Transactions
   - Escrow records
   - Stores
   - Reservations

## 💻 Development

### Recommended Development Tools

- Visual Studio Code
- ESLint extension
- Prettier extension
- Tailwind CSS IntelliSense extension

### Code Style Guide

We use ESLint and Prettier for code formatting. Please ensure your code follows the project's style guidelines before submitting pull requests.

## 🧪 Testing

Run tests with:

```bash
npm test
# or
yarn test
```

We use Jest and React Testing Library for testing components and hooks.

## 🚢 Deployment

The project uses GitHub Actions for continuous deployment. When code is pushed to the main branch, it will automatically:

1. Build the project
2. Run tests
3. Deploy to GitHub Pages

See `.github/workflows/deploy.yml` for the deployment configuration.

## 👥 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please contact:
- [kritsanan1](https://github.com/kritsanan1)
