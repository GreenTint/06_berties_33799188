// routes/main.js

const express = require("express");
const router = express.Router();

/*
 * Global redirectLogin middleware
 * Automatically detects whether we're on localhost or doc.gold.ac.uk.
 * Saves attempted URL so login can return the user to where they came from.
 */
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // Save attempted page
        req.session.returnTo = req.originalUrl;

        // Auto-detect correct base path
        const base = req.headers.host.includes("doc.gold.ac.uk")
            ? "/usr/441"
            : "";

        // Redirect to login
        return res.redirect(`${base}/users/login`);
    }
    next();
};

// Render home/menu page
router.get('/', function(req, res, next) {
    // Pass session into EJS so login/logout buttons work
    res.render('index.ejs', { session: req.session });
});

// Render About page
router.get('/about', function(req, res, next) {
    res.render('about.ejs');
});

// Handle adding a new book (NOT protected)
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
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('./');

        // Remove session cookie
        res.clearCookie('connect.sid');

        // Auto-detect correct base path
        const base = req.headers.host.includes("doc.gold.ac.uk")
            ? "/usr/441"
            : "";

        // Redirect to HOME page after logout
        return res.redirect(base + "/");
    });
});


// Export router
module.exports = router;
