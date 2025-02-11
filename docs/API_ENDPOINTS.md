# API Endpoints Documentation 📚

**Author:** Sharjeel Faiq  
**Description:** This document provides an overview of the API endpoints for Student Tutor Hub.

---

## Table of Contents 🗂️

1. [Auth Endpoints](#auth-endpoints)
2. [User Endpoints](#user-endpoints)
3. [Email Endpoints](#email-endpoints)

---

## Auth Endpoints 🔑

| **Method** | **Endpoint**              | **Description**                                    |
| ---------- | ------------------------- | -------------------------------------------------- |
| `POST`     | `/api/v1/signup`          | Registers a new user account.                      |
| `POST`     | `/api/v1/signin`          | Authenticates a user and provides a session token. |
| `POST`     | `/api/v1/signout`         | Logs out the authenticated user.                   |
| `POST`     | `/api/v1/forgot-password` | Sends a password reset link to the user's email.   |

---

## User Endpoints 👤

| **Method** | **Endpoint**            | **Description**                                    |
| ---------- | ----------------------- | -------------------------------------------------- |
| `GET`      | `/api/v1/users`         | Retrieves all users and their respective metadata. |
| `GET`      | `/api/v1/users/:userId` | Retrieves a specific user by ID.                   |
| `PUT`      | `/api/v1/users/:userId` | Updates a specific user by ID.                     |
| `DELETE`   | `/api/v1/users/:userId` | Deletes a specific user by ID.                     |

---

## Email Endpoints 📧

| **Method** | **Endpoint**                              | **Description**                  |
| ---------- | ----------------------------------------- | -------------------------------- |
| `GET`      | `/api/v1/verify-email/:verificationToken` | Verifies a user's email address. |
| `POST`     | `/api/v1/send-verification-email`               | Sends a verification email.      |

## Notes

- **Authentication:** All endpoints require authentication unless otherwise
  specified.
- **Error Handling:** Ensure proper error handling mechanisms are in place for
  each API call, returning informative messages such as 404 (Not Found) or 500
  (Internal Server Error).
