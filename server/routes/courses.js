var express = require('express');
var courses = require('../controllers/courses');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ridAuth = require('../middleware/rid-auth');


router.get('/', function(req, res, next) {
  res.send('Courses Page');
});

//router.get('/add-task', task.addTask);

//router.get('/createTaskTbl', tasks.createTable);
router.get('/courseList', courses.courseList);
router.get('/sectionList', courses.sectionList);
router.get('/flowList', courses.flowList);
router.get('/lecturerList', courses.lecturerList);
router.post('/addCourse', ridAuth, checkAuth, courses.addCourse);
router.post('/saveChat', ridAuth, courses.saveChat);
router.post('/addSection', ridAuth, checkAuth, courses.addSection);
router.post('/addFlow', ridAuth, checkAuth, courses.addFlow);
router.post('/addHoliday', ridAuth, checkAuth, courses.addHoliday);
router.post('/addFlowSched', ridAuth, checkAuth, courses.addFlowSched);
router.post('/viewFlowSched', checkAuth, courses.viewFlowSched);
router.post('/findHoliday', checkAuth, courses.findHoliday);
router.post('/findMessages', checkAuth, courses.findMessages);
router.post('/findAllHolidays', checkAuth, courses.findAllHolidays);
router.post('/mySchedule', checkAuth, courses.mySchedule);
router.post('/checkSchedule', ridAuth, checkAuth, courses.checkSchedule);
router.post('/studentSchedule', checkAuth, courses.studentSchedule);
router.delete('/deleteCourse', ridAuth, checkAuth, courses.deleteCourse);
router.delete('/deleteMessage', ridAuth, checkAuth, courses.deleteMessage);
router.delete('/deleteSection', ridAuth, checkAuth, courses.deleteSection);
router.delete('/deleteSchedule', ridAuth, checkAuth, courses.deleteSchedule);
router.delete('/deleteFlow', ridAuth, checkAuth, courses.deleteFlow);
router.delete('/deleteHoliday', ridAuth, checkAuth, courses.deleteHoliday);
router.patch('/updateCourse', ridAuth, checkAuth, courses.updateCourse);
router.patch('/updateMessage', ridAuth, checkAuth, courses.updateMessage);
router.patch('/updateSection', ridAuth, checkAuth, courses.updateSection);
router.patch('/updateFlow', ridAuth, checkAuth, courses.updateFlow);
router.patch('/updateHoliday', ridAuth, checkAuth, courses.updateHoliday);
router.patch('/updateFlowSched', ridAuth, checkAuth, courses.updateFlowSched);

module.exports = router;