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

**Get all books**
