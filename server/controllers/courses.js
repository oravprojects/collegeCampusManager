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


exports.deleteCourse = function(req, res, next){
    var courseId = req.body.courseId;
    console.log("==========", courseId);
    
        if (!courseId){
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
        
        
        var sql = "DELETE FROM `course` WHERE course_id=" +
        mysql.escape(courseId) + ";";
        
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

exports.deleteMessage = function(req, res, next){
    var message_id = req.body.message_id;
    
    if (!message_id){
        console.log("ERROR: message id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: message id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `chat_message` WHERE message_id=" +
        mysql.escape(message_id) + ";";
        
        conn.query(sql, function(err, messages){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: messages
            });
            
            conn.release();
        }); 
    });
};

exports.deleteSection = function(req, res, next){
    var section_id = req.body.section_id;
    console.log("==========", section_id);
    
        if (!sectionId){
        console.log("ERROR: Section id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: Section id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `course_sections` WHERE section_id=" +
        mysql.escape(section_id) + ";";
        
        conn.query(sql, function(err, sections){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: sections
            });
            
            conn.release();
        }); 
    });
};

exports.deleteSchedule = function(req, res, next){
    var flow_id = req.body.flow_id;
    console.log("==========", flow_id);
    
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
        
        
        var sql = "DELETE FROM `time_table` WHERE flow_id=" +
        mysql.escape(flow_id) + " and id > 0;";
        
        conn.query(sql, function(err, data){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: data
            });
            
            conn.release();
        }); 
    });
};

exports.deleteHoliday = function(req, res, next){
    var cal_id = req.body.cal_id;
    console.log("==========", cal_id);
    
        if (!cal_id){
        console.log("ERROR: holiday id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: holiday id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `calendar` WHERE cal_id=" +
        mysql.escape(cal_id) + ";";
        
        conn.query(sql, function(err, dates){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: dates
            });
            
            conn.release();
        }); 
    });
};

exports.deleteFlow = function(req, res, next){
    var flow_id = req.body.flow_id;
    console.log("==========", flow_id);
    
        if (!flow_id){
        console.log("ERROR: Flow id is empty");
        
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
        
        
        var sql = "DELETE FROM `flow` WHERE flow_id=" +
        mysql.escape(flow_id) + ";";
        
        conn.query(sql, function(err, flows){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: flows
            });
            
            conn.release();
        }); 
    });
};

exports.courseList = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from course order by name;"

        // var sql = "select course.course_id, course.name, course.hours," +
        // "course.lecturer_id, course.file_path, user.first_name, user.last_name" +
        // " from `course` INNER JOIN user on course.lecturer_id = user.user_id order by `name` ;";
        
        conn.query(sql, function(err, courses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: courses
            });
            console.log(courses)
            conn.release();
        }); 
    });
};

exports.sectionList = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `course_sections` JOIN user on course_sections.lecturer_id = user.user_id " +
        "join course on course.course_id = course_sections.course_id;"
        
        conn.query(sql, function(err, sections){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: sections
            });
            conn.release();
        }); 
    });
};

exports.flowList = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `flow`";
        
        conn.query(sql, function(err, flows){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: flows
            });
            console.log(flows)
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
        
        var sql = "select user_id as lecturer_id, first_name, last_name from `user` where role = 'lecturer';";
        
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

exports.addCourse = function(req, res, next){
    var newCourseName = req.body.courseName;
    var newHours = req.body.hours;
    // var newLecturerId = req.body.lecturerId;
    // var file_path = req.body.file_path;
    console.log("==========", newCourseName);
    console.log("==========", newHours);
    // console.log("==========", newLecturerId);
   
    
        if (!newCourseName || newCourseName.length === 0){
        console.log("ERROR: Course name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:course name is empty"
        });
            return;
    }
        if (!newHours || newHours === 0){
        console.log("ERROR: Hours field is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: Hours field is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "INSERT INTO `course` (`name`, `hours`) " +
        "VALUES (" + mysql.escape(newCourseName) + "," + mysql.escape(newHours) + ");";
        
        // var sql = "INSERT INTO `course` (`name`, `hours`, `lecturer_id`, `file_path`) " +
        // "VALUES (" + mysql.escape(newCourseName) + "," + mysql.escape(newHours)
        // + "," + mysql.escape(newLecturerId) + "," + mysql.escape(file_path) + ");";
        
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

exports.saveChat = function(req, res, next){
    var message = req.body.message;
    var user = req.body.user;
    var room = req.body.room;

    console.log("==========", message);
    console.log("==========", user);
    console.log("==========", room);
   
    
        if (!message || message === ""){
        console.log("ERROR: message is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: message is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "INSERT INTO `chat_message` (`user`, `message`, `room`, `date`) " +
        "VALUES (" + mysql.escape(user) + "," + mysql.escape(message) + "," + mysql.escape(room) +", NOW());";
        
        conn.query(sql, function(err, message){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: message
            });
            
            conn.release();
        }); 
    });
};

