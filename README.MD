# Bertie's Books

## Overview

Sample web application for the Dynamic Web Applications module.

A small book shop app built with Node.js, Express, EJS templates, MySQL, session-based login, and a JSON API.

## Features

- Browse all books
- Add new books to the database
- Search for books (supports partial matches)
- View bargain books (priced under £20)
- User registration with hashed passwords
- User login with session-based authentication
- Login audit log (successful and failed attempts)
- Weather checker page using OpenWeather API
- JSON API for external developers
- Search, price filtering, and sorting options in API
- Logout route
- Access control using redirectLogin
- Styled using main.css

## Installation

**Clone the repository:**
```bash
git clone <repository-url>
cd <repository-folder>
```

**Install dependencies:**
```bash
npm install
```

**Set up MySQL:**

Create the database and configure your `.env` file with database credentials.

## Project Structure

### Authentication & Access Control

**Sessions**

Configured using express-session in index.js.

**Login**

When a user logs in successfully, the session stores:
- `req.session.userId`
- `req.session.first`
- `req.session.last`

Passwords are hashed using bcrypt.

**Logout**

A logout route is available at `/logout`. This destroys the session and logs the user out.

## Routes

**Protected Routes (Login Required):**

```
/users/list
/users/audit
/logout
/books/addbook
/books/list
/weather
```

**Public Routes:**

```
/
/about
/users/login
/users/register
/books/search
/books/search_result
/books/bargainbooks
```

## API Documentation

**Base URL:** `/api/books`

### Get All Books

Returns every book in the database.

**Request:**
```
GET /api/books
```

**Example Response:**
```json
[
    { "id": 1, "name": "Brighton Rock", "price": 20.25 },
    { "id": 2, "name": "Animal Farm", "price": 12.99 }
]
```

---

### Search for Books by Keyword

Returns books whose names contain the search term.

**Request:**
```
GET /api/books?search=world
```

---

### Filter Books by Price Range

Returns books between the given minimum and maximum price.

**Request:**
```
GET /api/books?min_price=5&max_price=10
```

---

### Sort Results

Sort alphabetically by name:
```
GET /api/books?sort=name
```

Sort by ascending price:
```
GET /api/books?sort=price
```

---

### Combined Example

Search + price filter + sorting:
```
GET /api/books?search=world&min_price=5&max_price=20&sort=price
```
