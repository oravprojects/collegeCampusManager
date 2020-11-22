var express = require('express');
var campUser = require('../controllers/campUser');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ridAuth = require('../middleware/rid-auth');

router.get('/', function(req, res, next) {
  res.send('Courses Page');
});

//router.get('/add-task', task.addTask);

//router.get('/createTaskTbl', tasks.createTable);
router.get('/userList', campUser.userList);
router.post('/addUser', ridAuth, checkAuth, campUser.addUser);
router.post('/sendAssignment', ridAuth, checkAuth, campUser.sendAssignment);
router.post('/getAnnouncements', checkAuth, campUser.getAnnouncements);
router.post('/getAnnouncementsLec', checkAuth, campUser.getAnnouncementsLec);
router.delete('/deleteUser', ridAuth, checkAuth, campUser.deleteUser);
router.delete('/deleteAnnouncement', ridAuth, checkAuth, campUser.deleteAnnouncement);
router.patch('/updateUser', ridAuth, checkAuth, campUser.updateUser);
router.patch('/updateUserNoFile', ridAuth, checkAuth, campUser.updateUserNoFile);
router.patch('/updateAnnouncementNoFile', ridAuth, checkAuth, campUser.updateAnnouncementNoFile);
router.patch('/updateAnnouncement', ridAuth, checkAuth, campUser.updateAnnouncement);
router.patch('/updateUserNoPwd', ridAuth, checkAuth, campUser.updateUserNoPwd);
router.patch('/updateUserNoPwdNoFile', ridAuth, checkAuth, campUser.updateUserNoPwdNoFile);
router.patch('/updateCal', ridAuth, checkAuth, campUser.updateCal);

module.exports = router;