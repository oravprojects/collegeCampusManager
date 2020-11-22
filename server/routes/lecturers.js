var express = require('express');
var lecturers = require('../controllers/lecturers');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', function(req, res, next) {
  res.send('Lecturers Page');
});

//router.get('/add-task', task.addTask);

//router.get('/createTaskTbl', tasks.createTable);
router.get('/lecturerList', lecturers.lecturerList);
router.post('/addLecturer', checkAuth, lecturers.addLecturer);
router.delete('/deleteLecturer', checkAuth, lecturers.deleteLecturer);
router.patch('/updateLecturer', checkAuth, lecturers.updateLecturer);

module.exports = router;