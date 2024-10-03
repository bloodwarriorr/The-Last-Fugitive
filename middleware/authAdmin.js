const DBSingleton = require('../utils/db-singleton');
const DB = DBSingleton.getInstance();
const verifyAdmin = async(req, res, next) => {
    const uid =
      req.body.uid || req.query.uid || req.headers["uid"];
  
    if (!uid) {
      return res.status(403).send("Uid is required for authentication");
    }
    try {
      const validAdmin= await DB.FindByUID("admin",uid)
      if(!validAdmin){
        return res.status(403).send("Bad Credentials");
      }
    } catch (err) {
      return res.status(401).send("Invalid Uid");
    }
    return next();
  };


module.exports = verifyAdmin;
