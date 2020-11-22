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


exports.deleteSpec = function(req, res, next){
    var id = req.body.id;
    console.log("==========", id);
    
        if (!id){
        console.log("ERROR: id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `speciality` WHERE id = " +
        mysql.escape(id) + ";";
        
        conn.query(sql, function(err, specs){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specs
            });
            
            conn.release();
        }); 
    });
};

exports.removeCourseFromSpec = function(req, res, next){
    var spec_id = req.body.spec_id;
    var course_id = req.body.course_id;

    console.log("==========", spec_id);
    console.log("==========", course_id);
    
        if (!spec_id){
        console.log("ERROR: spec id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: spec id is empty"
        });
            return;
    }
        
    if (!course_id){
        console.log("ERROR: course id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: course id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `speciality_course` WHERE speciality_id = " +
        mysql.escape(spec_id) + " and course_id = " +
        mysql.escape(course_id) + ";";
        
        conn.query(sql, function(err, specs){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specs
            });
            
            conn.release();
        }); 
    });
};


exports.removeStudentFromFlow = function(req, res, next){
    var id = req.body.id;
    var user_id = req.body.user_id;
    var flow_id = req.body.flow_id;

    console.log("==========", id);
    console.log("==========", user_id);
    console.log("==========", flow_id);
    
        if (!id){
        console.log("ERROR: id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: spec id is empty"
        });
            return;
    }
        
    if (!user_id){
        console.log("ERROR: user id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: course id is empty"
        });
            return;
    }

    if (!flow_id){
        console.log("ERROR: flow id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: flow id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `flow_student` WHERE id = " +
        mysql.escape(id) + " and flow_id = " +
        mysql.escape(flow_id) + " and student_id = " +
        mysql.escape(user_id) + ";";
        
        conn.query(sql, function(err, specs){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specs
            });
            
            conn.release();
        }); 
    });
};

exports.specList = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `speciality` order by `name`;"
        
        conn.query(sql, function(err, specs){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specs
            });
            console.log(specs);
            
            conn.release();
        }); 
    });
};

exports.addSpec = function(req, res, next){
    var newSpecName = req.body.specName;
    var newSpecId = req.body.spec_id;
    console.log("==========", newSpecName);
    console.log("==========", newSpecId);
    
        if (!newSpecName || newSpecId.length === 0){
        console.log("ERROR: Speciality information missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR:speciality information missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "INSERT INTO `speciality` (`name`, `speciality_id`) " +
        "VALUES (" + mysql.escape(newSpecName) + "," + mysql.escape(newSpecId) + ");";
        
        conn.query(sql, function(err, specs){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specs
            });
            
            conn.release();
        }); 
    });
};

exports.findSpecCourses = function(req, res, next){
    var spec_id = req.body.spec_id;
    console.log("==========", spec_id);
    
        if (spec_id == 0){
        console.log("ERROR: Speciality id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR:speciality information missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `speciality_course` " +
        "join course on course.course_id = speciality_course.course_id " +
        "where speciality_id = " + mysql.escape(spec_id) + ";";

        // var sql = "select * from `speciality_course` " + 
        // "join course on course.course_id = speciality_course.course_id " +
        // "join course_sections on course_sections.course_id = speciality_course.course_id " +
        // "join user on user.user_id = course_sections.lecturer_id " +
        // "where speciality_id = " + mysql.escape(spec_id) + ";";

        conn.query(sql, function(err, specCourses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specCourses
            });
            
            conn.release();
        }); 
    });
};


exports.findSpecCoursesForFlow = function(req, res, next){
    var flow_id = req.body.flow_id;
    console.log("==========", flow_id);
    
        if (flow_id == 0){
        console.log("ERROR: Flow id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: Flow id missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");

        var sql = "select * from `speciality_course` " + 
        "join course on course.course_id = speciality_course.course_id " +
        "join course_sections on course_sections.course_id = speciality_course.course_id " +
        "join user on user.user_id = course_sections.lecturer_id " +
        "where flow_id = " + mysql.escape(flow_id) + ";";

        conn.query(sql, function(err, specCourses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specCourses
            });
            
            conn.release();
        }); 
    });
};

exports.addCourseToSpec = function(req, res, next){
    var spec_id = req.body.spec_id;
    var course_id = req.body.course_id;
    console.log("==========", spec_id);
    console.log("==========", course_id);
    
        if (spec_id == 0 || isNaN(spec_id || !spec_id)){
        console.log("ERROR: speciality id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR:speciality information missing"
        });
            return;
    }
        if (course_id == 0 || isNaN(course_id) || !course_id){
        console.log("ERROR: course id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR:course information missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "insert into `speciality_course`  " +
        "(speciality_id, course_id) values (" + mysql.escape(spec_id) +
        ", " + mysql.escape(course_id) +");";

        conn.query(sql, function(err, specCourses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specCourses
            });
            
            conn.release();
        }); 
    });
};

exports.addStudentToFlow = function(req, res, next){
    var user_id = req.body.user_id;
    var flow_id = req.body.flow_id;
    console.log("==========", user_id);
    console.log("==========", flow_id);
    
        if (user_id == 0 || !user_id){
        console.log("ERROR: student id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR:student id missing"
        });
            return;
    }
        if (flow_id == 0 || !flow_id){
        console.log("ERROR: flow id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR:flow information missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "insert ignore into `flow_student`  " +
        "(student_id, flow_id) values (" + mysql.escape(user_id) +
        ", " + mysql.escape(flow_id) +");";

        conn.query(sql, function(err, specCourses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: specCourses
            });
            
            conn.release();
        }); 
    });
};

exports.updateSpec = function(req, res, next){
    var id = req.body.id;
    var specId = req.body.spec_id;
    var specName = req.body.specName;
    
    console.log(id, specId, specName);
    // todo: add validation check
    
        if (!id){
        console.log("ERROR: id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `speciality` SET name=" + mysql.escape(specName) +
            ", speciality_id=" + mysql.escape(specId) +
            " WHERE id=" + 
        mysql.escape(id) + ";";
        
        conn.query(sql, function(err, courses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: courses
            });
            
            conn.release();
        }); 
    });
};