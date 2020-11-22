var getConnection = require('./database');
var mysql = require("mysql2");
var bcrypt = require('bcrypt');


exports.addNewUser = function(req, res, next){

    bcrypt.hash(req.body.hash, 10, (err, hash) =>{
        if(err){
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
    
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var role = req.body.role;
    var pwd = hash;
    var phone = req.body.phone;
    var image_path = req.body.image_path;
    var personal_id = req.body.personal_id;

    console.log("==========", first_name);
    console.log("==========", last_name);
    console.log("==========", email);
    console.log("==========", role);
    console.log("==========", hash);
    console.log("==========", phone);
    console.log("==========", personal_id);
    

        if (!first_name || first_name.length === 0 ||
        !last_name || last_name.length === 0 ||
        !personal_id || personal_id === 0 ||
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
        
       
        var sql = "INSERT INTO `user` (`first_name`, `last_name`, `role`, `hash`, " +
        "`email`, `phone`, `personal_id`, `image_path`) "+
        "VALUES (" + mysql.escape(first_name) + ", " + mysql.escape(last_name) +
        ", " + mysql.escape(role) + ", " + mysql.escape(pwd) + ", " + mysql.escape(email)+
        ", " + mysql.escape(phone) + ", " + mysql.escape(personal_id) + ", " +mysql.escape(image_path) + ");";
        
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
exports.checkUserExist = function(req, res, next){
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
       
        var sql = "select * from `user`;"

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


exports.addUser = function(req, res, next){
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var role = req.body.role;
    var hash = req.body.hash;
    var phone = req.body.phone;
    console.log("==========", first_name);
    console.log("==========", last_name);
    console.log("==========", email);
    console.log("==========", role);
    console.log("==========", hash);
    console.log("==========", phone);
    

        if (!first_name || first_name.length === 0 ||
        !last_name || last_name.length === 0 ||
        // !user_id || user_id.length === 0 ||
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
        
       
        var sql = "INSERT INTO `user` (`first_name`, `last_name`, `role`, `hash`, " +
        "`email`, `phone`) "+
        "VALUES (" + mysql.escape(first_name) + ", " + mysql.escape(last_name) +
        ", " + mysql.escape(role) + ", " + mysql.escape(hash) + ", " + mysql.escape(email)+
        ", " + mysql.escape(phone) +");";
        
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

exports.userList = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `user`";
        // var sql = "INSERT INTO `tasks` (`name`) VALUES ('Marry');";
        
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

exports.findUser = function(req, res, next){

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var role = req.body.role;
    var phone = req.body.phone;
    var personal_id = req.body.personal_id;

    if (first_name === ""){
            first_name = "%"
    }
    if (last_name === ""){
            last_name = "%"
    }
    if (email === ""){
            email = "%"
    }
    if (role === ""){
            role = "%"
    }
    if (phone === ""){
            phone = "%"
    }
    if (personal_id === 0){
            personal_id = "%"
    }

    
    console.log("==========", first_name);
    console.log("==========", last_name);
    console.log("==========", email);
    console.log("==========", role);
    console.log("==========", phone);
    console.log("==========", personal_id);

    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select user.*, flow_student.flow_id, flow.speciality_id, speciality.name from user " +
        "left join flow_student on flow_student.student_id = user.user_id " +
        "left join flow on flow_student.flow_id = flow.flow_id " +
        "left join speciality on flow.speciality_id = speciality.speciality_id " + 
        "where `first_name` LIKE " + mysql.escape(first_name) + 
        " and `last_name` LIKE " + mysql.escape(last_name) +
        " and `role` LIKE " + mysql.escape(role) +
        " and `email` LIKE " + mysql.escape(email) +
        " and `personal_id` LIKE " + mysql.escape(personal_id) +
        " and `phone` LIKE " + mysql.escape(phone) + ";" ;

        // var sql = "select * from `user` where `first_name` LIKE " + mysql.escape(first_name) + 
        // "and `last_name` LIKE " + mysql.escape(last_name) +
        // "and `role` LIKE " + mysql.escape(role) +
        // "and `email` LIKE " + mysql.escape(email) +
        // "and `phone` LIKE " + mysql.escape(phone) + ";" ;

        // var sql = "INSERT INTO `tasks` (`name`) VALUES ('Marry');";
        
        conn.query(sql, function(err, users){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: users,
            });
            console.log(users);
            conn.release();
        }); 
    });
};

exports.userProfile = function(req, res, next){

    var user_id = req.body.user_id;

    if (user_id === 0 || !user_id){
        console.log("ERROR: invalid user id");
    
    res.json({
        "status": "error",
        "msg": "ERROR: invalid uder id"
    });
        return;
}

    console.log("==========", user_id);

    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select user.*, flow_student.flow_id, flow.speciality_id, speciality.name from user " + 
        "left join flow_student on flow_student.student_id = user.user_id " +
        "left join flow on flow_student.flow_id = flow.flow_id " +
        "left join speciality on flow.speciality_id = speciality.speciality_id " + 
        "where user.user_id = " + mysql.escape(user_id) + ";";
        
        conn.query(sql, function(err, user){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: user,
            });
            console.log(user);
            conn.release();
        }); 
    });
};

exports.findStudentForFlow = function(req, res, next){

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var user_id = req.body.user_id;

    if (first_name === ""){
            first_name = "%"
    }
    if (last_name === ""){
            last_name = "%"
    }
    if (user_id === "" || user_id === 0){
            user_id = "%"
    }

    
    console.log("==========", first_name);
    console.log("==========", last_name);
    console.log("==========", user_id);

    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select * from `user` " +
        "left join flow_student on flow_student.student_id = user.user_id " +
        "where `first_name` LIKE " + mysql.escape(first_name) + 
        "and `last_name` LIKE " + mysql.escape(last_name) +
        "and `user_id` LIKE " + mysql.escape(user_id) +
        "and `role` LIKE 'student';";

        // var sql = "INSERT INTO `tasks` (`name`) VALUES ('Marry');";
        
        conn.query(sql, function(err, users){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: users,
            });
            console.log(users);
            conn.release();
        }); 
    });
};

exports.findFlowStudent = function(req, res, next){

    var flow_id = req.body.flow_id;
    
    console.log("==========", flow_id);

    if (!flow_id){
            console.log("ERROR: missing flow_id");
        
        res.json({
            "status": "error",
            "msg": "ERROR:missing flow_id"
        });
            return;
    }
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select *, user.first_name, user.last_name, user.user_id from flow_student " +
        "join `user` on flow_student.student_id = user.user_id " +
        "where flow_student.flow_id = " + mysql.escape(flow_id) + ";";
        
        
        conn.query(sql, function(err, users){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: users,
            });
            console.log(users);
            conn.release();
        }); 
    });
};


