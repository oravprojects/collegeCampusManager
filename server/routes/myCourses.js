var express = require('express');
var myCourses = require('../controllers/myCourses');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ridAuth = require('../middleware/rid-auth');

router.get('/', function(req, res, next) {
  res.send('Courses Page');
});

//router.get('/add-task', task.addTask);

//router.get('/createTaskTbl', tasks.createTable);
router.post('/myCourseList', checkAuth, myCourses.myCourseList);
router.post('/studentCourseList', checkAuth, myCourses.studentCourseList);
router.post('/myCourseInfo', checkAuth, myCourses.myCourseInfo);
router.post('/StudentCourseInfo', checkAuth, myCourses.StudentCourseInfo);
router.post('/myClassInfo', checkAuth, myCourses.myClassInfo);
router.post('/myClassInfoGrades', checkAuth, myCourses.myClassInfoGrades);
router.post('/myAttendanceInfo', checkAuth, myCourses.myAttendanceInfo);
router.post('/myDatesInfo',checkAuth,  myCourses.myDatesInfo);
router.post('/myStudentList', checkAuth, myCourses.myStudentList);
router.post('/subAtt', ridAuth, checkAuth, myCourses.subAtt);
router.post('/subGrades', ridAuth, checkAuth, myCourses.subGrades);
router.patch('/subEdit', checkAuth, myCourses.subEdit);
router.patch('/updateDate', checkAuth, myCourses.updateDate);

module.exports = router;