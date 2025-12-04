# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, first, last, email, hashedPassword)
VALUES (
    'gold',
    'Gold',
    'User',
    'gold@example.com',
    '$2y$10$M0B3vE9e7H3rhP2WnA3CeOq9BYy9yNnMuZ7xm/D6tAOyZ5rMEtFCS'
);