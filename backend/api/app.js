require('dotenv').config()

const db = require("./models");

var createError = require('http-errors');
var express = require('express');
var cors = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var shippingsRouter = require('./routes/shippings');
var shippingstatusRouter = require('./routes/shippingstatus');
var rolesRouter = require('./routes/roles');
var usersRouter = require('./routes/users');
var imagesRouter = require('./routes/images');

var app = express();

var cors = require('cors');
app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('listening on port ' + port + '!');
});

/*
//CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/shippings', shippingsRouter);
app.use('/shippingstatus', shippingstatusRouter);
app.use('/roles', rolesRouter);
app.use('/users', usersRouter);
app.use('/images', imagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (process.env.NODE_ENV=="development" && (/true/).test(process.env.INIT_DB)){
  db.sequelize.sync(
    { force: true }
  ).then(() => {
    console.log("Drop and re-sync db.");
  });
  
}

module.exports = app;

