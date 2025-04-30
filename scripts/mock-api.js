import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// In-memory data store for mock API
const users = [
  { id: '123', email: 'paudcin@gmail.com', name: 'Test User', password: 'password123' }
];

const gifts = [
  { 
    id: '1', 
    userId: '123', 
    name: 'KitchenAid Mixer', 
    price: 299.99, 
    giver: 'Aunt Sarah', 
    occasion: 'Wedding', 
    date: '2023-06-15', 
    thankYouSent: false,
    notes: 'Red color, professional series'
  },
  { 
    id: '2', 
    userId: '123', 
    name: 'Le Creuset Dutch Oven', 
    price: 349.99, 
    giver: 'Uncle John', 
    occasion: 'Wedding', 
    date: '2023-06-15', 
    thankYouSent: true,
    notes: 'Blue color, 5.5 quart'
  }
];

const events = [
  {
    id: '1',
    userId: '123',
    name: 'Wedding',
    date: '2023-06-15',
    type: 'wedding',
    description: 'Our wedding day'
  }
];

// Middleware to check authentication
const authenticateToken = (req, res, next) => {
  console.log('Authentication middleware called');
  console.log('Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('Auth header:', authHeader);
  console.log('Token:', token);
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // In a real app, we would verify the JWT token
  // For mock purposes, we'll just check if it exists
  if (token !== 'mock-jwt-token') {
    console.log('Invalid token');
    return res.status(403).json({ message: 'Invalid token' });
  }
  
  console.log('Token validated successfully');
  // Add user ID to request for convenience
  req.userId = '123';
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Auth endpoints
app.post('/auth/signup', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    name: name || 'New User',
    password: password || 'defaultpassword'
  };
  
  users.push(newUser);
  
  // Simulate successful signup
  res.status(201).json({
    message: 'Signup successful',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    },
    token: 'mock-jwt-token'
  });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Find user
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  // In a real app, we would hash and compare passwords
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  // Simulate successful login
  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    token: 'mock-jwt-token'
  });
});

app.post('/auth/verify-email', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }
  
  // In a real app, we would verify the email token
  res.status(200).json({ message: 'Email verified successfully' });
});

app.post('/auth/reset-password', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  // In a real app, we would send a password reset email
  res.status(200).json({ message: 'Password reset email sent' });
});

app.post('/auth/update-password', (req, res) => {
  const { token, password } = req.body;
  
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }
  
  // In a real app, we would verify the token and update the password
  res.status(200).json({ message: 'Password updated successfully' });
});

// User profile endpoints
app.get('/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name
  });
});

