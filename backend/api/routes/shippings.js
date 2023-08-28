var express = require('express');
var router = express.Router();


const models = require("../models/index");
const auth = require("../middleware/auth");

router.get('/all', auth, async function(req, res, next) {
    try{
    const shippings = await models.Shippings.findAll();
    if (shippings.length==0) {
        return res.status(404).send("No shippings!");
    }
    return res.status(200).json(shippings);
    } catch (err)
    {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }
});

router.get('/requestuserid/:requestuserid', auth, async function(req, res, next) {
    try{
        const shippings = await models.Shippings.findAll({
            where: {
                requestuserid: req.params.requestuserid
            }
        });
    if (shippings.length==0) {
        return res.status(404).send("No shippings!");
    }
    return res.status(200).json(shippings);
    } catch (err)
    {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }
});

router.get('/:id', auth, async function(req, res, next) {
    try{
        const shippings = await models.Shippings.findAll({
            where: {
                id: req.params.id
            }
        });
    if (shippings.length==0) {
        return res.status(404).send("No shippings!");
    }
    return res.status(200).json(shippings);
    } catch (err)
    {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }
});

router.put('/', auth, async function(req, res, next) {
    try{
    const shippings = await models.Shippings.findAll({
        where: {
            id: req.body.id
        }
    });
    if (shippings.length==0) {
        return res.status(404).send("No shipping!");
    }

    await models.Shippings.update({ 
        requestdate: Date.now(), 
        requestaddress: req.body.requestaddress,
        requestcityid: req.body.requestcityid,  
        requestuserid: req.body.requestuserid,
        requestrating: req.body.requestrating,
        requestcomments: req.body.requestcomments,
        destinationaddress: req.body.destinationaddress,
        destinationcityid: req.body.destinationcityid,
        receiveddate: req.body.receiveddate,
        receivedimageid: req.body.receivedimageid,
        deliveryuserid: req.body.deliveryuserid,
        deliveryrating: req.body.deliveryrating,
        delivercomments: req.body.delivercomments, 
        delivereddate: req.body.delivereddate,
        deliveredimageid: req.body.deliveredimageid, 
        statusid: '1',
        canceldate: req.body.canceldate,
        cancelcomments: req.body.cancelcomments,
        billingdocumentimageid: req.body.billingdocumentimageid
        },{
            where: {
            id: req.body.id
            }
        });
    return res.status(200).send();
    } catch(err){
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

    console.log(shipping);
    if (shipping)
        res.status(200).send(shipping);
    else 
        res.status(500).send('Shipping was not created!');
    return;
});

module.exports = router;