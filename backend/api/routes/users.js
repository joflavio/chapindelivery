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
} catch (err)
{
    console.log(err);
    res.status(500).send('Database error!');
    return;
}
});

router.post('/', auth, async function(req, res, next) {
    var shipping; 
    try{
        shipping = await models.Shippings.create({ 
        requestdate: Date.now(), 
        requestaddress: req.body.requestaddress,
        requestcityid: req.body.requestcityid,  
        requestuserid: req.body.requestuserid,
        destinationaddress: req.body.destinationaddress,
        destinationcityid: req.body.destinationcityid,
        statusid: '1'
    });
    } catch (err)
    {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }

    if (shipping)
        res.status(200).send(shipping);
    else 
        res.status(500).send('Shipping was not created!');
    return;
});

module.exports = router;
