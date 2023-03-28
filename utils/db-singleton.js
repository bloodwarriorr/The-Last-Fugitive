const DB= require('./db')
class PrivateDBSingleton{
    constructor() {
        return new DB();
    }
}

class DBSingleton{
    constructor(){
        throw new Error("Use DBsingleton.getInstance()!")
    }
    static getInstance(){
        if(!DBSingleton.instance){
            DBSingleton.instance=new PrivateDBSingleton();
        }
        return DBSingleton.instance;
    }
}

module.exports=DBSingleton;