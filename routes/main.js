// routes/main.js

const express = require("express");
const router = express.Router();

// Render home/menu page
router.get('/', function(req, res, next) {
    res.render('index.ejs');
});

// Render About page
router.get('/about', function(req, res, next) {
    res.render('about.ejs');
});

// Handle adding a new book
router.post('/bookadded', function(req, res, next) {
    // SQL query to insert a new book record
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    
    // Get submitted form data
    let newrecord = [req.body.name, req.body.price];

    // Execute the query
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err); // Pass errors to Express
        } else {
            // Send confirmation message
            res.send('This book is added to database, name: ' + req.body.name + ' price ' + req.body.price);
        }
    });
});

// Export the router so index.js can use it
module.exports = router;
