// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {

    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) return next(err)

        const sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        
        db.query(sqlquery, 
            [
                req.body.username,
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPassword
            ], 
        (err, result) => {
            if (err) return next(err)

            result = 'Hello '+ req.body.first + ' ' + req.body.last +' you are now registered!<br>';
            result += 'We will send an email to you at ' + req.body.email + '<br>';
            result += 'Your password is: '+ plainPassword +'<br>';
            result += 'Your hashed password is: '+ hashedPassword;

            res.send(result)
        }) 
    })
})

// Show all users (without passwords)
router.get('/list', function(req, res, next) {

    const sqlquery = "SELECT username, first, last, email FROM users";

    db.query(sqlquery, (err, rows) => {
        if (err) return next(err);

        res.render('listusers.ejs', { users: rows });
    });
})

// Show login page
router.get('/login', function(req, res, next) {
    res.render('login.ejs')
})

// Handle login
router.post('/loggedin', function(req, res, next) {

    const username = req.body.username
    const plainPassword = req.body.password

    // Select the hashed password for the given username
    const sqlquery = "SELECT hashedPassword, first, last FROM users WHERE username = ?"

    db.query(sqlquery, [username], (err, rows) => {
        if (err) return next(err)

        if (rows.length === 0) {
            // Log failed attempt
            db.query("INSERT INTO login_audit (username, status) VALUES (?, 'FAIL')", [username]);
            res.send('Login failed: Username not found')
        } else {
            const hashedPassword = rows[0].hashedPassword
            const first = rows[0].first
            const last = rows[0].last

            // Compare the password supplied with the password in the database
            bcrypt.compare(plainPassword, hashedPassword, function(err, result) {
                if (err) return next(err)

                if (result === true) {
                    // Log successful login
                    db.query("INSERT INTO login_audit (username, status) VALUES (?, 'SUCCESS')", [username]);
                    res.send('Hello '+ first + ' ' + last + '! You are successfully logged in.')
                } else {
                    // Log failed login
                    db.query("INSERT INTO login_audit (username, status) VALUES (?, 'FAIL')", [username]);
                    res.send('Login failed: Incorrect password')
                }
            })
        }
    })
})


router.get('/audit', function(req, res, next) {
    const sqlquery = "SELECT * FROM login_audit ORDER BY timestamp DESC";
    db.query(sqlquery, (err, results) => {
        if (err) return next(err);
        res.render('audit.ejs', { auditLogs: results });
    });
});




// Export the router object so index.js can access it
module.exports = router
