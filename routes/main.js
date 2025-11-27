// routes/main.js

const express = require("express");
const router = express.Router();


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
// Render home/menu page
router.get('/', function(req, res, next) {
    // Pass session into index.ejs so login/logout buttons work
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
        if (err) {
            next(err);
        } else {
            res.send(
                'This book is added to database, name: ' 
                + req.body.name 
                + ' price ' 
                + req.body.price
            );
        }
    });
});

// Logout route
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./');
        }
        res.send('You are now logged out. <a href="./">Home</a>');
    });
});

// Export the router so index.js can use it
module.exports = router;
