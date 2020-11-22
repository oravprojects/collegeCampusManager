module.exports = (req, res, next) =>{
    const rid = req.body.rid;
    // console.log("this is rid: ", rid);
    if(rid !== process.env.RID_R){
        console.log("unauthorized")
        return res.status(403).json({
            status: 'failed'
        })
    }
    next();
}