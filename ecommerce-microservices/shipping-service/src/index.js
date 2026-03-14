const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/shippingdb';
mongoose.connect(MONGO_URI).then(() => console.log('Shipping Service: MongoDB connected')).catch(err => console.error(err));

const shippingSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: String,
  trackingNumber: { type: String, unique: true },
  carrier: { type: String, default: 'FastShip' },
  status: { type: String, enum: ['processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'], default: 'processing' },
  estimatedDelivery: Date,
  updates: [{
    status: String,
    location: String,
    timestamp: { type: Date, default: Date.now },
    description: String
  }],
  shippingAddress: {
    name: String, address: String, city: String, state: String, zipCode: String
  },
  createdAt: { type: Date, default: Date.now }
});
const Shipping = mongoose.model('Shipping', shippingSchema);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'shipping-service' }));

// Create shipping record
app.post('/shipping', async (req, res) => {
  try {
    const { orderId, userId, estimatedDelivery, shippingAddress } = req.body;
    const trackingNumber = 'TRACK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const shipping = await Shipping.create({
      orderId, userId, trackingNumber, estimatedDelivery, shippingAddress,
      updates: [{ status: 'processing', location: 'Warehouse', description: 'Order received and being processed' }]
    });
    res.status(201).json(shipping);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get shipping status
app.get('/shipping/:orderId', async (req, res) => {
  try {
    const shipping = await Shipping.findOne({ orderId: req.params.orderId });
    if (!shipping) return res.status(404).json({ error: 'Shipping record not found' });
    res.json(shipping);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update shipping status (admin)
app.put('/shipping/:orderId', async (req, res) => {
  try {
    const { status, location, description } = req.body;
    const shipping = await Shipping.findOneAndUpdate(
      { orderId: req.params.orderId },
      {
        status,
        $push: { updates: { status, location, description, timestamp: Date.now() } }
      },
      { new: true }
    );
    res.json({ message: 'Shipping updated', shipping });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get all shipments (admin)
app.get('/shipments', async (req, res) => {
  try {
    const shipments = await Shipping.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Track by tracking number
app.get('/track/:trackingNumber', async (req, res) => {
  try {
    const shipping = await Shipping.findOne({ trackingNumber: req.params.trackingNumber });
    if (!shipping) return res.status(404).json({ error: 'Tracking not found' });
    res.json(shipping);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3011;
app.listen(PORT, () => console.log(`Shipping Service running on port ${PORT}`));
