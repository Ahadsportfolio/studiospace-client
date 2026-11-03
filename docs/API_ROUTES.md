# API Routes

| Method | Path | Auth | Purpose | Codes |
|---|---|---|---|---|
| GET | /api/health | no | health check | 200 |
| POST | /api/auth/jwt | verified identity | issue HTTPOnly JWT cookie | 200, 401 |
| POST | /api/auth/logout | no | clear cookie | 200 |
| GET | /api/auth/me | JWT | current user | 200, 401 |
| GET | /api/studios | no | list; query: search, category, minPrice, maxPrice, sort, page, limit | 200 |
| GET | /api/studios/categories/counts | no | counts per category | 200 |
| GET | /api/studios/mine | JWT | own studios | 200, 401 |
| GET | /api/studios/:id | no | details | 200, 400, 404 |
| GET | /api/studios/:id/availability?date= | no | Confirmed ranges for a day | 200, 400 |
| POST | /api/studios | JWT | create | 201, 400, 401 |
| PUT | /api/studios/:id | JWT + owner | update | 200, 400, 401, 403, 404 |
| DELETE | /api/studios/:id | JWT + owner | delete | 200, 401, 403, 404 |
| POST | /api/bookings | JWT | create Pending (overlap check) | 201, 400, 401, 403, 404, 409 |
| GET | /api/bookings/my | JWT | my bookings | 200, 401 |
| GET | /api/bookings/host | JWT | requests for my studios | 200, 401 |
| PATCH | /api/bookings/:id/cancel | JWT + booker | cancel if Pending | 200, 400, 401, 403, 404 |
| PATCH | /api/bookings/:id/status | JWT + host | Confirmed / Completed / Cancelled | 200, 400, 401, 403, 404, 409 |
| POST | /api/wishlist/:studioId | JWT | toggle (optional) | 200, 401 |
| GET | /api/wishlist | JWT | list (optional) | 200, 401 |

Error shape: `{ "message": "human readable text" }`