exports.addSection = function(req, res, next){
    var course_id = req.body.course_id;
    var section = req.body.section;
    var flow_id = req.body.flow_id;
    var lecturer_id = req.body.lecturer_id;
    console.log("==========", course_id);
    console.log("==========", section);
    console.log("==========", flow_id);
    console.log("==========", lecturer_id);
   
    
        if (!course_id || course_id === 0){
        console.log("ERROR: Course id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: course id is empty"
        });
            return;
    }
        if (!section || section === 0){
        console.log("ERROR: section is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section is empty"
        });
            return;
    }
        if (!flow_id || flow_id === 0){
        console.log("ERROR: flow id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: flow id is empty"
        });
            return;
    }
        if (!lecturer_id || lecturer_id === 0){
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
        
        var sql = "INSERT INTO `course_sections` (`section`, `course_id`, `lecturer_id`, `flow_id`) " +
        "VALUES (" + mysql.escape(section) + "," + mysql.escape(course_id)
        + "," + mysql.escape(lecturer_id) + "," + mysql.escape(flow_id) + ");";
        
        conn.query(sql, function(err, sections){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: sections
            });
            
            conn.release();
        }); 
    });
};

exports.addFlow = function(req, res, next){
    var flow_id = req.body.flow_id;
    var spec_id = req.body.speciality_id;
    var start_date = req.body.start_date;
    var start_time = req.body.start_time;
    var end_time = req.body.end_time;
    var lesson_length = req.body.lesson_length;
    var sun = req.body.sun;
    var mon = req.body.mon;
    var tue = req.body.tue;
    var wed = req.body.wed;
    var thu = req.body.thu;
    var fri = req.body.fri;
    var sat = req.body.sat;
    console.log("==========", flow_id);
    console.log("==========", spec_id);
    console.log("==========", start_date);
    console.log("==========", start_time);
    console.log("==========", end_time);
    console.log("==========", lesson_length);
    console.log("==========", sun);
    console.log("==========", mon);
    console.log("==========", tue);
    console.log("==========", wed);
    console.log("==========", thu);
    console.log("==========", fri);
    console.log("==========", sat);
    
        if (!flow_id || !spec_id){
        console.log("ERROR: Course name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:course name is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "INSERT INTO `flow` (flow_id, speciality_id, start_date, start_time, end_time, lesson_length, sun, mon, tue, wed, thu, fri, sat) " +
        "VALUES (" + mysql.escape(flow_id) + "," + mysql.escape(spec_id)
        + "," + mysql.escape(start_date) + "," + mysql.escape(start_time) + "," + mysql.escape(end_time) + "," 
        + mysql.escape(lesson_length) + "," + mysql.escape(sun) +
        "," + mysql.escape(mon) +"," + mysql.escape(tue) +"," + mysql.escape(wed) +"," + mysql.escape(thu) +
        "," + mysql.escape(fri) + "," + mysql.escape(sat) +");";
        
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

exports.addHoliday = function(req, res, next){
    var holidayDate = req.body.holidayDate;
    console.log("==========", holidayDate);
    
        if (!holidayDate){
        console.log("ERROR: date is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: date is missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "INSERT IGNORE INTO `calendar` (date, holiday) " +
        "VALUES (" + mysql.escape(holidayDate) + ", 1);";
        
        conn.query(sql, function(err, dates){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: dates
            });
            
            conn.release();
        }); 
    });
};

exports.mySchedule = function(req, res, next){
    var lecturerId = req.body.lecturerId;
    
    console.log("==========", lecturerId);
    
        if (!lecturerId || lecturerId === 0){
        console.log("ERROR: Missing lecturer ID");
        
        res.json({
            "status": "error",
            "msg": "ERROR: Missing lecturer ID"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select time_table.*, flow.start_time, flow.end_time, " + 
            "course.name, course.hours, course_sections.lecturer_id, course_sections.section " + 
            "from `time_table` " + 
            "join `course` on course.course_id = time_table.course_id " +
            "join course_sections on time_table.section_id = course_sections.section_id " +
            "join flow on time_table.flow_id = flow.flow_id " +
            "where course_sections.lecturer_id = " + mysql.escape(lecturerId) + ";";


        // var sql = "select * from `time_table` " + 
        // "join `course` on course.course_id = time_table.course_id " +
        // "where time_table.course_id = course.course_id " +
        // "and course.lecturer_id = "  + mysql.escape(lecturerId) + ";";

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

exports.checkSchedule = function(req, res, next){
    var lecturerArr = req.body.lecturerArr;
    var req ="";

    for (var i=0; i<lecturerArr.length; i++){
        req += "select time_table.*, flow.start_time, flow.end_time, " + 
        "course.name, course.hours, course_sections.lecturer_id, course_sections.section, user.first_name, user.last_name " + 
        "from `time_table` " + 
        "join `course` on course.course_id = time_table.course_id " +
        "join `user` on user_id = " + lecturerArr[i] +
        " join course_sections on time_table.section_id = course_sections.section_id " +
        "join flow on time_table.flow_id = flow.flow_id " +
        "where course_sections.lecturer_id = " + lecturerArr[i] + ";";
    }
    console.log("==========", lecturerArr);
    console.log("==========", req);
    
        if (!lecturerArr || lecturerArr === 0){
        console.log("ERROR: Missing lecturer Arr");
        
        res.json({
            "status": "error",
            "msg": "ERROR: Missing lecturer Arr"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = req

        // var sql = "select * from `time_table` " + 
        // "join `course` on course.course_id = time_table.course_id " +
        // "where time_table.course_id = course.course_id " +
        // "and course.lecturer_id = "  + mysql.escape(lecturerId) + ";";

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

exports.studentSchedule = function(req, res, next){
    var user_id = req.body.user_id;
    
    console.log("==========", user_id);
    
        if (!user_id || user_id === 0){
        console.log("ERROR: Missing lecturer ID");
        
        res.json({
            "status": "error",
            "msg": "ERROR: Missing lecturer ID"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select time_table.*, flow.start_time, flow.end_time, " +
        "course.name, course.hours, course_sections.lecturer_id, course_sections.section " +
        "from `time_table` " +
        "join `course` on course.course_id = time_table.course_id " +
        "join `course_sections` on course_sections.section_id = time_table.section_id  " +
        "join flow on time_table.flow_id = flow.flow_id " +
        "where flow.flow_id = (select flow_id from flow_student where student_id = " + mysql.escape(user_id) +");";


        // var sql = "select * from `time_table` " +
        // "join `course` on course.course_id = time_table.course_id " + 
        // "where course.flow_id = (select flow_id from flow_student where student_id = " + mysql.escape(user_id) +");";
        
        // var sql = "select * from `time_table` " +
        // "join `course` on course.course_id = time_table.course_id " + 
        // "where time_table.flow_id = (select flow_id from flow_student where student_id = " + mysql.escape(user_id) +");";

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

exports.updateCourse = function(req, res, next){
    var courseId = req.body.courseId;
    var courseName = req.body.courseName;
    var hours = req.body.hours;
    // var lecturerId = req.body.lecturerId;
    // var file_path = req.body.file_path;
    
    // todo: add validation check
    
        if (!courseId){
        console.log("ERROR: Course id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:course id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `course` SET name=" + mysql.escape(courseName) +
            ", hours=" + mysql.escape(hours) +
            // ", lecturer_id=" + mysql.escape(lecturerId) +
            // ", file_path=" + mysql.escape(file_path) +
            " WHERE course_id=" + 
        mysql.escape(courseId) + ";";
        
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

exports.updateMessage = function(req, res, next){
    var message_id = req.body.message_id;
    var message = req.body.message;

    console.log(message_id, message)
    
    // var lecturerId = req.body.lecturerId;
    // var file_path = req.body.file_path;
    
    // todo: add validation check
    
        if (!message_id){
        console.log("ERROR: message id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: message id is empty"
        });
            return;
        }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `chat_message` SET message=" + mysql.escape(message) +
            " WHERE message_id=" + 
        mysql.escape(message_id) + ";";
        
        conn.query(sql, function(err, messages){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: messages
            });
            
            conn.release();
        }); 
    });
};

exports.updateSection = function(req, res, next){
    var section_id = req.body.section_id;
    var section = req.body.section;
    var course_id = req.body.course_id;
    var flow_id = req.body.flow_id;
    var lecturer_id = req.body.lecturer_id;
    
    console.log(section_id, course_id, flow_id, lecturer_id)
    if (!course_id || course_id === 0){
        console.log("ERROR: Course id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: course id is empty"
        });
            return;
    }
    if (!section_id || section_id === 0){
        console.log("ERROR: Section id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: Section id is empty"
        });
            return;
    }
        if (!section || section === 0){
        console.log("ERROR: section is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section is empty"
        });
            return;
    }
        if (!flow_id || flow_id === 0){
        console.log("ERROR: flow id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: flow id is empty"
        });
            return;
    }
        if (!lecturer_id || lecturer_id === 0){
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
        
        var sql = "UPDATE `course_sections` SET section = " + mysql.escape(section) +
            ", course_id = " + mysql.escape(course_id) +
            ", lecturer_id = " + mysql.escape(lecturer_id) +
            ", flow_id = " + mysql.escape(flow_id) +
            " WHERE section_id=" + 
        mysql.escape(section_id) + ";";
        
        conn.query(sql, function(err, sections){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: sections
            });
            
            conn.release();
        }); 
    });
};

exports.updateHoliday = function(req, res, next){
    var cal_id = req.body.cal_id;
    var holidayDate = req.body.holidayDate;
        
        if (!cal_id){
        console.log("ERROR: holiday id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: holiday id is missing"
        });
            return;
    }
        if (!holidayDate){
        console.log("ERROR: holiday date is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: holiday date is missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `calendar` SET date=" + mysql.escape(holidayDate) +
            " WHERE cal_id=" + 
        mysql.escape(cal_id) + ";";
        
        conn.query(sql, function(err, dates){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: dates
            });
            
            conn.release();
        }); 
    });
};

exports.updateFlow = function(req, res, next){
    var flow_id = req.body.flow_id;
    var spec_id = req.body.speciality_id;
    var start_date = req.body.start_date;
    var start_time = req.body.start_time;
    var end_time = req.body.end_time;
    var lesson_length = req.body.lesson_length;
    var sun = req.body.sun;
    var mon = req.body.mon;
    var tue = req.body.tue;
    var wed = req.body.wed;
    var thu = req.body.thu;
    var fri = req.body.fri;
    var sat = req.body.sat;
    console.log("==========", flow_id);
    console.log("==========", spec_id);
    console.log("==========", start_date);
    console.log("==========", start_time);
    console.log("==========", end_time);
    console.log("==========", lesson_length);
    console.log("==========", sun);
    console.log("==========", mon);
    console.log("==========", tue);
    console.log("==========", wed);
    console.log("==========", thu);
    console.log("==========", fri);
    console.log("==========", sat);
    
        if (!flow_id || !spec_id){
        console.log("ERROR: Course name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:course name is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `flow` SET speciality_id=" + mysql.escape(spec_id) +
            ", start_date=" + mysql.escape(start_date) +
            ", start_time=" + mysql.escape(start_time) +
            ", end_time=" + mysql.escape(end_time) +
            ", lesson_length=" + mysql.escape(lesson_length) +
            ", sun=" + mysql.escape(sun) +
            ", mon=" + mysql.escape(mon) +
            ", tue=" + mysql.escape(tue) +
            ", wed=" + mysql.escape(wed) +
            ", thu=" + mysql.escape(thu) +
            ", fri=" + mysql.escape(fri) +
            ", sat=" + mysql.escape(sat) +
            " WHERE flow_id=" + 
        mysql.escape(flow_id) + ";";
        
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

exports.updateFlowSched = function(req, res, next){
    var id = req.body.id;
    var lesson_date = req.body.lesson_date;
    var newLesson_date = req.body.newLesson_date;
    console.log("==========", id);
    console.log("==========", lesson_date);
    console.log("==========", newLesson_date);
    
    if (!id){
        console.log("ERROR: id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: id missing"
        });
            return;
    }
    if (!lesson_date){
        console.log("ERROR: lesson date missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: lesson date missing"
        });
            return;
    }
    if (!newLesson_date){
        console.log("ERROR: newLesson_date missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: newLesson_date missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `time_table` SET date=" + mysql.escape(newLesson_date) +
            " WHERE id=" + mysql.escape(id) + ";";
        
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

exports.findHoliday = function(req, res, next){
    var firstDay = req.body.firstDay;
    // var lastDay = req.body.lastDay;
    console.log("==========", firstDay);
    // console.log("==========", lastDay);
    
    if (!firstDay){
        console.log("ERROR: first day date missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: first day date missing"
        });
            return;
    }
    // if (!lastDay){
    //     console.log("ERROR: last day date missing");
        
    //     res.json({
    //         "status": "error",
    //         "msg": "ERROR: last day date missing"
    //     });
    //         return;
    // }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "SELECT * FROM `calendar` where " +
            "date >= " + mysql.escape(firstDay) + ";";
            // " and date <= " + mysql.escape(lastDay) + ";";
        
        conn.query(sql, function(err, holidays){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: holidays
            });
            
            conn.release();
        }); 
    });
};

