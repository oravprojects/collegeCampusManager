var getConnection = require('./database');
var mysql = require("mysql2");

exports.addPost = function(req, res, next){
    var user_id = req.body.user_id;
    var post = req.body.post;
    var comment_to_post = req.body.comment_to_post;
    var subject = req.body.subject;
    
    console.log("==========", user_id);
    console.log("==========", post);
    console.log("==========", comment_to_post);
    console.log("==========", subject);
    
    
    if (!user_id || user_id === 0){
        console.log("ERROR: invalid user id");
        
        res.json({
            "status": "error",
            "msg": "ERROR: invalid user id"
        });
            return;
    }
        
    if (!post || post === ""){
        console.log("ERROR: missing post");
        
        res.json({
            "status": "error",
            "msg": "ERROR: missing post"
        });
            return;
    }
        
    if (!subject || subject === ""){
        console.log("ERROR: missing subject");
        
        res.json({
            "status": "error",
            "msg": "ERROR: missing subject"
        });
            return;
    }
    
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "INSERT INTO `forum` (`post`, `comment_to_post`, `user_id`, `subject`, `postDate`) " +
        "VALUES (" + mysql.escape(post) + "," + mysql.escape(comment_to_post)
        + "," + mysql.escape(user_id) + "," + mysql.escape(subject) + "," + "NOW());";
        
        conn.query(sql, function(err, posts){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: posts
            });
            
            conn.release();
        }); 
    });
};

exports.forumData = function(req, res, next){
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "select forum.*, user.first_name, user.last_name from forum join user on user.user_id = forum.user_id;";
        
        
        conn.query(sql, function(err, posts){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: posts
            });
            console.log(posts)
            conn.release();
        }); 
    });
};

exports.deletePost = function(req, res, next){
    var post_id = req.body.post_id;
    
    console.log("==========", post_id);
    
    
    if (!post_id || post_id === 0){
        console.log("ERROR: invalid post id");
        
        res.json({
            "status": "error",
            "msg": "ERROR: invalid post id"
        });
            return;
    }
            
    
    getConnection(function(err, conn){
        if(err){
            throw err;
        }
        console.log("connected successfully");
        
        var sql = "DELETE FROM `forum` WHERE post_id=" +
        mysql.escape(post_id) + ";";
        
        conn.query(sql, function(err, posts){
            if(err){
                throw err;
            }
            
            res.json({
                "status": "ok",
                data: posts
            });
            
            conn.release();
        }); 
    });
};
