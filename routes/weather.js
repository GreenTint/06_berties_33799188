// routes/weather.js
const express = require('express');
const router = express.Router();
const request = require('request');

/*
 * Login protection middleware.
 * Automatically detects whether the app is running locally
 * or on the Goldsmiths server and redirects correctly.
 */
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // Remember intended page to return after login
        req.session.returnTo = req.originalUrl;

        // Auto-detect base path
        const base = req.headers.host.includes("doc.gold.ac.uk")
            ? "/usr/441"
            : "";

        // Redirect to correct login page
        return res.redirect(`${base}/users/login`);
    }
    next();
};

// GET /weather (requires login)
router.get('/', redirectLogin, (req, res, next) => {

    let city = req.query.city || null;

    // No city chosen yet -> show blank form
    if (!city) {
        return res.render('weather', {
            title: "Weather Checker",
            weather: null,
            error: null,
            city: null
        });
    }

    let apiKey = 'e533d645b6b5e52abb8eb4ed510e8926';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, (err, response, body) => {

        // Connection issues
        if (err) {
            return res.render('weather', {
                title: "Weather Checker",
                weather: null,
                error: "Unable to contact the weather service.",
                city: city
            });
        }

        let weather;

        // JSON parsing error
        try {
            weather = JSON.parse(body);
        } catch (e) {
            return res.render('weather', {
                title: "Weather Checker",
                weather: null,
                error: "Weather service returned invalid data.",
                city: city
            });
        }

        // Missing weather data
        if (!weather || !weather.main) {
            return res.render('weather', {
                title: "Weather Checker",
                weather: null,
                error: "Weather information unavailable.",
                city: city
            });
        }

        // City not found
        if (weather.cod == "404") {
            return res.render('weather', {
                title: "Weather Checker",
                weather: null,
                error: "City not found. Please try again.",
                city: city
            });
        }

        // Weather info message
        let wmsg = `
            <h2>Weather in ${weather.name}</h2>
            <p><strong>Temperature:</strong> ${weather.main.temp}°C</p>
            <p><strong>Feels Like:</strong> ${weather.main.feels_like}°C</p>
            <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${weather.wind?.speed ?? "N/A"} m/s</p>
            <p><strong>Conditions:</strong> ${weather.weather?.[0]?.description ?? "Unknown"}</p>
        `;

        res.render('weather', {
            title: "Weather Checker",
            weather: wmsg,
            error: null,
            city: weather.name
        });
    });
});

module.exports = router;
