
const jwt = require("jsonwebtoken");
const models = require("../models/index");
const config = process.env;

const verifyToken = async (req, res, next) => {
  
  //console.log('authorization');
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  const users = await models.User.findAll({
    limit:1,
    where: {
      email:req.user.email
    }
  });
  if (users.length==0) {
    return res.status(401).send("User account doesnt exists");
  }
  req.user=users[0];
  return next();
};

module.exports = verifyToken;