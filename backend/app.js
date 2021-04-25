const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('config');

const usersRouter = require('./routes/users');

const app = express();
app.use(cors());

//Import Routes
const auth = require('./routes/admin/auth');
const dashboard = require('./routes/admin/dashboard');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/auth/admin', auth);
app.use('/admin', dashboard);


//Connect to DB 
try {
  mongoose.connect(config.get('oncl.db_connect'),{
    //mongoose.connect(`mongodb://${config.get('database.db_host')}:${config.get('database.db_port')}/vhs`,{
    useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false }, (err)=>{
        if(err){
          console.log(err);
        }else{
          console.log("Database Connection Successful");
        }
      });
} catch (error) {
  console.log(error);
}

console.log(process.env.NODE_ENV);
console.log(config.get('onprem.db_host'));

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

module.exports = app;
