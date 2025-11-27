// Create a new router
const express = require("express")
const router = express.Router()


const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // If on university server, redirect there
        if (req.headers.host.includes("doc.gold.ac.uk")) {
            return res.redirect("/usr/441/users/login");
        }

        // Otherwise you're on localhost
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
    const keyword = req.query.search_text; // get search term from form

    // SQL query to find books where name contains the keyword
    const sqlquery = "SELECT name, price FROM books WHERE name LIKE ?";
    const searchValue = '%' + keyword + '%';

    db.query(sqlquery, [searchValue], (err, results) => {
        if (err) return next(err);

        // Render results in search_result.ejs
        res.render('search_result.ejs', { searchResults: results, keyword: keyword });
    });
});



router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
        });
});

router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render("addbook.ejs");
});

// Handle form submission and save data
router.post('/addbook', redirectLogin, function(req, res, next) {
    const { name, price } = req.body;

    const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    db.query(sqlquery, [name, price], (err, result) => {
        if (err) return next(err);

        // Render the confirmation page with book details
        res.render('bookadded', { name: name, price: price });
    });
});

// Display confirmation message
router.get('/bookadded', function(req, res, next) {
    res.send("<h1>Book successfully added to the database!</h1><a href='/books/list'>View all books</a>");
});

// List all bargain books (price < £20)
router.get('/bargainbooks', function(req, res, next) {
    // SQL query to select books cheaper than £20
    const sqlquery = "SELECT name, price FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        // Render a new EJS page with the bargain books
        res.render('bargainbooks.ejs', { bargainBooks: result });
    });
});

// Export the router object so index.js can access it
module.exports = router

