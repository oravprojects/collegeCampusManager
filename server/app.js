"use strict";
var bodyParser = require('body-parser');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');
var coursesRouter = require('./routes/courses');
var forumRouter = require('./routes/forum');
var specialitiesRouter = require('./routes/specialities');
var lecturersRouter = require('./routes/lecturers');
var campUserRouter = require('./routes/campUser');
var loginRouter = require('./routes/login');
var myCoursesRouter = require('./routes/myCourses');
var registrationRouter = require('./routes/registration');

const cors = require('cors');
require('dotenv').config()

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const { addUser, removeUser, getUser, getUsersInRoom } = require('./chatUsers');
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// socket io



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use (cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/courses', coursesRouter);
app.use('/forum', forumRouter);
app.use('/specialities', specialitiesRouter);
app.use('/lecturers', lecturersRouter);
app.use('/campUser', campUserRouter);
app.use('/login', loginRouter);
app.use('/myCourses', myCoursesRouter);
app.use('/registration', registrationRouter);


io.on('connection', (socket) => {
  console.log('we have a new connection');
  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) =>{
    const user = getUser(socket.id);

    io.to(user.room).emit('message', {user: user.name, text:message});
    

    callback();
  });


  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }


  })
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//adds socket.io to res in our event loop
app.use(function (req, res, next) {
  res.io = io;
  next();
});


// module.exports = app;
module.exports = { app: app, server: server };
