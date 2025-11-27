// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('./login'); 
    } else { 
        next();
    }
}
router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) return next(err);

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
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Friendly message for duplicate username or email
                    return res.send(`A user with that username or email already exists. Please try again.`);
                } else {
                    return next(err);
                }
            }

            let message = `Hello ${req.body.first} ${req.body.last}, you are now registered!<br>`;
            message += `We will send an email to you at ${req.body.email}<br>`;
            message += `Your password is: ${plainPassword}<br>`;
            message += `Your hashed password is: ${hashedPassword}`;
            res.send(message);
        });
    });
});


// Show all users (without passwords)
router.get('/list', redirectLogin, function(req, res, next) {

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
    const username = req.body.username;
    const plainPassword = req.body.password;

    const sqlquery = "SELECT hashedPassword, first, last FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, rows) => {
        if (err) return next(err);

        if (rows.length === 0) {
            // Log failed attempt
            db.query("INSERT INTO login_audit (username, success) VALUES (?, false)", [username], (err) => {
                if (err) console.error("Failed to log audit:", err);
                return res.send('Login failed: Username not found');
            });
        } else {
            const hashedPassword = rows[0].hashedPassword;
            const first = rows[0].first;
            const last = rows[0].last;

            bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
                if (err) return next(err);

                if (result) {

                    // ✅ SAVE SESSION HERE
                    req.session.userId = username;
                    req.session.first = first;
                    req.session.last = last;

                    // Log successful login
                    db.query("INSERT INTO login_audit (username, success) VALUES (?, true)", [username], (err) => {
                        if (err) console.error("Failed to log audit:", err);

                        return res.send(`Hello ${first} ${last}! You are successfully logged in.`);
                    });

                } else {
                    // Log failed login
                    db.query("INSERT INTO login_audit (username, success) VALUES (?, false)", [username], (err) => {
                        if (err) console.error("Failed to log audit:", err);
                        return res.send('Login failed: Incorrect password');
                    });
                }
            });
        }
    });
});



router.get('/audit', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT * FROM login_audit ORDER BY loginTime DESC";
    db.query(sqlquery, (err, results) => {
        if (err) return next(err);
        res.render('audit.ejs', { auditLogs: results });
    });
});







// Export the router object so index.js can access it
module.exports = router
