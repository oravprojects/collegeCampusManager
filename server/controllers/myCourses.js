var getConnection = require('./database');
var mysql = require("mysql2");

exports.myCourseList = function(req, res, next){
    var lecturerId = req.body.lecturerId;
    console.log("==========", lecturerId);
    
        if (!lecturerId){
        console.log("ERROR: Lecturer id is empty");
        
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
        
        var sql = "select * from course " +
        "left join course_sections on course.course_id = course_sections.course_id " +
        "join user on course_sections.lecturer_id = user.user_id " +
        "where user.user_id = " + mysql.escape(lecturerId) + ";";
        
        // var sql = "select course.course_id, course.flow_id, course.name, course.hours, " + 
        // "course.lecturer_id, course.file_path, user.first_name, user.last_name from `course` " + 
        // "INNER JOIN user on course.lecturer_id = user.user_id and user.user_id = "
        // + mysql.escape(lecturerId) + ";";
        
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


exports.studentCourseList = function(req, res, next){
    var user_id = req.body.user_id;
    console.log("========== Hello", user_id);
    
        if (!user_id){
        console.log("ERROR: user id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: user id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select course.course_id, course_sections.flow_id, course_sections.section_id, course_sections.section, course.name, course.hours, " +
        "course_sections.lecturer_id, user.first_name, user.last_name from `course` " + 
        "JOIN course_sections on course_sections.course_id = course.course_id " + 
        "JOIN user on course_sections.lecturer_id = user.user_id and " + 
        "course_sections.flow_id = (select flow_id from flow_student where student_id = "+ mysql.escape(user_id) + ");";

        
        // var sql = "select course.course_id, course_sections.flow_id, course.name, course.hours, " + 
        // "course_sections.lecturer_id, course.file_path, user.first_name, user.last_name from `course` " + 
        // "INNER JOIN course_sections on course_sections.lecturer_id = user.user_id " +
        // "INNER JOIN user on course_sections.lecturer_id = user.user_id and " +
        // "course_sections.flow_id = (select flow_id from flow_student where student_id = "
        // + mysql.escape(user_id) + ");";
        
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


exports.myCourseInfo = function(req, res, next){
    var flow_id = req.body.flow_id;
    var course_id = req.body.course_id;
    var section_id = req.body.section_id;

    console.log("==========", flow_id);
    console.log("==========", course_id);
    console.log("==========", section_id);
    
        if (!flow_id){
        console.log("ERROR: flow id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:flow id is empty"
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
        if (!section_id){
        console.log("ERROR: section id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        

        var sql = "select * from user " +
        "join flow_student on flow_student.student_id = user.user_id " +
        "join course_sections on course_sections.flow_id = flow_student.flow_id " +
        "where course_sections.section_id = " + mysql.escape(section_id) + ";";
        
        // var sql = "select user.user_id, user.first_name, user.last_name, " +
        // "flow_student.flow_id, course_sections.course_id , course_sections.section from user " +
        // "join flow_student on user.user_id = flow_student.student_id " +
        // "join course_sections on course_sections.course_id = " + mysql.escape(course_id) +
        // "where flow_student.flow_id = " + mysql.escape(flow_id) + ";";
        


        // var sql = "SELECT user.user_id, user.first_name, user.last_name, " + 
        // "flow_student.flow_id, course.course_id, lesson.lesson_number from user " + 
        // "join flow_student " + 
        // "on user.user_id = flow_student.student_id " + 
        // "join course " + 
        // "on flow_student.flow_id = course.course_id " +
        // "join lesson " +
        // "on user.user_id = lesson.student_id " +
        // "where flow_student.flow_id = " +
        // mysql.escape(flow_id) + " and lesson.lesson_number = " +
        // "(SELECT MAX(lesson_number) FROM where lesson.course_id = " + 
        // mysql.escape(course_id) + ");";
        

        /*
        var sql = "SELECT user.user_id, user.first_name, user.last_name, " + 
        "flow_student.flow_id, lesson.lesson_id, lesson.course_id, " +
        "lesson.date, lesson.present from user " + 
        "join lesson on user.user_id = lesson.student_id " +
        "join flow_student on user.user_id = flow_student.student_id " + 
        "where flow_student.flow_id = " + mysql.escape(flow_id) + ";";
        */
        

        /*   var sql = "(SELECT " +
        "user.user_id, user.first_name, user.last_name, " +
        "flow_student.flow_id from user " +
        "join flow_student " +
        "on user.user_id = flow_student.student_id " +
        "where flow_student.flow_id = " + mysql.escape(flow_id) +") " +
        "UNION " +
        "(SELECT " +
        "lesson.lesson_id, lesson.course_id, lesson.date, lesson.present from lesson);";
        */

        /*
        var sql = "SELECT user.user_id, user.first_name, user.last_name, " +
        "flow_student.flow_id, lesson.date, lesson.present, m.date, m.present " +
        "from user " +
        "join flow_student " +
        "on user.user_id = flow_student.student_id " + 
        "join lesson " +
        "on user.user_id = lesson.student_id " +
        "join lesson m " + 
        "on user.user_id = m.student_id " +
        "where flow_student.flow_id = 9 and " +
        "lesson.date = 20190101 and m.date = 20190108;";
        */
        conn.query(sql, function(err, courses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: courses
            });
            console.log(courses);
            conn.release();
        }); 
    });
};

exports.StudentCourseInfo = function(req, res, next){
    var user_id = req.body.user_id;

    var section_id = req.body.section_id;

    console.log("==========", user_id);

    console.log("==========", section_id);
    
    if (!user_id){
        console.log("ERROR: user id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: user id is missing"
        });
            return;
    }
    
    if (!section_id){
        console.log("ERROR: section id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section id is missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "select * from `lesson` where student_id = " + mysql.escape(user_id) + 
        " and section_id = " + mysql.escape(section_id) + ";" +
        "select * from `course_n_grades` where student_id = " + mysql.escape(user_id) + 
        " and section_id = " + mysql.escape(section_id) + ";"; 
        conn.query(sql, function(err, courseInfo){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: courseInfo
            });
            console.log(courseInfo);
            conn.release();
        }); 
    });
};

exports.myClassInfo = function(req, res, next){
    var flow_id = req.body.flow_id;
    var course_id = req.body.course_id;
    var section_id = req.body.section_id;
    console.log("==========", flow_id);
    console.log("==========", course_id);
    console.log("==========", section_id);
        
        if (!flow_id){
        console.log("ERROR: flow id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:flow id is empty"
        });
            return;
    }
        if (!section_id){
        console.log("ERROR: section id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section id is empty"
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
        
        
        // var sql = "select user.user_id, user.first_name, user.last_name, " +
        // "flow_student.flow_id, course.course_id from user " +
        // "join flow_student on user.user_id = flow_student.student_id " +
        // "join course on course.flow_id = flow_student.flow_id " +
        // "where flow_student.flow_id = " + mysql.escape(flow_id) +";"; 


        // var sql = "select user.user_id, user.first_name, user.last_name, " +
        // "flow_student.flow_id, course_sections.course_id, lesson.lesson_number from user " +
        // "join flow_student on user.user_id = flow_student.student_id " +
        // "join course_sections on course_sections.flow_id = flow_student.flow_id " +
        // "join lesson on lesson.student_id = user.user_id " +
        // "where flow_student.flow_id = "+ mysql.escape(flow_id) +
        // "and lesson.lesson_number = " + 
        // "(SELECT MAX(lesson_number) FROM lesson where lesson.course_id = "+ mysql.escape(course_id) + ");";
        
        var sql = "select * from lesson " +
        "join user on user.user_id = lesson.student_id " +
        "where lesson.lesson_number = " +
        "(SELECT MAX(lesson_number) FROM lesson where lesson.section_id = " + mysql.escape(section_id) + ") " +
        "and lesson.section_id = " + mysql.escape(section_id) + ";";
        
        conn.query(sql, function(err, courses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: courses
            });
            console.log(courses);
            conn.release();
        }); 
    });
};

