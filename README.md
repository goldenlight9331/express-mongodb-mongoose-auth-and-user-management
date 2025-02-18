## Scripts 🐜

The `package.json` file contains several useful scripts:

- `npm start`: Starts the production server.
- `npm run dev`: Starts the development server with Nodemon for automatic restarts.
- `npm run seed`: Seeds the database with initial data using the script.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run lint:fix`: Runs ESLint and fixes issues automatically.
- `npm run format`: Formats the code using Prettier.

## API Endpoints 📌

See the [API Endpoints Documentation] for a comprehensive list of endpoints, their descriptions, and required parameters.

Here is a quick overview:

### Auth Endpoints 🔑

| Method | Endpoint                  | Description                                        |
| ------ | ------------------------- | -------------------------------------------------- |
| `POST` | `/api/v1/signup`          | Registers a new user account.                      |
| `POST` | `/api/v1/signin`          | Authenticates a user and provides a session token. |
| `POST` | `/api/v1/signout`         | Logs out the authenticated user.                   |
| `POST` | `/api/v1/forgot-password` | Sends a password reset link.                       |

### User Endpoints 👤

| Method   | Endpoint           | Description                      |
| -------- | ------------------ | -------------------------------- |
| `GET`    | `/api/v1/user/`    | Retrieves all users.             |
| `GET`    | `/api/v1/user/:id` | Retrieves a specific user by ID. |
| `PATCH`  | `/api/v1/user/:id` | Updates a specific user by ID.   |
| `DELETE` | `/api/v1/user/:id` | Deletes a specific user by ID.   |

### Email Endpoints 📧

| Method | Endpoint                                  | Description                      |
| ------ | ----------------------------------------- | -------------------------------- |
| `GET`  | `/api/v1/verify-email/:verificationToken` | Verifies a user's email address. |
| `POST` | `/api/v1/send-verification-email`         | Sends a verification email.      |

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Submit a pull request.

## Author ✍️

**Sharjeel Faiq**
