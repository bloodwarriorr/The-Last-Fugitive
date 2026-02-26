const DBSingleton = require('../utils/db-singleton');
const DB = DBSingleton.getInstance();
const verifyAdmin = async(req, res, next) => {
    const uuid =
      req.body?.uuid || req.query?.uuid || req.headers["uuid"];

    if (!uuid) {
      return res.status(403).send("Uuid is required for authentication");
    }
    try {
      const validAdmin= await DB.FindByUID("admin",uuid)
      if(!validAdmin){
        return res.status(403).send("Bad Credentials");
      }
    } catch (err) {
      return res.status(401).send("Invalid Uuid");
    }
    return next();
  };


module.exports = verifyAdmin;
