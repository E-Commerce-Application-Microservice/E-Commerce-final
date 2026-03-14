# Shipping Service
Shipping and delivery tracking.

## Endpoints
- `POST /shipping` — Create shipping record
- `GET /shipping/:orderId` — Get shipping status
- `PUT /shipping/:orderId` — Update status (admin)
- `GET /shipments` — List all shipments (admin)
- `GET /track/:trackingNumber` — Track by number
- `GET /health` — Health check
