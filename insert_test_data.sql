# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, first, last, email, hashedPassword)
VALUES (
    'gold',
    'Gold',
    'User',
    'gold@example.com',
    '$2b$10$tN1wBiusN5rETFlEML59oOXsRae2YeSZa/MP0ycX6B2KdikmosCRm'
)
ON DUPLICATE KEY UPDATE
    hashedPassword = VALUES(hashedPassword),
    first = VALUES(first),
    last = VALUES(last),
    email = VALUES(email);
