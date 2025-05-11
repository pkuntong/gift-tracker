# Gift Tracker

A modern web application to help you manage gift-giving occasions and track your gift ideas.

## Features

- 🎁 Track gift ideas for friends and family
- 📅 Manage upcoming gift-giving occasions
- 👤 User authentication and profile management
- 💳 Secure payment processing with Stripe
- 📱 Responsive design for all devices

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/pkuntong/gift-tracker.git
cd gift-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:  
- `VITE_API_URL`: Backend API URL (required)
- `VITE_STRIPE_PUBLIC_KEY`: Stripe public key for payment processing (optional)
- `VITE_STRIPE_SECRET_KEY`: Stripe secret key (optional)
- `VITE_ANALYTICS_ID`: Analytics tracking ID (optional)

**Note**: The application will check for required environment variables on startup and display an error message if any are missing.

4. Start the development server
```bash
npm run dev
```

5. Start the mock API server (for development)
```bash
npm run mock-api
```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Stripe
- Express (Mock API)

## E-Commerce Integrations

- <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Etsy_logo_small.svg" alt="Etsy Logo" width="20" height="20"> Etsy - Integration for handmade and vintage items

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 