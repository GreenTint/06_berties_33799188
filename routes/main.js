// routes/main.js

const express = require("express");
const router = express.Router();

/*
 * Global redirectLogin middleware
 * Ensures the same login behavior across all route files.
 * Remembers the page the user attempted to visit.
 */
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // Remember where the user was trying to go
        req.session.returnTo = req.originalUrl;

        // University server login path
        if (req.headers.host.includes("doc.gold.ac.uk")) {
            return res.redirect("/usr/441/users/login");
        }

        // Localhost login path
        return res.redirect("/users/login");
    }
    next();
};

// Render home/menu page
router.get('/', function(req, res, next) {
    // Pass the session into the template so login/logout buttons can work
    res.render('index.ejs', { session: req.session });
});

// Render About page
router.get('/about', function(req, res, next) {
    res.render('about.ejs');
});

// Handle adding a new book
router.post('/bookadded', function(req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) return next(err);

        res.send(
            `This book was added to the database:<br>
            Name: ${req.body.name}<br>
            Price: ${req.body.price}`
        );
    });
});

// Logout route
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('./');

        // Clear session cookie
        res.clearCookie('connect.sid');

        // Redirect to login page after logout
        if (req.headers.host.includes("doc.gold.ac.uk")) {
            return res.redirect("/usr/441/users/login");
        }

        return res.redirect("/users/login");
    });
});

// Export router
module.exports = router;
