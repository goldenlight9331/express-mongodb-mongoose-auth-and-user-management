# MongoDB connection string for development (local) and production (remote).
MONGO_URI="mongodb://localhost:27017/test"

# Generate JWT Secret by running the following command in the terminal: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET_KEY=your_secret_key_here

# JWT token expiry time. Example values: '1h' for 1 hour, '7d' for 7 days. 
JWT_SHORT_EXPIRATION_TIME=1h
JWT_LONG_EXPIRATION_TIME=30d

# Port number
PORT=3000

# Node environment
NODE_ENV=development

# Email configuration
EMAIL_USER=YOUR_EMAIL
EMAIL_PASSWORD=YOUR_PASSWORD