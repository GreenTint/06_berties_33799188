// routes/weather.js
const express = require('express');
const router = express.Router();
const request = require('request');

// Protect weather route with login middleware
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // Remember intended destination
        req.session.returnTo = req.originalUrl;

        // Goldsmiths server login path
        if (req.headers.host.includes("doc.gold.ac.uk")) {
            return res.redirect("/usr/441/users/login");
        }

        // Local login
        return res.redirect("/users/login");
    }
    next();
};

// GET /weather (requires login)
router.get('/', redirectLogin, (req, res, next) => {

    let city = req.query.city || null;

    // If no city yet → show blank form
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

        // Network or request failure
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

        // Missing main data
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

        // Create friendly display message
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
