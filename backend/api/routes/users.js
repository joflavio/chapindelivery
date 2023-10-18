var express = require('express');
var router = express.Router();

const models = require("../models/index");
const auth = require("../middleware/auth");

/* GET users listing. */
router.get('/:id', auth, async function(req, res, next) {
    try{
        const user = await models.User.findAll({
            where: {
                id: req.params.id
            }
        });
        if (user.length==0) {
            return res.status(404).send("No user!");
        }
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }
});

router.put('/', auth, async function(req, res, next) {
    const user=req.body;
    const users = await models.User.findAll({
        where: {
            id: user.id
        }
    });
    if (users.length==0) 
        return res.status(404).send("No user!");
    
    await models.User.update({
        firstname: user.firstname,
        lastname: user.lastname,
        satimageid:user.satimageid,
        policerecordimageid:user.policerecordimageid,
        criminalrecordimageid:user.criminalrecordimageid
    }, {
        where: {
            id: user.id
            }
    });
    return res.status(200).send(user);
});

module.exports = router;
