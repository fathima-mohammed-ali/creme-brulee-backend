const mongoose = require('mongoose')
const schema = mongoose.Schema
const userRegisterSchema= new schema({
    loginID:{type:mongoose.Types.ObjectId,ref:"login_tb"},
    email:{type:String},
})
const userModel=mongoose.model('userRegister_tb',userRegisterSchema)
module.exports =userModel