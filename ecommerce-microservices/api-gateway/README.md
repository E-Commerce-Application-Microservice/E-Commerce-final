# API Gateway
Central entry point routing requests to microservices.

## Endpoints
All service routes are proxied through `/api/<service>/...`

### Public Routes (no auth)
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `GET /api/products` — List products
- `GET /api/products/:id` — Product details
- `GET /api/search` — Search products
- `GET /api/categories` — Categories
- `GET /api/reviews/:productId` — Reviews
- `GET /api/trending` — Trending products

### Protected Routes (auth required)
- Cart, Wishlist, Orders, Payments, Invoices, Shipping, Reviews (write), Recommendations, Profile

### Admin Routes
- Dashboard, Product/Order/Inventory/User management
