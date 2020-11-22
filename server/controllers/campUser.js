var getConnection = require('./database');
var mysql = require("mysql2");
var bcrypt = require('bcrypt');


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


exports.deleteUser = function(req, res, next){
    var user_id = req.body.user_id;
    console.log("==========", user_id);
    
        if (!user_id){
        console.log("ERROR: user id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:user id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `user` WHERE user_id=" +
        mysql.escape(user_id) + ";";
        
        conn.query(sql, function(err, users){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: users
            });
            
            conn.release();
        }); 
    });
};

exports.deleteAnnouncement = function(req, res, next){
    var file_id = req.body.file_id;
    console.log("==========", file_id);
    
        if (!file_id){
        console.log("ERROR: file id is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR: file id is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        
        var sql = "DELETE FROM `files` WHERE file_id=" +
        mysql.escape(file_id) + ";";
        
        conn.query(sql, function(err, files){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: files
            });
            
            conn.release();
        }); 
    });
};

exports.userList = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `user`";
        
        conn.query(sql, function(err, users){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: users
            });
            
            conn.release();
        }); 
    });
};

exports.addUser = function(req, res, next){
    var newFirstName = req.body.firstName;
    var newLastName = req.body.lastName;
    var newRole = req.body.role;
    var newEmail = req.body.email;
    var newPhone = req.body.phone;
    console.log("==========", newFirstName);
    console.log("==========", newLastName);
    console.log("==========", newRole);
    console.log("==========", newEmail);
    console.log("==========", newPhone);
    
        if (!newFirstName || newFirstName.length === 0){
        console.log("ERROR: first name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:first name is empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "INSERT INTO `user` (`first_name`, `last_name`, `role`, `email`, `phone`) " +
        "VALUES (" + mysql.escape(newFirstName) + "," + mysql.escape(newLastName)
        + "," + mysql.escape(newRole) + "," + mysql.escape(newEmail) +
        "," + mysql.escape(newPhone) + ");";
        
        conn.query(sql, function(err, users){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: users
            });
            
            conn.release();
        }); 
    });
};

exports.updateUser = function(req, res, next){
    bcrypt.hash(req.body.hash, 10, (err, hash) =>{
        if(err){
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
    var user_id = req.body.user_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var role = req.body.role;
    var pwd = hash;
    var phone = req.body.phone;
    var personal_id = req.body.personal_id;
    var image_path = req.body.image_path;
    console.log("==========", first_name);
    console.log("==========", last_name);
    console.log("==========", user_id);
    console.log("==========", email);
    console.log("==========", role);
    console.log("==========", hash);
    console.log("==========", phone);
    console.log("==========", personal_id);
    

        if (!first_name || first_name.length === 0 ||
        !last_name || last_name.length === 0 ||
        !personal_id || personal_id.length === 0 ||
        !email || email.length === 0 ||
        !role || role.length === 0 ||
        !hash || hash.length === 0){
            console.log("ERROR: Task name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:information fields are empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `user` SET first_name=" + mysql.escape(first_name) +
            ", last_name=" + mysql.escape(last_name) +
            ", role=" + mysql.escape(role) +
            ", email=" + mysql.escape(email) +
            ", hash=" + mysql.escape(pwd) +
            ", phone=" + mysql.escape(phone) +
            ", personal_id=" + mysql.escape(personal_id) +
            ", image_path=" + mysql.escape(image_path) +
            " WHERE user_id=" + 
        mysql.escape(user_id) + ";";
        
        conn.query(sql, function(err, userData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: userData
            });
            
            conn.release();
        }); 
    });
});
};

exports.updateUserNoFile = function(req, res, next){
    bcrypt.hash(req.body.hash, 10, (err, hash) =>{
        if(err){
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
    var user_id = req.body.user_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var role = req.body.role;
    var pwd = hash;
    var phone = req.body.phone;
    var personal_id = req.body.personal_id;

    console.log("==========", first_name);
    console.log("==========", last_name);
    console.log("==========", user_id);
    console.log("==========", email);
    console.log("==========", role);
    console.log("==========", hash);
    console.log("==========", phone);
    console.log("==========", personal_id);
    

        if (!first_name || first_name.length === 0 ||
        !last_name || last_name.length === 0 ||
        !personal_id || personal_id.length === 0 ||
        !email || email.length === 0 ||
        !role || role.length === 0 ||
        !hash || hash.length === 0){
            console.log("ERROR: Task name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:information fields are empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `user` SET first_name=" + mysql.escape(first_name) +
            ", last_name=" + mysql.escape(last_name) +
            ", role=" + mysql.escape(role) +
            ", email=" + mysql.escape(email) +
            ", hash=" + mysql.escape(pwd) +
            ", phone=" + mysql.escape(phone) +
            ", personal_id=" + mysql.escape(personal_id) +
            " WHERE user_id=" + 
        mysql.escape(user_id) + ";";
        
        conn.query(sql, function(err, userData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: userData
            });
            
            conn.release();
        }); 
    });
});
};

