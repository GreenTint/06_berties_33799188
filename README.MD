# Bertie's Books

Sample Node.js web application for the Dynamic Web Applications module. Bertie's Books is a small shop app built with Express, EJS, MySQL, and session-based authentication.

## Features

- Browse, search, and list bargain books (priced under £20)
- Add new books to the database
- User registration with hashed passwords (bcrypt)
- Session-based login, logout, and access control middleware
- Login audit trail

## Prerequisites

- Node.js and npm
- MySQL server

## Installation

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file based on the database credentials you plan to use (defaults are in `index.js`).

3. **Set up the MySQL schema**

   ```sql
   CREATE DATABASE berties_books;

   CREATE USER 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
   GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';

   USE berties_books;

   CREATE TABLE books (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       price DECIMAL(10,2) NOT NULL
   );

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) UNIQUE,
       first VARCHAR(255),
       last VARCHAR(255),
       email VARCHAR(255) UNIQUE,
       hashedPassword VARCHAR(255)
   );

   CREATE TABLE login_audit (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255),
       success BOOLEAN,
       loginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

   You can also run `create_db.sql` and `insert_test_data.sql` to create the schema and seed data.

## Running the application

```bash
node index.js
```

Visit `http://localhost:8000/` in your browser.

## Project structure

```
index.js
routes/
  main.js
  users.js
  books.js
views/
  index.ejs
  about.ejs
  login.ejs
  register.ejs
  listusers.ejs
  search.ejs
  search_result.ejs
  list.ejs
  addbook.ejs
  bargainbooks.ejs
  audit.ejs
  bookadded.ejs
public/
  main.css
package.json
```

## Authentication & access control

- Sessions configured via `express-session` in `index.js`
- Password hashing using `bcrypt`
- Logout route at `/logout` destroys the session
- `redirectLogin` middleware protects private pages:

  ```js
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect('/users/login');
    } else {
      next();
    }
  };
  ```

### Protected routes (login required)

- `/users/list`
- `/users/audit`
- `/logout`
- `/books/addbook` (GET and POST)
- `/books/list`

### Public routes

- `/`
- `/about`
- `/users/login`
- `/users/register`
- `/books/search`
- `/books/search_result`
- `/books/bargainbooks`

## Testing notes

- When logged out, protected pages redirect to `/users/login`.
- When logged in, protected pages load normally and allow the intended actions.

## Dependencies

- express
- ejs
- mysql2
- bcrypt
- express-session
- dotenv

## License

This project is provided for educational purposes.