exports.findMessages = function(req, res, next){
    var firstDay = req.body.fromDate;
    var lastDay = req.body.toDate;
    var room = req.body.room;
    console.log("==========", firstDay);
    console.log("==========", lastDay);
    console.log("==========", room);
    
    if (room === ""){
        room = "%"
    }

    if (!firstDay){
        console.log("ERROR: first day date missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: first day date missing"
        });
            return;
    }
    if (!lastDay){
        console.log("ERROR: last day date missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: last day date missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "SELECT * FROM `chat_message` where " +
            "date >= " + mysql.escape(firstDay) + 
            " and date <= " + mysql.escape(lastDay) +
            " and room LIKE " + mysql.escape(room) + ";";
        
        conn.query(sql, function(err, messages){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: messages
            });
            
            conn.release();
        }); 
    });
};

exports.findAllHolidays = function(req, res, next){
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    
    console.log("==========", fromDate);
    console.log("==========", toDate);
    
    if (!fromDate){
        console.log("ERROR: from date missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: from date missing"
        });
            return;
    }
    if (!toDate){
        console.log("ERROR: to date missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: to date missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "SELECT * FROM `calendar` where " +
            "date >= " + mysql.escape(fromDate) + 
            " and date <= " + mysql.escape(toDate) + "order by date;";
        
        conn.query(sql, function(err, dates){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: dates
            });
            
            conn.release();
        }); 
    });
};

