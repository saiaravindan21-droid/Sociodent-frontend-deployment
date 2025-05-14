import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import razorpayRoutes from './routes/razorpay.js';
import { HashRouter as Router } from 'react-router-dom';
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/razorpay', razorpayRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});