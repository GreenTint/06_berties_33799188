Bertie's Books

Sample web application for the Dynamic Web Applications module.

A small book shop app built with Node.js, Express, EJS templates, MySQL, and session-based login.

Features

Browse all books

Add new books to the database

Search for books (supports partial matches)

View bargain books (priced under £20)

User registration with hashed passwords

User login with session-based authentication

Logout route

Access control using redirectLogin

Styled using main.css

Installation

Clone the repository:

git clone <repository-url>
cd <repository-folder>


Install dependencies:

npm install


Make sure you have MySQL installed and running.

Create the database:

CREATE DATABASE berties_books;


Create the user:

CREATE USER 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';


Create the books table:

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);


Create the users table:

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    first VARCHAR(255),
    last VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    hashedPassword VARCHAR(255)
);


Create the login audit table:

CREATE TABLE login_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    success BOOLEAN,
    loginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Running the Application

Start the server:

node index.js


Then open:

http://localhost:8000/

Project Structure
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

Authentication & Access Control
Sessions

Configured using express-session in index.js.

Login

When a user logs in successfully, the following session data is stored:

req.session.userId

req.session.first

req.session.last

Passwords are hashed using bcrypt.

Logout

A logout route is available at:

/logout


This destroys the session and logs the user out.

redirectLogin Middleware

A reusable function is used to block access to protected pages:

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        next();
    }
};

Access Control Summary (Task 5)
Protected Routes (Login Required)

/users/list – Shows registered users

/users/audit – Shows login attempts

/logout – Only logged-in users can log out

/books/addbook (both GET and POST) – Adding books requires login

/books/list – (Chosen to be protected) shows full book list

Public Routes (No Login Required)

/ – Home

/about – About page

/users/login – Login page

/users/register – Registration page

/books/search – Search for books

/books/search_result – Search results

/books/bargainbooks – Bargain books

Testing

When logged out:

Visiting protected pages redirects to /users/login.

When logged in:

Protected pages load normally and functionality works.

Dependencies

Express

EJS

mysql2

bcrypt

express-session

dotenv

License

This project is for educational purposes.