exports.updateUserNoPwd = function(req, res, next){
   
    var user_id = req.body.user_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var role = req.body.role;
    var phone = req.body.phone;
    var personal_id = req.body.personal_id;
    var image_path = req.body.image_path;
 
    var phone = req.body.phone;
    console.log("==========", first_name);
    console.log("==========", last_name);
    console.log("==========", user_id);
    console.log("==========", email);
    console.log("==========", role);
    console.log("==========", personal_id);
   
    console.log("==========", phone);
    

        if (!first_name || first_name.length === 0 ||
        !last_name || last_name.length === 0 ||
        !personal_id || personal_id.length === 0 ||
        !email || email.length === 0 ||
        !role || role.length === 0){
            console.log("ERROR: Task name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:information fields are empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `user` SET first_name=" + mysql.escape(first_name) +
            ", last_name=" + mysql.escape(last_name) +
            ", role=" + mysql.escape(role) +
            ", email=" + mysql.escape(email) +
            ", image_path=" + mysql.escape(image_path) +
            ", phone=" + mysql.escape(phone) +
            ", personal_id=" + mysql.escape(personal_id) +
            " WHERE user_id=" + 
        mysql.escape(user_id) + ";";
        
        conn.query(sql, function(err, userData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: userData
            });
            
            conn.release(); 
    });
});
};

exports.updateUserNoPwdNoFile = function(req, res, next){
   
    var user_id = req.body.user_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var role = req.body.role;
    var phone = req.body.phone;
    var personal_id = req.body.personal_id;

 
    var phone = req.body.phone;
    console.log("==========", first_name);
    console.log("==========", last_name);
    console.log("==========", user_id);
    console.log("==========", email);
    console.log("==========", role);
    console.log("==========", personal_id);
   
    console.log("==========", phone);
    

        if (!first_name || first_name.length === 0 ||
        !last_name || last_name.length === 0 ||
        !personal_id || personal_id.length === 0 ||
        !email || email.length === 0 ||
        !role || role.length === 0){
            console.log("ERROR: Task name is empty");
        
        res.json({
            "status": "error",
            "msg": "ERROR:information fields are empty"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `user` SET first_name=" + mysql.escape(first_name) +
            ", last_name=" + mysql.escape(last_name) +
            ", role=" + mysql.escape(role) +
            ", email=" + mysql.escape(email) +
            ", phone=" + mysql.escape(phone) +
            ", personal_id=" + mysql.escape(personal_id) +
            " WHERE user_id=" + 
        mysql.escape(user_id) + ";";
        
        conn.query(sql, function(err, userData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: userData
            });
            
            conn.release(); 
    });
});
};

exports.updateCal = function(req, res, next){
   
    var id = req.body.id;
    var file_path = req.body.file_path;
    var post = req.body.post;
    var subject = req.body.subject;
 
    console.log("==========", id);
    console.log("==========", file_path);
    console.log("==========", post);
    console.log("==========", subject);
    

        if (!id || id === 0){
            console.log("ERROR: day id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: day id is missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `time_table` SET file_path = " + mysql.escape(file_path) +
        ", post = " + mysql.escape(post) +
        ", subject = " + mysql.escape(subject) +
        " WHERE id=" + mysql.escape(id) + ";";
        
        conn.query(sql, function(err, userData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: userData
            });
            
            conn.release(); 
    });
});
};

exports.updateAnnouncement = function(req, res, next){
   
    var file_id = req.body.file_id;
    var file_path = req.body.file_path;
    var message = req.body.message;
    var title = req.body.subject;
 
    console.log("==========", file_id);
    console.log("==========", message);
    console.log("==========", title);
    console.log("==========", file_path);
    

        if (!file_id || file_id === 0){
            console.log("ERROR: file id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: file id is missing"
        });
            return;
    }
        if (!file_path || file_id === ""){
            console.log("ERROR: file path is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: file path is missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `files` SET message = " + mysql.escape(message) +
        ", title = " + mysql.escape(title) +
        ", file_path = " + mysql.escape(file_path) +
        " WHERE file_id=" + mysql.escape(file_id) + ";";
        
        conn.query(sql, function(err, filesData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: filesData
            });
            
            conn.release(); 
    });
});
};

