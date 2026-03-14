# Product Service
Product catalog management with CRUD operations.

## Endpoints
- `GET /products` — List products (with filters/sort/pagination)
- `GET /products/:id` — Get product by ID
- `GET /products/:id/similar` — Get similar products
- `GET /products/category/:category` — Products by category
- `GET /categories` — List all categories
- `POST /products` — Create product (admin)
- `PUT /products/:id` — Update product (admin)
- `DELETE /products/:id` — Delete product (admin)
- `PUT /products/:id/rating` — Update product rating
- `GET /health` — Health check

## Environment Variables
- `PORT` — Service port (default: 3003)
- `MONGO_URI` — MongoDB connection string
