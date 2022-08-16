// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const tokenSchema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: "user",
//     },
//     token: {
//         type: String,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         expires: 3600,
//     },
// });

// module.exports = mongoose.model("token", tokenSchema);

class Token{
userId
token
createdAt 
constructor(userId,token){
this.userId = userId
this.token=token
this.createdAt={default:Date.now,expires:3600}
}

}
module.exports = Token;