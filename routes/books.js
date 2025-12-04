// routes/books.js

const express = require("express");
const router = express.Router();

/*
 * Updated redirectLogin that remembers where the user was trying to go.
 * This makes login redirection consistent across the whole application.
 */
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // Remember attempted URL (important for returning after login)
        req.session.returnTo = req.originalUrl;

        // Goldsmiths server path
        if (req.headers.host.includes("doc.gold.ac.uk")) {
            return res.redirect("/usr/441/users/login");
        }

        // Local login page
        return res.redirect("/users/login");
    }
    next();
};

// Show search page
router.get('/search', function(req, res, next) {
    res.render("search.ejs");
});

// Handle search results
router.get('/search_result', function(req, res, next) {
    const keyword = req.query.search_text;

    const sqlquery = "SELECT name, price FROM books WHERE name LIKE ?";
    const searchValue = '%' + keyword + '%';

    db.query(sqlquery, [searchValue], (err, results) => {
        if (err) return next(err);
        res.render('search_result.ejs', { searchResults: results, keyword: keyword });
    });
});

// List all books
router.get('/list', function(req, res, next) {
    const sqlquery = "SELECT * FROM books";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("list.ejs", { availableBooks: result });
    });
});

// Add book form (protected)
router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render("addbook.ejs");
});

// Handle form submission and save book (protected)
router.post('/addbook', redirectLogin, function(req, res, next) {
    const { name, price } = req.body;

    const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    db.query(sqlquery, [name, price], (err, result) => {
        if (err) return next(err);

        res.render('bookadded', { name: name, price: price });
    });
});

// Confirmation page
router.get('/bookadded', function(req, res, next) {
    res.send("<h1>Book successfully added to the database!</h1><a href='/books/list'>View all books</a>");
});

// Bargain books (price < £20)
router.get('/bargainbooks', function(req, res, next) {
    const sqlquery = "SELECT name, price FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render('bargainbooks.ejs', { bargainBooks: result });
    });
});

// Export router
module.exports = router;
