# API Endpoints Documentation 📚

**Author:** Sharjeel Faiq  
**Description:** Overview of API endpoints for **authentication**, and **user
management**.

---

## Table of Contents 🗂️

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Management Endpoints](#user-management-endpoints)

---

## Authentication Endpoints 🔑

| **Method** | **Endpoint**           | **Description**                             |
| ---------- | ---------------------- | ------------------------------------------- |
| `POST`     | `/api/v1/auth/signup`  | Register a new user account.                |
| `POST`     | `/api/v1/auth/signin`  | Authenticate user and return session token. |
| `POST`     | `/api/v1/auth/signout` | Log out the authenticated user.             |

---

## User Management Endpoints 👤

| **Method** | **Endpoint**                         | **Description**                   |
| ---------- | ------------------------------------ | --------------------------------- |
| `GET`      | `/api/v1/users/get-all`              | Retrieve a list of all users.     |
| `GET`      | `/api/v1/users/get-by-id/:userId`    | Retrieve details of a user by ID. |
| `PUT`      | `/api/v1/users/update-by-id/:userId` | Update a user's details by ID.    |
| `DELETE`   | `/api/v1/users/delete-by-id/:userId` | Delete a user by ID.              |

---
