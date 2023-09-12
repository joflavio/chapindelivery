var express = require('express');
var router = express.Router();

const models = require("../models/index");
const auth = require("../middleware/auth");

router.get('/all', auth, async function(req, res, next) {
    try{
    const statuses = await models.Shippingstatus.findAll();
    if (statuses.length==0) {
        return res.status(404).send("No shipping status!");
    }
    return res.status(200).json(statuses);
    } catch (err)
    {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }
});

module.exports = router;