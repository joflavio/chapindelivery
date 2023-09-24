var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var sharp = require("sharp");

const models = require("../models/index");
const auth = require("../middleware/auth");

const config = process.env;
const storage = multer.memoryStorage();  
const upload = multer({ storage });

/* GET home page. */
router.post('/users', auth, upload.single('file'),  async function(req, res, next) {
    // Get user input
    const { email, filename } = req.body;
    const filetypeid=1;
    const { buffer, originalname } = req.file;
    
    await sharp(buffer)
    .jpeg({ mozjpeg: true, quality: 50 })
    .resize({ width: 720 })
    .toFile(config.IMAGE_FOLDER + filename);

    // Validate user input
    if (!(email)) {
      res.status(400).send({'error': 'Valores no validos!'});
      return;
    }

  const users = await models.User.findAll({
    where: { email:email}
  });
  
  var user;
  if (users.length==0){
    res.status(404).send({'error':'Usuario no encontrado!'});
    return;
  } else{
    user=users[0];
  }

  var img; 
  try{
    img = await models.File.create({
      originalfilename: originalname,
      path: config.IMAGE_FOLDER,
      filename: filename,
      uploaddatetime: Date.now(),
      filetypeid: filetypeid,
      statusid: '1'
    });
  } catch (err)
  {
    console.log(err);
    res.status(500).send('Database error!');
    return;
  }
  console.log(img);
  if (img){
    var field;
    try {
      switch (filetypeid) {
        case 1: {
          field={ userimageid: img.id};
          console.log('userid');
          break;
        }
        case 2: {
          field={ satimageid: img.id};
          break;
        }
      }
      const userUpdate = await models.User.update(
        field,
        { where: { email:email}});
        console.log(userUpdate);
      } catch (err){
        console.log(err);
        res.status(500).send('Database error!');
        return;
      }
      
      res.status(200).send(img);
      return;
  }
  else {
    res.status(500).send('File was not created!');
    return;
  }
});

router.get('/download/:id',auth, async function(req, res, next) {
  const  imageid = req.params.id;
  if (!(imageid)) {
    res.status(400).send({'error': 'Valores no validos!'});
    return;
  }

  const imgs = await models.File.findAll({
    where: { id:imageid}
  });

  var img;
  if (imgs.length==0){
    res.status(404).send({'error':'Imagen no encontrado!'});
    return;
  } else{
    img=imgs[0];
  }

  const filePath = `${img.path}${img.filename}`;
  console.log(filePath);
  res.download(filePath); // Set disposition and send it.
});

router.get('/name/:id',auth, async function(req, res, next) {
  const  imageid = req.params.id;
  if (!(imageid)) {
    res.status(400).send({'error': 'Valores no validos!'});
    return;
  }

  const imgs = await models.File.findAll({
    where: { id:imageid}
  });

  var img;
  if (imgs.length==0){
    res.status(404).send({'error':'Imagen no encontrado!'});
    return;
  } else{
    img=imgs[0];
  }
  if (img){
    res.status(200).send(img);
  }

});
module.exports = router;