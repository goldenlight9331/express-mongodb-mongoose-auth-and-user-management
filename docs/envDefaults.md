## Database Configuration

- **DATABASE_URI**: `mongodb://localhost:27017/test`

## Application

- **PORT**: `5000`

## JWT Configuration

- **JWT_ALGORITHM**: `HS256 # Algorithm used to sign the token. You can use HS256, HS384, HS512, RS256, RS384, RS512, ES256, ES384, ES512, PS256, PS384, PS512`
- **JWT_SECRET_KEY**: `# You can generate a random secret using openssl rand -hex 64`
- **JWT_SHORT_EXPIRY**: `# 1 hour. You can set it to 1d for 1 day, 1h for 1 hour, 1m for 1 minute, etc.`
- **JWT_LONG_EXPIRY**: `# 1 week. You can set it to 1d for 1 day, 1h for 1 hour, 1m for 1 minute, etc.`
- **JWT_VERIFICATION_LINK_EXPIRY**: `# 1 hour. You can set it to 1d for 1 day, 1h for 1 hour, 1m for 1 minute, etc.`

## Email Configuration

- **USER_EMAIL**: `# Your email`
- **USER_PASSWORD**: `# Your email password`
- **EMAIL_HOST**: `smtp.gmail.com`
- **EMAIL_SERVICE**: `gmail`
- **EMAIL_PORT**: `587`


## Environment Configuration

- **NODE_ENV**: `development`