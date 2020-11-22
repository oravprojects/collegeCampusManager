var express = require('express');
var userLogin = require('../controllers/userLogin');
var router = express.Router();
const bcrypt = require('bcrypt');


router.get('/', function(req, res, next) {
  res.send('user login page');
});

router.get('/taskList', tasks.taskList);
router.post('/addUser', userLogin.addUser);
router.delete('/deleteTask', tasks.deleteTask);
router.patch('/updateTask', tasks.updateTask);


router.post('/addUser', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) =>{
        if(err){
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User ({
                id: req.body.id,
                email: req.body.email,
                password: hash
            });
            user
                .save()
                .then(result =>{
                    console.log(result);
                    res.status(201).json({
                        message:'user created'
                    });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
        }
    });
});


module.exports = router;