// exports.addFlowSched = function(req, res, next){
//     var request = req.body.request;
//     console.log("==========", request);
    
//     if (!request){
//         console.log("ERROR: request missing");
        
//         res.json({
//             "status": "error",
//             "msg": "ERROR: request missing"
//         });
//             return;
//     }
//     getConnection(function(err, conn){
//         if(err){
//             throw err;
//         }
//         console.log("connected successfully");
        
//         var sql = request;
        
//         conn.query(sql, function(err, data){
//             if(err){
//                 throw err;
//             }
            
//             res.json({
//                 "status": "ok",
//                 data: data
//             });
            
//             conn.release();
//         }); 
//     });
// };
exports.addFlowSched = function(req, res, next){
    var array = req.body.array;
    var flow_id = req.body.flow_id;
    var req = "";
    for(var i=0; i<array.length; i++){
        req +="insert ignore into `time_table` (course_id, section_id, date, flow_id) values (" + array[i].course_id + ", " + array[i].section_id + ", " +array[i].date.toString().substr(0, 10).replace(/-/g, '') + ", " + flow_id + "); "
    }
    console.log("==========", array);
    console.log("==========", flow_id);
    console.log("==========", req);

    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = req;
        
        conn.query(sql, function(err, data){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: data
            });
            
            conn.release();
        }); 
    });
};

exports.viewFlowSched = function(req, res, next){
    var start_date = req.body.start_date;
    var flow_id = req.body.flow_id;

    console.log("==========", start_date);
    console.log("==========", flow_id);
    
    if (!start_date){
        console.log("ERROR: start date missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: start date missing"
        });
            return;
    }
    if (!flow_id){
        console.log("ERROR: flow id missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: flow id missing"
        });
            return;
    }
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");

        var sql = "select time_table.*, course.name from `time_table` " +
        "join `course` on time_table.course_id = course.course_id " +
        "where time_table.date >= " + mysql.escape(start_date) +
        "and time_table.flow_id = " + mysql.escape(flow_id) + " order by time_table.date;"
        
        conn.query(sql, function(err, data){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: data
            });
            
            conn.release();
        }); 
    });
};