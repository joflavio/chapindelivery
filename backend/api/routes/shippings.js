var express = require('express');
var router = express.Router();


const models = require("../models/index");
const auth = require("../middleware/auth");

router.get('/', auth, async function(req, res, next) {
    try{
    const shippings = await models.Shippings.findAll();
    if (shippings.length==0) {
        return res.status(404).send("No tiene envios!");
    }
    return res.status(200).json(shippings);
    } catch (err)
    {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }
});

router.get('/status/:id', auth, async function(req, res, next) {
    try{
    const shippings = await models.Shippings.findAll({
        where: {
            statusid: req.params.id
        },
        order: [
            ['id','ASC']
        ]
    });
    if (shippings.length==0) {
        return res.status(404).send("No existen envios!");
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
            },
            order: [
                ['statusid', 'ASC'],
                ['id','ASC']
            ]
        });
    if (shippings.length==0) {
        return res.status(404).send("No tiene envios!");
    }
    return res.status(200).json(shippings);
    } catch (err)
    {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }
});

router.get('/deliveryuserid/:deliveryuserid', auth, async function(req, res, next) {
    try{
        const shippings = await models.Shippings.findAll({
            where: {
                deliveryuserid: req.params.deliveryuserid
            },
            order: [
                ['statusid', 'ASC'],
                ['id','ASC']
            ]
        });
    if (shippings.length==0) {
        return res.status(404).send("No tiene envios!");
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
        return res.status(404).send("Envio no existe!");
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
    const shipping=req.body;
    try{
        const shippings = await models.Shippings.findAll({
        where: {
            id: shipping.id
        }
    });

    if (shippings.length==0) {
        return res.status(404).send("No shipping!");
    }

    await models.Shippings.update({ 
        requestdate: (!shipping.requestdate)?Date.now():shipping.requestdate, 
        requestaddress: shipping.requestaddress,
        requestcityid: shipping.requestcityid,  
        requestuserid: shipping.requestuserid,
        requestrating: shipping.requestrating,
        requestcomments: shipping.requestcomments,
        destinationaddress: shipping.destinationaddress,
        destinationcityid: shipping.destinationcityid,
        acceptancedate: (!shipping.acceptancedate && shipping.statusid==2)?Date.now():shipping.canceldate,
        receiveddate: shipping.receiveddate,
        receivedimageid: shipping.receivedimageid,
        deliveryuserid: shipping.deliveryuserid,
        deliveryrating: shipping.deliveryrating,
        delivercomments: shipping.delivercomments, 
        delivereddate: shipping.delivereddate,
        deliveredimageid: shipping.deliveredimageid, 
        statusid: shipping.statusid,
        canceldate: (!shipping.canceldate && shipping.statusid==5)?Date.now():shipping.canceldate,
        cancelcomments: shipping.cancelcomments,
        billingdocumentimageid: shipping.billingdocumentimageid
        },{
            where: {
            id: shipping.id
            }
        });
    
        return res.status(200).send();
    } catch(err){
        console.log(err);
        return res.status(500).send('Database error!');
    }
    
});

router.post('/', auth, async function(req, res, next) {
    const _new = req.body.shipping;
    var shipping; 
    try{
        shipping = await models.Shippings.create({ 
        requestuserid: _new.requestuserid,
        requestdate: Date.now(), 
        requestaddress: _new.requestaddress,
        requestcityid: _new.requestcityid,  
        destinationaddress: _new.destinationaddress,
        destinationcityid: _new.destinationcityid,
        totalAmount: _new.totalAmount,
        statusid: '1'
    });
    } catch (err)
    {
        console.log(err);
        res.status(500).send('Database error!');
        return;
    }
    console.log(req);
    if (shipping)
        res.status(200).send();
    else 
        res.status(500).send('Shipping was not created!');
    return; 
});

module.exports = router;