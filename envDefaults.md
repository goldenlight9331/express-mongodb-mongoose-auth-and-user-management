# MongoDB connection string for development (local) and production (remote).
MONGO_URI="mongodb://localhost:27017/test"

# Server port number (3000 for dev, 80/443 for prod).
PORT=

# Secret key for JWT tokens (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))").
JWT_SECRET=

# JWT token expiry time (e.g., '1h' for 1 hour, '7d' for 7 days).
JWT_EXPIRY=

# HTTP-only flag for cookies (true to prevent client-side access).
COOKIE_HTTP_ONLY=

# SameSite attribute for cookies ('Strict', 'Lax', or 'None').
COOKIE_SAME_SITE=

# Secure flag for cookies (true to send only over HTTPS).
COOKIE_SECURE=

# Maximum age for cookies in milliseconds (e.g., 86400000 for 1 day).
COOKIE_MAX_AGE=
