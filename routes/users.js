// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

/*
 * Middleware to protect routes that require login.
 * If the user is not logged in, save the URL they were trying to access,
 * then redirect them to the correct login page depending on the server.
 */
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // Save the page the user was attempting to visit
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

                // Handle duplicate usernames or emails
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.send(`A user with that username or email already exists. Please try again.`);
                    } else {
                        return next(err);
                    }
                }

                // Confirmation message
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
 * Validates user credentials, logs the login attempt,
 * saves the session, and redirects the user back to the page
 * they originally attempted to access.
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

        // Compare submitted password with stored hash
        bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
            if (err) return next(err);

            // Incorrect password
            if (!result) {
                db.query("INSERT INTO login_audit (username, success) VALUES (?, false)", [username], () => {});
                return res.send('Login failed: Incorrect password');
            }

            // SUCCESSFUL LOGIN
            req.session.userId = username;
            req.session.first = first;
            req.session.last = last;

            // Log successful login
            db.query("INSERT INTO login_audit (username, success) VALUES (?, true)", [username], () => {});

            // Redirect back to original page OR to /users/list
            const redirectTo = req.session.returnTo || "/users/list";
            delete req.session.returnTo;

            return res.redirect(redirectTo);
        });
    });
});

/*
 * Show login audit log (requires login).
 * Displays successful and failed login attempts.
 */
router.get('/audit', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT * FROM login_audit ORDER BY loginTime DESC";

    db.query(sqlquery, (err, results) => {
        if (err) return next(err);
        res.render('audit.ejs', { auditLogs: results });
    });
});

// Export router so app.js can load it
module.exports = router;
