# API Endpoints Documentation

**Author:** Sharjeel Faiq  
**Description:** This document provides an overview of the API endpoints for
user authentication, email verification, and user and site management.

---

## Table of Contents

1. [Auth Endpoints](#auth-endpoints)
1. [User Endpoints](#user-endpoints)

---

## Auth Endpoints

| **Method** | **Endpoint**           | **Description**                                    |
| ---------- | ---------------------- | -------------------------------------------------- |
| `POST`     | `/api/v1/auth/signup`  | Registers a new user account.                      |
| `POST`     | `/api/v1/auth/signin`  | Authenticates a user and provides a session token. |
| `POST`     | `/api/v1/auth/signout` | Logs out the authenticated user.                   |

---

## User Endpoints

| **Method** | **Endpoint**           | **Description**                                    |
| ---------- | ---------------------- | -------------------------------------------------- |
| `GET`      | `/api/v1/users`        | Retrieves a list of all users.                     |
| `GET`      | `/api/v1/users/:id`    | Retrieves a specific user by ID.                   |
| `PUT`      | `/api/v1/users/:id`    | Updates a specific user by ID.                     |
| `DELETE`   | `/api/v1/users/:id`    | Deletes a specific user by ID.                     |

---