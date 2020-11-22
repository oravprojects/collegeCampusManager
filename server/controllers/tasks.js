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


exports.deleteTask = function(req, res, next){
    var taskId = req.body.taskId;
    console.log("==========", taskId);
    
        if (!taskId){
        console.log("ERROR: Task id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:task id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `students` WHERE student_id=" +
        mysql.escape(taskId) + ";";
        
        conn.query(sql, function(err, tasks){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: tasks
            });
            
            conn.release();
        }); 
    });
};
exports.taskList = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `students`";
        // var sql = "INSERT INTO `tasks` (`name`) VALUES ('Marry');";
        
        conn.query(sql, function(err, tasks){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: tasks
            });
            
            conn.release();
        }); 
    });
};

exports.addTask = function(req, res, next){
    var newTaskName = req.body.taskName;
    var newLastName = req.body.lastName;
    var newEmail = req.body.email;
    console.log("==========", newTaskName);
    console.log("==========", newLastName);
    console.log("==========", newEmail);
    
        if (!newTaskName || newTaskName.length === 0){
        console.log("ERROR: Task name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:task name is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "INSERT INTO `students` (`fname`, `lname`, `email`) " +
        "VALUES (" + mysql.escape(newTaskName) + "," + mysql.escape(newLastName)
        + "," + mysql.escape(newEmail) +");";
        
        conn.query(sql, function(err, tasks){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: tasks
            });
            
            conn.release();
        }); 
    });
};

exports.updateTask = function(req, res, next){
    var taskId = req.body.taskId;
    var taskName = req.body.taskName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    
    // todo: add validation check
    
        if (!taskId){
        console.log("ERROR: Task id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:task id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `students` SET fname=" + mysql.escape(taskName) +
            ", lname=" + mysql.escape(lastName) +
            ", email=" + mysql.escape(email) +
            " WHERE student_id=" + 
        mysql.escape(taskId) + ";";
        
        conn.query(sql, function(err, tasks){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: tasks
            });
            
            conn.release();
        }); 
    });
};