module.exports = (req, res, next) =>{
    const rid = req.headers.authorization.split(" ")[1];
    // console.log("rid: ", rid);
    if(rid !== process.env.RID_R){
        console.log("unauthorized")
        return res.status(403).json({
            status: 'failed'
        })
    }
    next();
}