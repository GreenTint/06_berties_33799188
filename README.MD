# Bertie's Books

Sample web application for the Dynamic Web Applications module.

A small book shop app built with Node.js, Express, EJS templates, MySQL, and session-based login.

---

## Features

- **Browse all books**
- **Add new books to the database**
- **Search for books** (supports partial matches)
- **View bargain books** (priced under £20)
- **User registration with hashed passwords**
- **User login with session-based authentication**
- **Logout route**
- **Access control using `redirectLogin`**
- **Styled using `main.css`**

---

## Installation

1. **Clone the repository**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Set up MySQL**

    - **Create the database:**
        ```sql
        CREATE DATABASE berties_books;
        ```

    - **Create the user:**
        ```sql
        CREATE USER 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
        GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
        ```

    - **Create the books table:**
        ```sql
        CREATE TABLE books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL
        );
        ```

    - **Create the users table:**
        ```sql
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE,
            first VARCHAR(255),
            last VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            hashedPassword VARCHAR(255)
        );
        ```

    - **Create the login audit table:**
        ```sql
        CREATE TABLE login_audit (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255),
            success BOOLEAN,
            loginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ```

---

## Running the Application

- **Start the server:**

    ```bash
    node index.js
    ```

- **Open the browser:**

    [http://localhost:8000/](http://localhost:8000/)

---

## Project Structure

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

---

## Authentication & Access Control

### Sessions

Configured using `express-session` in `index.js`.

### Login

When a user logs in successfully, the session stores:

- `req.session.userId`
- `req.session.first`
- `req.session.last`

Passwords are hashed using **bcrypt**.

### Logout

A logout route is available at:

```
/logout
```

This destroys the session and logs the user out.

### `redirectLogin` Middleware

Used to protect pages:

```js
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        next();
    }
};
```

---

## Access Control Summary (Task 5)

**Protected Routes (Login Required):**

- `/users/list`
- `/users/audit`
- `/logout`
- `/books/addbook` (GET and POST)
- `/books/list`

**Public Routes:**

- `/`
- `/about`
- `/users/login`
- `/users/register`
- `/books/search`
- `/books/search_result`
- `/books/bargainbooks`

---

## Testing

- When logged out, visiting protected pages redirects to `/users/login`.
- When logged in, protected pages load normally and work correctly.

---

## Dependencies

- express
- ejs
- bcrypt
- express-session
- dotenv

---

## License

This project is for educational use only.
