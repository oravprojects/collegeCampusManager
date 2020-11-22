var getConnection = require('./database');
var mysql = require("mysql2");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


exports.login = function(req, res, next){
    var newEmail = req.body.email;
    var password = req.body.password;

    console.log(newEmail);
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "Select * from `user` where `email` = \""+newEmail+"\"";
        
        conn.query(sql, function(err, data){
            if(err){
                throw err;
            }
            
            if (data.length === 0){
                res.json({
                    status: "failed"
                })
                console.log("failed")
            }
            
            else{
                console.log(data)
                bcrypt.compare(password, data[0].hash, (err, result) =>{
                    if(err){
                        return res.json({
                            status: 'failed'
                        });
                    }
                    if(result){
                        const token = jwt.sign(
                            {
                                email: data[0].email,
                                user_id: data[0].user_id
                            }, 
                            process.env.REACT_APP_JWT_KEY.toString(), 
                            {
                                expiresIn:"1h"
                            });
                            if(data[0].role === "demoLecturer" || data[0].role === "demoStudent" 
                            || data[0].role === "demoAdmin"){
                                data[0].rid = process.env.RID_D
                                console.log("It's a demo: ", data[0].rid)
                            }else{
                                data[0].rid = process.env.RID_R
                                console.log("It's real: ", data[0].rid)
                            }
                        res.status(200).json({
                            status: "ok",
                            data: data, 
                            token: token
                        });
                    }
                    else{
                    res.json({
                        status: 'failed'
                    });
                    }
                }); 
            }
            conn.release();
        }); 
    });
};

exports.getReminder = function(req, res, next){
    var user_id = req.body.user_id;
    var date = req.body.date;

    console.log(user_id, date);
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "Select * from `reminders` where rem_date = " + mysql.escape(date) + " and user_id " 
        + "= " + mysql.escape(user_id) + ";";
        
        conn.query(sql, function(err, reminders){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: reminders
            });
            
            conn.release();
        }); 
    });
};

exports.setReminder = function(req, res, next){
    var user_id = req.body.user_id;
    var date = req.body.date;
    var reminder = req.body.reminder;

    console.log(user_id, date, reminder);
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "Insert into `reminders` (user_id, rem_date, reminder) values (" + mysql.escape(user_id) + ", " 
        + mysql.escape(date) + ", " + mysql.escape(reminder) + ");";
        
        conn.query(sql, function(err, reminders){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: reminders
            });
            
            conn.release();
        }); 
    });
};

// exports.completeReminder = function(req, res, next){
//     var request = req.body.request;
    
//     console.log(request);
    
//     getConnection(function(err, conn){
//         if(err){
//             throw err;
//         }
//         console.log("connected successfully");
        
//         var sql = request;
        
//         conn.query(sql, function(err, reminders){
//             if(err){
//                 throw err;
//             }
            
//             res.json({
//                 "status": "ok",
//                 data: reminders
//             });
            
//             conn.release();
//         }); 
//     });
// };


exports.completeReminder = function(req, res, next){
    var request = req.body.request;
    
    console.log(request);
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = ""
        for (var i = 0; i < request.length; i++) {
            if (request[i].checked) {
                sql += "UPDATE `reminders` SET complete = 1 where rem_id = " + request[i].rem_id + "; "
            } else {
                sql += "UPDATE `reminders` SET complete = 0 where rem_id = " + request[i].rem_id + "; "
            }
        }
        
        conn.query(sql, function(err, reminders){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: reminders
            });
            
            conn.release();
        }); 
    });
};

exports.deleteReminder = function(req, res, next){
    var request = req.body.request;
    
    console.log(request);
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }

        console.log("connected successfully");
        
        var sql = ""
        for (var i = 0; i < request.length; i++) {
            if (request[i].checked) {
                sql += "DELETE from `reminders` where rem_id = " + request[i].rem_id + "; "
            }
        }
        
        conn.query(sql, function(err, reminders){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: reminders
            });
            
            conn.release();
        }); 
    });
};


// exports.login = function(req, res, next){
//     var newEmail = req.body.email;
//     console.log(newEmail);
    
//     getConnection(function(err, conn){
//         if(err){
//             throw err;
//         }
//         console.log("connected successfully");
        
//         var sql = "Select * from `user` where `email` = \""+newEmail+"\"";
        
//         conn.query(sql, function(err, data){
//             if(err){
//                 throw err;
//             }
            
//             if (data.length == 0){
//                 res.json({
//                     status: "failed"
//                 })
//                 console.log("failed")
//             }
//             else{
//                 res.json({
//                 status: "ok",
//                 data: data
//             });
//             console.log("status ok");
//             console.log(data);
//         }
//             conn.release();
//         }); 
//     });
// };