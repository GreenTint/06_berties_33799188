-- Create database script for Berties Books

-- Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

-- Create the books table
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5,2),
    PRIMARY KEY(id)
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    first VARCHAR(100),
    last VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    hashedPassword VARCHAR(255)
);

-- Create the login_audit table
CREATE TABLE IF NOT EXISTS login_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    success BOOLEAN,
    loginTime DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the application user and grant privileges
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';

FLUSH PRIVILEGES;