exports.myClassInfoGrades = function(req, res, next){
    
    var section_id = req.body.section_id;
    console.log("==========", section_id);
        
        if (!section_id){
        console.log("ERROR: course id is empty");
        
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

        var sql = "select * from course_n_grades where section_id = " + mysql.escape(section_id) + ";";        
        conn.query(sql, function(err, courses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: courses
            });
            console.log(courses);
            conn.release();
        }); 
    });
};

exports.myStudentList = function(req, res, next){
    var courseId = req.body.courseId;
    var section_id = req.body.section_id;

    console.log("==========", courseId);
    console.log("==========", section_id);
    
        if (!courseId){
        console.log("ERROR: course id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:course id is empty"
        });
            return;
    }
        if (!section_id){
        console.log("ERROR: section id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "select distinct  lesson.student_id, user.first_name, " +
        "user.last_name from lesson " +
        "join user on lesson.student_id=user.user_id " + 
        "where lesson.course_id = " +
        mysql.escape(courseId) + 
        " and lesson.section_id = " + mysql.escape(section_id) + ";";
        
        conn.query(sql, function(err, studentList){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: studentList
            });
            console.log(studentList);
            conn.release();
        }); 
    });
};

exports.myAttendanceInfo = function(req, res, next){
    var courseId = req.body.courseId;
    var section_id = req.body.section_id;
    console.log("==========", courseId);
    console.log("==========", section_id);
    
        if (!courseId){
        console.log("ERROR: course id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:course id is empty"
        });
            return;
    }
        if (!section_id){
        console.log("ERROR: section id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "SELECT * from lesson where " +
        "course_id = " + mysql.escape(courseId) + 
        " and section_id = " + mysql.escape(section_id) + 
        " order by student_id;";

        /*
        var sql = "SELECT user.user_id, user.first_name, user.last_name, " +
        "flow_student.flow_id from user  " +
        "join flow_student " +
        "on user.user_id = flow_student.student_id where flow_student.flow_id = "
        + mysql.escape(flow_id) + ";";
        */

        /*
        var sql = "SELECT user.user_id, user.first_name, user.last_name, " + 
        "flow_student.flow_id, lesson.lesson_id, lesson.course_id, " +
        "lesson.date, lesson.present from user " + 
        "join lesson on user.user_id = lesson.student_id " +
        "join flow_student on user.user_id = flow_student.student_id " + 
        "where flow_student.flow_id = " + mysql.escape(flow_id) + ";";

        */

        /*   var sql = "(SELECT " +
        "user.user_id, user.first_name, user.last_name, " +
        "flow_student.flow_id from user " +
        "join flow_student " +
        "on user.user_id = flow_student.student_id " +
        "where flow_student.flow_id = " + mysql.escape(flow_id) +") " +
        "UNION " +
        "(SELECT " +
        "lesson.lesson_id, lesson.course_id, lesson.date, lesson.present from lesson);";
        */
       
        /*
        var sql = "SELECT user.user_id, user.first_name, user.last_name, " +
        "flow_student.flow_id, lesson.date, lesson.present, m.date, m.present " +
        "from user " +
        "join flow_student " +
        "on user.user_id = flow_student.student_id " + 
        "join lesson " +
        "on user.user_id = lesson.student_id " +
        "join lesson m " + 
        "on user.user_id = m.student_id " +
        "where flow_student.flow_id = 9 and " +
        "lesson.date = 20190101 and m.date = 20190108;";
        */

        conn.query(sql, function(err, courses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: courses
            });
            console.log(courses);
            conn.release();
        }); 
    });
};
exports.myDatesInfo = function(req, res, next){
    var section_id = req.body.section_id;
    console.log("==========", section_id);
    
        if (!section_id){
        console.log("ERROR: section id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:section id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        /*
        var sql = "select distinct date_format(date, \"%M %d %Y\") from lesson " +
        "where course_id = " + mysql.escape(courseId) + ";";
        */

        
        var sql = "SELECT distinct date, lesson_number from lesson where " +
        "section_id = " + mysql.escape(section_id) + ";";
        
        conn.query(sql, function(err, courses){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: courses
            });
            console.log(courses);
            conn.release();
        }); 
    });
};

