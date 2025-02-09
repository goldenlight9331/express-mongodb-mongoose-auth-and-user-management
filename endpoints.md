# API Endpoints Documentation 📚

**Author:** Sharjeel Faiq  
**Description:** This document provides an overview of the API endpoints.

---

## Table of Contents 🗂️

1. [Auth Endpoints](#auth-endpoints)
2. [User Endpoints](#user-endpoints)
3. [Email Endpoints](#email-endpoints)

---

## Auth Endpoints 🔑

| **Method** | **Endpoint**                   | **Description**                                    |
| ---------- | ------------------------------ | -------------------------------------------------- |
| `POST`     | `/api/v1/auth/signup`          | Registers a new user account.                      |
| `POST`     | `/api/v1/auth/signin`          | Authenticates a user and provides a session token. |
| `POST`     | `/api/v1/auth/signout`         | Logs out the authenticated user.                   |
| `POST`     | `/api/v1/auth/forgot-password` | Sends a password reset link to the user's email.   |

---

## User Endpoints 👤

| **Method** | **Endpoint**           | **Description**                                    |
| ---------- | ---------------------- | -------------------------------------------------- |
| `GET`      | `/api/v1/user/get-all` | Retrieves all users and their respective metadata. |
| `GET`      | `/api/v1/user/:userId` | Retrieves a specific user by ID.                   |
| `PUT`      | `/api/v1/user/:userId` | Updates a specific user by ID.                     |
| `DELETE`   | `/api/v1/user/:userId` | Deletes a specific user by ID.                     |

---

## Email Endpoints 📧

| **Method** | **Endpoint**                              | **Description**                  |
| ---------- | ----------------------------------------- | -------------------------------- |
| `GET`      | `/api/v1/email/verify/:verificationToken` | Verifies a user's email address. |
| `POST`     | `/api/v1/email/send-verification`         | Sends a verification email.      |

## Notes

- **Authentication:** All endpoints require authentication unless otherwise
  specified.
- **Error Handling:** Ensure proper error handling mechanisms are in place for
  each API call, returning informative messages such as 404 (Not Found) or 500
  (Internal Server Error).