exports.updateAnnouncementNoFile = function(req, res, next){
   
    var file_id = req.body.file_id;
    var message = req.body.message;
    var title = req.body.subject;
 
    console.log("==========", file_id);
    console.log("==========", message);
    console.log("==========", title);
    

        if (!file_id || file_id === 0){
            console.log("ERROR: file id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: file id is missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "UPDATE `files` SET message = " + mysql.escape(message) +
        ", title = " + mysql.escape(title) +
        " WHERE file_id=" + mysql.escape(file_id) + ";";
        
        conn.query(sql, function(err, filesData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: filesData
            });
            
            conn.release(); 
    });
});
};

exports.sendAssignment = function(req, res, next){
   
    var section_id = req.body.section_id;
    var user_id = req.body.user_id;
    var file_path = req.body.file_path;
    var message = req.body.post;
    var title = req.body.title;
 
    console.log("==========", section_id);
    console.log("==========", file_path);
    console.log("==========", message);
    console.log("==========", title);
    console.log("==========", user_id);
    

        if (!section_id || section_id === 0){
            console.log("ERROR: section id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section id is missing"
        });
            return;
    }
        if (!user_id || user_id === 0){
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
        
        var sql = "insert into `files` (section_id, file_path, user_id, title, message, sub_date) " +
        "values (" + mysql.escape(section_id) + ", " + mysql.escape(file_path) + ", " + mysql.escape(user_id) +
        ", " + mysql.escape(title) + ", " + mysql.escape(message) + ", NOW());";
        
        conn.query(sql, function(err, userData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: userData
            });
            
            conn.release(); 
    });
});
};

exports.getAnnouncements = function(req, res, next){
   
    var section_id = req.body.section_id;
    var lecturer_id = req.body.lecturer_id;
 
    console.log("==========", section_id);
    console.log("==========", lecturer_id);

        if (!section_id || section_id === 0){
            console.log("ERROR: section id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: section id is missing"
        });
            return;
    }
        if (!lecturer_id || lecturer_id === 0){
            console.log("ERROR: lecturer id is missing");
        
        res.json({
            "status": "error",
            "msg": "ERROR: lecturer id is missing"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `files` " +
        "where section_id = " + mysql.escape(section_id) + 
        " and user_id = " + mysql.escape(lecturer_id) + ";";
        
        conn.query(sql, function(err, userData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: userData
            });
            
            conn.release(); 
    });
});
};

exports.getAnnouncementsLec = function(req, res, next){
   
    var section_id = req.body.section_id;
    
 
    console.log("==========", section_id);
    
        if (!section_id || section_id === 0){
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
        
        var sql = "select * from `files` " +
        "where section_id = " + mysql.escape(section_id) + ";";
        
        conn.query(sql, function(err, userData){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: userData
            });
            
            conn.release(); 
    });
});
};

// exports.updateUser = function(req, res, next){
//     var user_id = req.body.user_id;
//     var firstName = req.body.firstName;
//     var lastName = req.body.lastName;
//     var role = req.body.role;
//     var email = req.body.email;
//     var phone = req.body.phone;
    
//     // todo: add validation check
    
//         if (!user_id){
//         console.log("ERROR: user id is empty");
        
//         res.json({
//             "status": "error",
//             "msg": "ERROR:user id is empty"
//         });
//             return;
//     }
    
//     getConnection(function(err, conn){
//         if(err){
//             throw err;
//         }
//         console.log("connected successfully");
        
//         var sql = "UPDATE `user` SET first_name=" + mysql.escape(firstName) +
//             ", last_name=" + mysql.escape(lastName) +
//             ", role=" + mysql.escape(role) +
//             ", email=" + mysql.escape(email) +
//             ", phone=" + mysql.escape(phone) +
//             " WHERE user_id=" + 
//         mysql.escape(user_id) + ";";
        
//         conn.query(sql, function(err, users){
//             if(err){
//                 throw err;
//             }
            
//             res.json({
//                 "status": "ok",
//                 data: users
//             });
            
//             conn.release();
//         }); 
//     });
// };