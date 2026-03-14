# Admin Service
Admin management — proxies to other services.

## Endpoints
- `GET /admin/dashboard` — Dashboard stats
- `POST /admin/products` — Add product
- `PUT /admin/products/:id` — Update product
- `DELETE /admin/products/:id` — Delete product
- `GET /admin/orders` — List orders
- `PUT /admin/orders/:id/status` — Update order status
- `GET /admin/inventory` — List inventory
- `PUT /admin/inventory/:productId` — Update stock
- `GET /admin/users` — List users
- `PUT /admin/shipping/:orderId` — Update shipping
- `GET /health` — Health check
