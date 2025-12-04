// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

/*
 * Middleware to protect routes that require login.
 * Automatically detects whether the app is running on localhost
 * or Goldsmiths server and redirects to the correct login URL.
 */
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // Save the page the user was trying to visit
        req.session.returnTo = req.originalUrl;

        // Auto-detect base path for server environment
        const base = req.headers.host.includes("doc.gold.ac.uk")
            ? "/usr/441"
            : "";

        // Redirect to the correct login page
        return res.redirect(`${base}/users/login`);
    }
    next();
};

// Display registration form
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

// Handle new user registration
router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) return next(err);

        const sqlquery =
            "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";

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
                        return res.send(`A user with that username or email already exists. Please try again.`);
                    }
                    return next(err);
                }

                let message = `Hello ${req.body.first} ${req.body.last}, you are now registered!<br>`;
                message += `We will send an email to you at ${req.body.email}<br>`;
                message += `Your password is: ${plainPassword}<br>`;
                message += `Your hashed password is: ${hashedPassword}`;
                res.send(message);
            }
        );
    });
});

// Show all users (but hide passwords)
router.get('/list', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT username, first, last, email FROM users";

    db.query(sqlquery, (err, rows) => {
        if (err) return next(err);
        res.render('listusers.ejs', { users: rows });
    });
});

// Show login page
router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});

/*
 * Handle login submission.
 * Validates credentials, logs login attempts,
 * saves the session, and redirects user back to intended page.
 */
router.post('/loggedin', function(req, res, next) {
    const username = req.body.username;
    const plainPassword = req.body.password;

    const sqlquery =
        "SELECT hashedPassword, first, last FROM users WHERE username = ?";

    db.query(sqlquery, [username], (err, rows) => {
        if (err) return next(err);

        // Username not found
        if (rows.length === 0) {
            db.query("INSERT INTO login_audit (username, success) VALUES (?, false)", [username], () => {});
            return res.send('Login failed: Username not found');
        }

        const hashedPassword = rows[0].hashedPassword;
        const first = rows[0].first;
        const last = rows[0].last;

        bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
            if (err) return next(err);

            if (!result) {
                db.query("INSERT INTO login_audit (username, success) VALUES (?, false)", [username], () => {});
                return res.send('Login failed: Incorrect password');
            }

            // SUCCESSFUL LOGIN
            req.session.userId = username;
            req.session.first = first;
            req.session.last = last;

            db.query("INSERT INTO login_audit (username, success) VALUES (?, true)", [username], () => {});

            // Determine redirect destination
            // Fall back to /users/list if no returnTo was saved
            const redirectTo = req.session.returnTo || "/users/list";
            delete req.session.returnTo;

            return res.redirect(redirectTo);
        });
    });
});

// Audit log (requires login)
router.get('/audit', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT * FROM login_audit ORDER BY loginTime DESC";

    db.query(sqlquery, (err, results) => {
        if (err) return next(err);
        res.render('audit.ejs', { auditLogs: results });
    });
});

// Export router
module.exports = router;
