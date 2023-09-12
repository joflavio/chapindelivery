var express = require('express');
var router = express.Router();

const models = require("../models/index");
const auth = require("../middleware/auth");

/* GET home page. */
router.get('/', auth, async function(req, res, next) {
    const roles = await models.Roles.findAll();
    if (roles.length==0) {
        return res.status(404).send("No Roles!");
    }
    res.status(200).json(roles);
});


router.get('/:id', auth, async function(req, res, next) {
    //console.log(req.params.id);
    const id=req.params.id;
    if (isNaN(id))
        return res.status(404).send("No a valid rol number!");

    if (id % 1 > 0) {
        return res.status(404).send("Not a valid rol number!");
    }    
    if (id==0) {
        return res.status(404).send("Not a valid rol!");
    }
    const roles = await models.Roles.findAll({ where:{ id:id } });
    if (roles.length==0) {
        return res.status(404).send("No roles!");
    }
    res.status(200).json(roles[0]);
});


module.exports = router;
