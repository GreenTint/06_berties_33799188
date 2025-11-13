#Bertie's Books

Sample web application for the Dynamic Web Applications module.

A small book shop app built with Node.js, Express, and EJS templates.

#Features

Browse all books.

Add new books to the database.

Search for books (including partial matches).

List bargain books (priced under £20).

Simple registration page for users.

Fully styled using a CSS stylesheet (main.css).

#Installation

Clone the repository:

git clone <repository-url>
cd <repository-folder>


Install dependencies:

npm install


Make sure you have MySQL installed and running.

Create a database berties_books and a user berties_books_app with the password qwertyuiop.

Create the books table in your database:

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

Running the Application
node index.js


Then open your browser and go to:

http://localhost:8000/

Project Structure
.
├── index.js             # Main server file
├── routes/
│   └── books.js         # Routes for book-related pages
├── views/               # EJS templates
│   ├── index.ejs
│   ├── search.ejs
│   ├── search_result.ejs
│   ├── list.ejs
│   ├── addbook.ejs
│   ├── bookadded.ejs
│   └── bargainbooks.ejs
├── public/
│   └── main.css         # Stylesheet
└── package.json

Dependencies

Express

EJS

mysql2

License

This project is for educational purposes.
