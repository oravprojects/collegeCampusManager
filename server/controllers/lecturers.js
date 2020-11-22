var getConnection = require('./database');
var mysql = require("mysql2");

/*
exports.createTable = function(req, res, next){
    
    console.log("createTable");
    
    mysql.createConnection(db.sqlConfig).connect(function(err){
        if(err){
            throw err;
        }
        
        console.log("Connected successfully");
        
        var sql = "CREATE TABLE IF NOT EXISTS `tasks` ( " +
            "`task_id` INT NOT NULL AUTO_INCREMENT, " + 
            "`name` VARCHAR(100) NOT NULL, PRIMARY KEY (`task_id`));";
        
        db.sqlConn.query(sql, function (err, result){
            if(err){
                throw err;
            }
            
            console.log("my result: ", result);
            
            res.send(result);
        });
    });
    
    
};
*/


exports.deleteLecturer = function(req, res, next){
    var lecturerId = req.body.lecturerId;
    console.log("==========", courseId);
    
        if (!lecturerId){
        console.log("ERROR: lecturer id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: lecturer id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `lecturer` WHERE lecturer_id=" +
        mysql.escape(lecturerId) + ";";
        
        conn.query(sql, function(err, lecturers){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: lecturers
            });
            
            conn.release();
        }); 
    });
};
exports.lecturerList = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `lecturer`";
        
        conn.query(sql, function(err, lecturers){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: lecturers
            });
            
            conn.release();
        }); 
    });
};

exports.addLecturer = function(req, res, next){
    var newLecturerFirstName = req.body.lecturerFirstName;
    var newLecturerLastName = req.body.lecturerLastName;
    var newLecturerId = req.body.lecturerId;
    var newLecturerEmail = req.body.lecturerEmail;
    var newLecturerPhone = req.body.lecturerPhone;
    console.log("==========", newLecturerFirstName);
    console.log("==========", newLecturerLastName);
    console.log("==========", newLecturerEmail);
    console.log("==========", newLecturerPhone);
    
        if (!newLecturerFirstName || newLecturerFirstName.length === 0){
        console.log("ERROR: lecturer first name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:lecturer first name is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "INSERT INTO `lecturer` (`first_name`, `last_name`, `id`, `email`, `phone`) " +
        "VALUES (" + mysql.escape(newLecturerFirstName) + "," + mysql.escape(newLecturerLastName)
        + "," + mysql.escape(newLecturerId) + "," + mysql.escape(newLecturerEmail) + "," + mysql.escape(newLecturerPhone) + ");";
        
        conn.query(sql, function(err, lecturers){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: lecturers
            });
            
            conn.release();
        }); 
    });
};

exports.updateLecturer = function(req, res, next){
    var sys_num = req.body.sys_num;
    var lecturerId = req.body.lecturerId;
    var lecturerFirstName = req.body.lecturerFirstName;
    var lecturerLastName = req.body.lecturerLastName;
    var lecturerEmail = req.body.lecturerEmail;
    var lecturerPhone = req.body.lecturerPhone;
    
    // todo: add validation check
    
        if (!lecturerId){
        console.log("ERROR: lecturer id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:lecturer id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `lecturer` SET first_name=" + mysql.escape(lecturerFirstName) +
            ", last_name=" + mysql.escape(lecturerLastName) +
            ", email=" + mysql.escape(lecturerEmail) +
            ", phone=" + mysql.escape(lecturerPhone) +
            ", id=" + mysql.escape(lecturerId) + 
            " WHERE sys_num=" + 
        mysql.escape(sys_num) + ";";
        
        conn.query(sql, function(err, lecturers){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: lecturers
            });
            
            conn.release();
        }); 
    });
};