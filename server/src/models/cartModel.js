const mongoose= require ('mongoose')
const schema= mongoose.Schema
const cartSchema = new schema({
   loginID:{type:mongoose.Types.ObjectId,ref:"login_tb"},
   productID:{type:mongoose.Types.ObjectId,ref:"product_tb"},
   quantity:{type:Number},
   date:{type:String},
   status:{type:String},
})
const cartModel=mongoose.model('cart_tb',cartSchema)
module.exports=cartModel