app.put('/user/profile', authenticateToken, (req, res) => {
  const { name } = req.body;
  
  const userIndex = users.findIndex(u => u.id === req.userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Update user
  users[userIndex].name = name || users[userIndex].name;
  
  res.json({
    id: users[userIndex].id,
    email: users[userIndex].email,
    name: users[userIndex].name
  });
});

// Gift endpoints
app.get('/gifts', authenticateToken, (req, res) => {
  console.log('GET /gifts endpoint called');
  console.log('User ID:', req.userId);
  const userGifts = gifts.filter(gift => gift.userId === req.userId);
  console.log('User gifts:', userGifts);
  res.json(userGifts);
});

app.get('/gifts/:id', authenticateToken, (req, res) => {
  console.log('GET /gifts/:id endpoint called');
  console.log('Gift ID:', req.params.id);
  console.log('User ID:', req.userId);
  
  const gift = gifts.find(g => g.id === req.params.id && g.userId === req.userId);
  
  if (!gift) {
    console.log('Gift not found');
    return res.status(404).json({ message: 'Gift not found' });
  }
  
  console.log('Gift found:', gift);
  res.json(gift);
});

app.post('/gifts', authenticateToken, (req, res) => {
  console.log('POST /gifts endpoint called');
  console.log('Request body:', req.body);
  console.log('User ID:', req.userId);
  
  const { name, price, giver, occasion, date, notes } = req.body;
  
  if (!name || !giver || !occasion) {
    console.log('Missing required fields');
    return res.status(400).json({ message: 'Name, giver, and occasion are required' });
  }
  
  const newGift = {
    id: Date.now().toString(),
    userId: req.userId,
    name,
    price: price || 0,
    giver,
    occasion,
    date: date || new Date().toISOString().split('T')[0],
    thankYouSent: false,
    notes: notes || ''
  };
  
  console.log('New gift created:', newGift);
  gifts.push(newGift);
  
  res.status(201).json(newGift);
});

app.put('/gifts/:id', authenticateToken, (req, res) => {
  const giftIndex = gifts.findIndex(g => g.id === req.params.id && g.userId === req.userId);
  
  if (giftIndex === -1) {
    return res.status(404).json({ message: 'Gift not found' });
  }
  
  const { name, price, giver, occasion, date, thankYouSent, notes } = req.body;
  
  // Update gift
  gifts[giftIndex] = {
    ...gifts[giftIndex],
    name: name || gifts[giftIndex].name,
    price: price !== undefined ? price : gifts[giftIndex].price,
    giver: giver || gifts[giftIndex].giver,
    occasion: occasion || gifts[giftIndex].occasion,
    date: date || gifts[giftIndex].date,
    thankYouSent: thankYouSent !== undefined ? thankYouSent : gifts[giftIndex].thankYouSent,
    notes: notes !== undefined ? notes : gifts[giftIndex].notes
  };
  
  res.json(gifts[giftIndex]);
});

app.delete('/gifts/:id', authenticateToken, (req, res) => {
  const giftIndex = gifts.findIndex(g => g.id === req.params.id && g.userId === req.userId);
  
  if (giftIndex === -1) {
    return res.status(404).json({ message: 'Gift not found' });
  }
  
  // Remove gift
  gifts.splice(giftIndex, 1);
  
  res.status(204).send();
});

// Event endpoints
app.get('/events', authenticateToken, (req, res) => {
  const userEvents = events.filter(event => event.userId === req.userId);
  res.json(userEvents);
});

app.get('/events/:id', authenticateToken, (req, res) => {
  const event = events.find(e => e.id === req.params.id && e.userId === req.userId);
  
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  res.json(event);
});

app.post('/events', authenticateToken, (req, res) => {
  const { name, date, type, description } = req.body;
  
  if (!name || !date || !type) {
    return res.status(400).json({ message: 'Name, date, and type are required' });
  }
  
  const newEvent = {
    id: Date.now().toString(),
    userId: req.userId,
    name,
    date,
    type,
    description: description || ''
  };
  
  events.push(newEvent);
  
  res.status(201).json(newEvent);
});

app.put('/events/:id', authenticateToken, (req, res) => {
  const eventIndex = events.findIndex(e => e.id === req.params.id && e.userId === req.userId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  const { name, date, type, description } = req.body;
  
  // Update event
  events[eventIndex] = {
    ...events[eventIndex],
    name: name || events[eventIndex].name,
    date: date || events[eventIndex].date,
    type: type || events[eventIndex].type,
    description: description !== undefined ? description : events[eventIndex].description
  };
  
  res.json(events[eventIndex]);
});

app.delete('/events/:id', authenticateToken, (req, res) => {
  const eventIndex = events.findIndex(e => e.id === req.params.id && e.userId === req.userId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  // Remove event
  events.splice(eventIndex, 1);
  
  res.status(204).send();
});

// Payment endpoints
app.post('/payments/create-intent', authenticateToken, (req, res) => {
  const { amount, currency } = req.body;
  
  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }
  
  // In a real app, we would create a payment intent with Stripe
  res.json({
    clientSecret: 'mock_payment_intent_secret'
  });
});

app.post('/payments/create-subscription', authenticateToken, (req, res) => {
  const { priceId } = req.body;
  
  if (!priceId) {
    return res.status(400).json({ message: 'Price ID is required' });
  }
  
  // In a real app, we would create a subscription with Stripe
  res.json({
    subscriptionId: 'mock_subscription_id'
  });
});

app.post('/payments/cancel-subscription', authenticateToken, (req, res) => {
  const { subscriptionId } = req.body;
  
  if (!subscriptionId) {
    return res.status(400).json({ message: 'Subscription ID is required' });
  }
  
  // In a real app, we would cancel the subscription with Stripe
  res.json({ message: 'Subscription cancelled successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /health');
  console.log('  POST   /auth/signup');
  console.log('  POST   /auth/login');
  console.log('  POST   /auth/verify-email');
  console.log('  POST   /auth/reset-password');
  console.log('  POST   /auth/update-password');
  console.log('  GET    /user/profile');
  console.log('  PUT    /user/profile');
  console.log('  GET    /gifts');
  console.log('  GET    /gifts/:id');
  console.log('  POST   /gifts');
  console.log('  PUT    /gifts/:id');
  console.log('  DELETE /gifts/:id');
  console.log('  GET    /events');
  console.log('  GET    /events/:id');
  console.log('  POST   /events');
  console.log('  PUT    /events/:id');
  console.log('  DELETE /events/:id');
  console.log('  POST   /payments/create-intent');
  console.log('  POST   /payments/create-subscription');
  console.log('  POST   /payments/cancel-subscription');
}); 