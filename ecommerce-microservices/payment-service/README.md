# Payment Service
Payment processing and management.

## Endpoints
- `POST /payments/process` — Process payment
- `GET /payments/:orderId` — Get payment by order
- `GET /payments` — List all payments (admin)
- `POST /payments/:paymentId/refund` — Process refund
- `GET /health` — Health check
