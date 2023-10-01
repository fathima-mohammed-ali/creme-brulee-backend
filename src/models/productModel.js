const mongoose= require ('mongoose')
const schema= mongoose.Schema
const productSchema = new schema({
    category:{type:String},
    itemName:{type:String},
    description:{type:String},
    ingredients:{type:String},
    price:{type:Number},
    product_available:{type:Number},
    image:{type:String},
})
const productModel=mongoose.model('product_tb',productSchema)
module.exports=productModel