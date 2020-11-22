var express = require('express');
var tasks = require('../controllers/tasks');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Tasks Page');
});

//router.get('/add-task', task.addTask);

//router.get('/createTaskTbl', tasks.createTable);
router.get('/taskList', tasks.taskList);
router.post('/addTask', tasks.addTask);
router.delete('/deleteTask', tasks.deleteTask);
router.patch('/updateTask', tasks.updateTask);

module.exports = router;

