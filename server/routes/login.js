var express = require('express');
var login = require('../controllers/login');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ridAuth = require('../middleware/rid-auth');

router.get('/', function(req, res, next) {
  res.send('Login Page');
});

//router.get('/add-task', task.addTask);

//router.get('/createTaskTbl', tasks.createTable);


router.post('/login', login.login);
router.post('/getReminder', checkAuth, login.getReminder);
router.post('/setReminder', ridAuth, checkAuth, login.setReminder);
router.post('/completeReminder', ridAuth, checkAuth, login.completeReminder);
router.post('/deleteReminder', ridAuth, checkAuth, login.deleteReminder);

module.exports = router;