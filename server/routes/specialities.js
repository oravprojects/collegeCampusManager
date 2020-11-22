var express = require('express');
var specialities = require('../controllers/specialities');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ridAuth = require('../middleware/rid-auth');

router.get('/', function(req, res, next) {
  res.send('Specialities Page');
});

router.get('/specList', specialities.specList);
router.post('/addSpec', ridAuth, checkAuth, specialities.addSpec);
router.post('/findSpecCourses', checkAuth, specialities.findSpecCourses);
router.post('/findSpecCoursesForFlow', ridAuth, checkAuth, specialities.findSpecCoursesForFlow);
router.post('/addCourseToSpec', ridAuth, checkAuth, specialities.addCourseToSpec);
router.post('/addStudentToFlow', ridAuth, checkAuth, specialities.addStudentToFlow);
router.delete('/deleteSpec', ridAuth, checkAuth, specialities.deleteSpec);
router.delete('/removeCourseFromSpec', ridAuth, checkAuth, specialities.removeCourseFromSpec);
router.delete('/removeStudentFromFlow', ridAuth, checkAuth, specialities.removeStudentFromFlow);
router.patch('/updateSpec', ridAuth, checkAuth, specialities.updateSpec);

module.exports = router;