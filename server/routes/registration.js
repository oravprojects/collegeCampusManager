var express = require('express');
var registration = require('../controllers/registration');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const addFileRidAuth = require('../middleware/addFileRid-auth');

const multer = require('multer');


// bucket s3 

const aws = require('aws-sdk')
const multerS3 = require('multer-s3');
const ridAuth = require('../middleware/rid-auth');
 
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region:'eu-west-2'
})

const s3 = new aws.S3()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
        ||file.mimetype === 'application/pdf' 
        || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
            cb(null, true)
    } else{
        cb(null, false)
    }
}

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ecampus-casul',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString()+file.originalname);
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    }, 
    fileFilter: fileFilter
});
// end of bucket s3

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, './uploads/');
//     },
//     filename: function(req, file, cb){
//         cb(null, file.originalname);
//     }
// });
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
//         ||file.mimetype === 'application/pdf' 
//         || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
//         || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
//             cb(null, true)
//     } else{
//         cb(null, false)
//     }
// }
// const upload = multer({storage: storage, limits: {
//     fileSize: 1024 *1024 *5
// }, fileFilter: fileFilter});


router.post('/addUser', checkAuth, registration.addUser);
router.post('/addNewUser', ridAuth, checkAuth, upload.single('userImage'), registration.addNewUser);

router.post('/addFile', addFileRidAuth, upload.single('userFile'), (req, res) =>{
  const file = req.file
  const path = req.file.path
  const name = req.file.filename
  console.log(file)
  res.send(file)
});

router.post('/findUser', checkAuth, registration.findUser);
router.post('/userProfile', checkAuth, registration.userProfile);
router.post('/findFlowStudent', checkAuth, registration.findFlowStudent);
router.post('/findStudentForFlow', checkAuth, registration.findStudentForFlow);
router.post('/checkUserExist', checkAuth, registration.checkUserExist);
router.get('/userList', registration.userList);

module.exports = router;

