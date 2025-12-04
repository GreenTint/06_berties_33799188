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

        // Auto-detect base path
        const base = req.headers.host.includes("doc.gold.ac.uk")
            ? "/usr/441"
            : "";

        return res.redirect(base + "/users/login");
    }
    next();
};

// Display registration form
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

// Show login page
router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});

// Handle user login
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

            // Incorrect password
            if (!result) {
                db.query("INSERT INTO login_audit (username, success) VALUES (?, false)", [username], () => {});
                return res.send('Login failed: Incorrect password');
            }

            // LOGIN SUCCESSFUL
            req.session.userId = username;
            req.session.first = first;
            req.session.last = last;

            db.query("INSERT INTO login_audit (username, success) VALUES (?, true)", () => {});

            // Detect Goldsmiths base path
            const base = req.headers.host.includes("doc.gold.ac.uk")
                ? "/usr/441"
                : "";

            /*
             * Smart redirect logic:
             * - If user tried to visit a protected page first → return them there
             * - Otherwise → send to homepage
             */
            let redirectTo = req.session.returnTo || "/";
            delete req.session.returnTo;

            return res.redirect(base + redirectTo);
        });
    });
});


// Show all users (requires login)
router.get('/list', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT username, first, last, email FROM users";

    db.query(sqlquery, (err, rows) => {
        if (err) return next(err);
        res.render('listusers.ejs', { users: rows });
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
