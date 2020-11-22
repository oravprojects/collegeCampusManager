var express = require('express');
var forum = require('../controllers/forum');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ridAuth = require('../middleware/rid-auth');

router.get('/', function(req, res, next) {
  res.send('Forum Page');
});

//router.get('/add-task', task.addTask);

//router.get('/createTaskTbl', tasks.createTable);

router.get('/forumData', forum.forumData);
router.post('/addPost', ridAuth, checkAuth, forum.addPost);
router.delete('/deletePost', ridAuth, checkAuth, forum.deletePost);

module.exports = router;