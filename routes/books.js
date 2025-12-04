// routes/books.js

const express = require("express");
const router = express.Router();

/*
 * redirectLogin middleware with automatic base path detection.
 * Ensures correct redirection on both localhost and Goldsmiths server.
 */
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // Remember attempted URL for redirect after login
        req.session.returnTo = req.originalUrl;

        // Auto-detect whether we're on doc.gold.ac.uk
        const base = req.headers.host.includes("doc.gold.ac.uk")
            ? "/usr/441"
            : "";

        // Redirect to proper login route
        return res.redirect(`${base}/users/login`);
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
