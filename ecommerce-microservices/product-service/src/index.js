const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/productdb';
mongoose.connect(MONGO_URI).then(() => console.log('Product Service: MongoDB connected')).catch(err => console.error(err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [{ type: String }],
  category: { type: String, required: true },
  size: [{ type: String }],
  color: [{ type: String }],
  brand: { type: String },
  availability: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  deliveryDays: { type: Number, default: 5 },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ name: 'text', description: 'text', tags: 'text', category: 'text' });
const Product = mongoose.model('Product', productSchema);

// Seed sample products
async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const sampleProducts = [
      { name: 'Premium Wireless Headphones', description: 'High-quality noise-cancelling wireless headphones with 30-hour battery life and premium sound quality.', price: 149.99, originalPrice: 199.99, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], category: 'Electronics', size: ['One Size'], color: ['Black', 'White', 'Blue'], brand: 'SoundMax', availability: true, stock: 50, rating: 4.5, reviewCount: 128, deliveryDays: 3, tags: ['headphones', 'wireless', 'audio', 'premium'], featured: true },
      { name: 'Classic Leather Jacket', description: 'Genuine leather jacket with a modern slim fit design. Perfect for casual and semi-formal occasions.', price: 249.99, originalPrice: 349.99, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'], category: 'Fashion', size: ['S', 'M', 'L', 'XL'], color: ['Black', 'Brown'], brand: 'UrbanStyle', availability: true, stock: 30, rating: 4.7, reviewCount: 89, deliveryDays: 5, tags: ['jacket', 'leather', 'fashion', 'men'], featured: true },
      { name: 'Smart Fitness Watch', description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.', price: 199.99, originalPrice: 249.99, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'], category: 'Electronics', size: ['One Size'], color: ['Black', 'Silver', 'Rose Gold'], brand: 'FitTech', availability: true, stock: 75, rating: 4.3, reviewCount: 256, deliveryDays: 2, tags: ['watch', 'fitness', 'smart', 'wearable'], featured: true },
      { name: 'Organic Coffee Beans', description: 'Premium single-origin organic coffee beans from Colombia. Rich aroma and smooth taste.', price: 24.99, originalPrice: 34.99, images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'], category: 'Food & Beverages', size: ['250g', '500g', '1kg'], color: [], brand: 'BrewMaster', availability: true, stock: 200, rating: 4.8, reviewCount: 412, deliveryDays: 3, tags: ['coffee', 'organic', 'beverages'], featured: false },
      { name: 'Minimalist Desk Lamp', description: 'Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.', price: 59.99, originalPrice: 79.99, images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'], category: 'Home & Living', size: ['One Size'], color: ['White', 'Black', 'Wood'], brand: 'LumiHome', availability: true, stock: 40, rating: 4.4, reviewCount: 67, deliveryDays: 4, tags: ['lamp', 'desk', 'LED', 'home'], featured: false },
      { name: 'Running Shoes Pro', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', price: 129.99, originalPrice: 159.99, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], category: 'Sports', size: ['7', '8', '9', '10', '11', '12'], color: ['Red', 'Blue', 'Black', 'White'], brand: 'SprintMax', availability: true, stock: 60, rating: 4.6, reviewCount: 198, deliveryDays: 3, tags: ['shoes', 'running', 'sports', 'athletic'], featured: true },
      { name: 'Portable Bluetooth Speaker', description: 'Waterproof portable speaker with 360-degree sound and 12-hour battery life.', price: 79.99, originalPrice: 99.99, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'], category: 'Electronics', size: ['One Size'], color: ['Black', 'Blue', 'Red', 'Green'], brand: 'SoundMax', availability: true, stock: 90, rating: 4.2, reviewCount: 145, deliveryDays: 2, tags: ['speaker', 'bluetooth', 'portable', 'audio'], featured: false },
      { name: 'Silk Evening Dress', description: 'Elegant silk evening dress with a flowing silhouette. Perfect for special occasions.', price: 189.99, originalPrice: 259.99, images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'], category: 'Fashion', size: ['XS', 'S', 'M', 'L'], color: ['Red', 'Navy', 'Black', 'Emerald'], brand: 'GlamourHouse', availability: true, stock: 25, rating: 4.9, reviewCount: 43, deliveryDays: 5, tags: ['dress', 'silk', 'evening', 'women', 'formal'], featured: true },
      { name: 'Stainless Steel Water Bottle', description: 'Double-walled vacuum insulated water bottle. Keeps drinks cold for 24hrs and hot for 12hrs.', price: 34.99, originalPrice: 44.99, images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'], category: 'Sports', size: ['500ml', '750ml', '1L'], color: ['Silver', 'Black', 'Blue', 'Pink'], brand: 'HydroElite', availability: true, stock: 150, rating: 4.5, reviewCount: 320, deliveryDays: 2, tags: ['bottle', 'water', 'insulated', 'sports'], featured: false },
      { name: 'Wireless Charging Pad', description: 'Fast wireless charger compatible with all Qi-enabled devices. Sleek minimalist design.', price: 29.99, originalPrice: 39.99, images: ['https://images.unsplash.com/photo-1586953208270-767889fa9b0e?w=500'], category: 'Electronics', size: ['One Size'], color: ['White', 'Black'], brand: 'ChargePro', availability: true, stock: 120, rating: 4.1, reviewCount: 87, deliveryDays: 2, tags: ['charger', 'wireless', 'electronics', 'accessories'], featured: false },
      { name: 'Yoga Mat Premium', description: 'Extra thick non-slip yoga mat with alignment lines. Eco-friendly TPE material.', price: 49.99, originalPrice: 69.99, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'], category: 'Sports', size: ['Standard', 'Extended'], color: ['Purple', 'Blue', 'Pink', 'Green'], brand: 'ZenFlex', availability: true, stock: 80, rating: 4.7, reviewCount: 234, deliveryDays: 3, tags: ['yoga', 'mat', 'fitness', 'exercise'], featured: false },
      { name: 'Canvas Backpack', description: 'Durable canvas backpack with laptop compartment. Vintage-inspired design with modern functionality.', price: 69.99, originalPrice: 89.99, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'], category: 'Accessories', size: ['One Size'], color: ['Khaki', 'Navy', 'Gray', 'Black'], brand: 'TrailBlaze', availability: true, stock: 45, rating: 4.4, reviewCount: 156, deliveryDays: 4, tags: ['backpack', 'canvas', 'laptop', 'travel'], featured: true },
      { name: 'Ceramic Plant Pot Set', description: 'Set of 3 minimalist ceramic plant pots with bamboo saucers. Perfect for succulents.', price: 39.99, originalPrice: 54.99, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500'], category: 'Home & Living', size: ['Small Set', 'Large Set'], color: ['White', 'Terracotta', 'Gray'], brand: 'GreenNest', availability: true, stock: 35, rating: 4.6, reviewCount: 78, deliveryDays: 5, tags: ['plants', 'ceramic', 'home', 'decor'], featured: false },
      { name: 'Gaming Mechanical Keyboard', description: 'RGB mechanical gaming keyboard with Cherry MX switches. N-key rollover and macro support.', price: 139.99, originalPrice: 179.99, images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500'], category: 'Electronics', size: ['Full Size', 'TKL'], color: ['Black', 'White'], brand: 'GameForce', availability: true, stock: 55, rating: 4.8, reviewCount: 312, deliveryDays: 2, tags: ['keyboard', 'gaming', 'mechanical', 'RGB'], featured: true },
      { name: 'Aromatherapy Candle Set', description: 'Hand-poured soy wax candles in 3 soothing scents: Lavender, Vanilla, and Eucalyptus.', price: 44.99, originalPrice: 59.99, images: ['https://images.unsplash.com/photo-1602607450006-1b831f8e1cde?w=500'], category: 'Home & Living', size: ['3-Pack', '6-Pack'], color: [], brand: 'SereneHome', availability: true, stock: 65, rating: 4.5, reviewCount: 189, deliveryDays: 4, tags: ['candle', 'aromatherapy', 'soy', 'home'], featured: false },
      { name: 'Denim Jacket Classic', description: 'Classic denim jacket with a relaxed fit. Timeless style that pairs with everything.', price: 89.99, originalPrice: 119.99, images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'], category: 'Fashion', size: ['S', 'M', 'L', 'XL', 'XXL'], color: ['Light Blue', 'Dark Blue', 'Black'], brand: 'UrbanStyle', availability: true, stock: 40, rating: 4.3, reviewCount: 95, deliveryDays: 4, tags: ['denim', 'jacket', 'casual', 'unisex'], featured: false },
      { name: 'Smart Home Hub', description: 'Central smart home controller compatible with 100+ devices. Voice control and automation.', price: 119.99, originalPrice: 149.99, images: ['https://images.unsplash.com/photo-1558089687-f282d2bc0f21?w=500'], category: 'Electronics', size: ['One Size'], color: ['White', 'Charcoal'], brand: 'HomeIQ', availability: true, stock: 30, rating: 4.0, reviewCount: 67, deliveryDays: 3, tags: ['smart home', 'hub', 'IoT', 'automation'], featured: false },
      { name: 'Artisan Chocolate Box', description: 'Luxury handmade chocolate assortment. 24 pieces of premium dark, milk, and white chocolate.', price: 54.99, originalPrice: 74.99, images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'], category: 'Food & Beverages', size: ['12-Piece', '24-Piece'], color: [], brand: 'CocoaLuxe', availability: true, stock: 70, rating: 4.9, reviewCount: 203, deliveryDays: 2, tags: ['chocolate', 'gift', 'luxury', 'artisan'], featured: true },
      { name: 'Sunglasses Aviator', description: 'Polarized aviator sunglasses with UV400 protection. Lightweight titanium frame.', price: 79.99, originalPrice: 109.99, images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'], category: 'Accessories', size: ['One Size'], color: ['Gold/Brown', 'Silver/Gray', 'Black/Black'], brand: 'ShadeCraft', availability: true, stock: 95, rating: 4.4, reviewCount: 167, deliveryDays: 3, tags: ['sunglasses', 'aviator', 'polarized', 'accessories'], featured: false },
      { name: 'Electric Stand Mixer', description: 'Professional-grade stand mixer with 10-speed control. Includes 3 attachments for baking.', price: 299.99, originalPrice: 399.99, images: ['https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500'], category: 'Home & Living', size: ['5-Quart', '7-Quart'], color: ['Red', 'White', 'Black', 'Pastel Blue'], brand: 'BakeElite', availability: true, stock: 20, rating: 4.8, reviewCount: 445, deliveryDays: 5, tags: ['mixer', 'kitchen', 'baking', 'appliance'], featured: true }
    ];
    await Product.insertMany(sampleProducts);
    console.log('Sample products seeded');
  }
}
seedProducts();

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));

// Get all products
app.get('/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, limit = 50, page = 1, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) { filter.price = {}; if (minPrice) filter.price.$gte = Number(minPrice); if (maxPrice) filter.price.$lte = Number(maxPrice); }
    if (featured === 'true') filter.featured = true;

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products by category
app.get('/products/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get similar products
app.get('/products/:id/similar', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const similar = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(6);
    res.json(similar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product (admin)
app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product (admin)
app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (admin)
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product rating
app.put('/products/:id/rating', async (req, res) => {
  try {
    const { rating, reviewCount } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { rating, reviewCount }, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