exports.subAtt = function(req, res, next){
    var request = req.body.request;
    console.log("==========", request);
    
        if (!request || request.length === ""){
        console.log("ERROR: request is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:request is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "INSERT INTO `lesson` (`student_id`, `course_id`, `section_id`, `present`, `lesson_number`, `date`) " +
        "VALUES "+ request + ";";
        

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

exports.subGrades = function(req, res, next){
    var request = req.body.request;
    console.log("==========", request);
    
        if (!request || request.length === 0){
        console.log("ERROR: request is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:request is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "";

        for(var i = 0; i<request.length; i++){
            sql += "replace into `course_n_grades` (student_id, section_id, grade) values (" + request[i].student_id + ", " +
            request[i].section_id + ", " + request[i].grade + "); "
        }
        
        console.log("This is sql: ", sql)

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

exports.subEdit = function(req, res, next){
    var request = req.body.request;
    console.log("==========", request);
    
        if (!request || request.length === 0){
        console.log("ERROR: request is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:request is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "";

        for(var i = 0; i<request.length; i++){
            sql += "update `lesson` set present=" + request[i].dateCellVal + " where lesson_id=" + request[i].lesson_id +
                " and lesson_number=" + request[i].lesson_number + " and student_id=" + request[i].student_id + "; "
        }

        console.log("This is sql: ", sql)
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

exports.updateDate = function(req, res, next){
    var course_id = req.body.course_id;
    var nextLessonNumber = req.body.nextLessonNumber;
    
    // todo: add validation check
    
        if (!course_id){
        console.log("ERROR: course id is empty");
        
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
        
        var sql = "UPDATE `lesson` SET UIdate = " 
        +"(select distinct date_format(date, \"%b %d %y\"))"
        +" WHERE lesson_id > 0 and lesson_number = " 
        + mysql.escape(nextLessonNumber) 
        +" and course_id = "+ mysql.escape(course_id) +";";
        
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