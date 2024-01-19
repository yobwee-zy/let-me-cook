const express = require('express');
const router = express.Router();

router.get('/landlord', (req, res) => {
    res.send('Welcome to the Landlord Dashboard!');
});

router.get('/tenant', (req, res) => {
    res.send('Welcome to the Tenant Dashboard!');
});

module.exports = router;
