const express = require("express");
const router = express.Router();

// GET /api/books — supports search, price range, and sorting
router.get('/books', function (req, res, next) {

    const search = req.query.search;        // Keyword filter
    const min = req.query.minprice;         // Minimum price
    const max = req.query.maxprice;         // Maximum price
    const sort = req.query.sort;            // Sorting option

    let sqlquery = "SELECT * FROM books";
    let conditions = [];
    let params = [];

    // Add search condition
    if (search) {
        conditions.push("name LIKE ?");
        params.push('%' + search + '%');
    }

    // Add min price condition
    if (min) {
        conditions.push("price >= ?");
        params.push(min);
    }

    // Add max price condition
    if (max) {
        conditions.push("price <= ?");
        params.push(max);
    }

    // If there are any conditions, add WHERE clause
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // Add sorting
    if (sort === "name") {
        sqlquery += " ORDER BY name ASC";
    } 
    else if (sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    db.query(sqlquery, params, (err, results) => {
        if (err) {
            return res.json({ error: err });
        }

        res.json(results);
    });
});

module.exports = router;
