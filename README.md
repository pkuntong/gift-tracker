# Gift Tracker

A modern web application to help you manage gift-giving occasions and track your gift ideas, integrated with Firebase for backend services.

## Features

- 🎁 Track gift ideas for friends and family
- 📅 Manage upcoming gift-giving occasions
- 👤 User authentication and profile management with Firebase Auth
- 🔥 Real-time data synchronization with Firestore
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

Edit `.env` with your Firebase configuration:  
- `VITE_FIREBASE_API_KEY`: Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Your Firebase app ID
- `VITE_STRIPE_PUBLIC_KEY`: Stripe public key for payment processing (optional)
- `VITE_STRIPE_SECRET_KEY`: Stripe secret key (optional)
- `VITE_ANALYTICS_ID`: Analytics tracking ID (optional)

**Note**: The application will check for required environment variables on startup and display an error message if any are missing.

4. Start the development server
```bash
npm run dev
```

## Tech Stack

- React + TypeScript
- Vite
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS
- Stripe integration

## E-Commerce Integrations


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 