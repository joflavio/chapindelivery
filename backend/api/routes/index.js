var express = require('express');
var bcrypt = require('bcryptjs');
var  jwt = require('jsonwebtoken');
var router = express.Router();

const models = require("../models/index");
const auth = require("../middleware/auth");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET privacypolicy page. */
router.get('/privacypolicy', function(req, res, next) {
  res.render('privacypolicy', { title: 'Política de Privacidad de Chapin Delivery' });
});

/* GET deleteaccount page. */
router.get('/deleteaccount', function(req, res, next) {
  res.render('deleteaccount', { title: 'Política de Eliminación de Cuenta de Chapin Delivery' });
});

// POST login
router.post('/login', async function(req, res, next) {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send({error: 'Valores no validos!'});
    }
    // Validate if user exist in our database
    const users = await models.User.findAll({
      where: {
        email:email
      }
    });

    var user;
    
    if (users.length>0)
      user=users[0];

    //console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { 
          email:user.email, 
          rolid: user.rolid, 
          statusid: user.statusid 
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      user.password='';
      res.header('Access-Control-Allow-Credentials', true);
      res.status(200).send({'user': user, 'token': token});
      return;
    }

    res.status(404).send({'error': 'Verificar correo o contraseña!'});
  } catch (err) {
    console.log(err);
  }
});

//POST signin
router.post('/signin', async function(req, res, next) {
    try {
    // Get user input
    const { firstname, lastname, email, password } = req.body;
    
    // Validate user input
    if (!(email && password && firstname && lastname)) {
      return res.status(400).send({'error': 'Verificar los valores!'});
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await models.User.findAll({
      limit:1,
      where: {
        email:email
      }
    });
    //console.log(oldUser.length);
    if (oldUser.length>0) {
      return res.status(409).send({'error': 'Usuario ya existe!'});
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await models.User.create({
      firstname: firstname,
      lastname: lastname,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      rolid: 2, 
      statusid:1
    });

    // Create token
    const token = jwt.sign(
      { id: user.id, 
        rid: user.rolid,
        email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "4h",
      }
    );
    res.status(201).json({ 'user': user, 'token': token});
  } catch (err) {
    console.log(err);
  }
});

router.post('/welcome',auth, async function(req, res, next) {
  console.log(req.user);
  res.status(200).send("Welcome 🙌 " + req.user.firstname);
});

router.get('/cities/all',auth, async function(req, res, next) {
  models.City.findAll()
  .then ((cities) =>{
    if (cities && cities.length>0) {
      return res.status(200).send(cities);
    }
    return res.status(409).send({'error': 'No existe ciudades!'});
  });
});

module.exports = router;
