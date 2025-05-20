import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
// Debug stripe key
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);

// Add error handling for undefined key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

app.use(cors());
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/dashboard?checkout=success',
      cancel_url: 'http://localhost:5173/pricing?checkout=cancel',
    });
    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 