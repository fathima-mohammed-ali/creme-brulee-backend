const express = require('express')
const cartModel = require('../models/cartModel')
const checkAuth = require('../middleware/checkAuth')
const mongoose = require('mongoose')
const productModel = require('../models/productModel')
const checkoutModel = require('../models/checkoutModel')
const cart = express.Router()


cart.post('/add-to-cart', checkAuth, async (req, res) => {
    try {
        const { loginID } = req.userData
        const { productID } = req.body
        const dateString = new Date();
        const date = new Date(dateString);
        const formattedDate = date.toISOString().split('T')[0];
        const cartItem = await cartModel.findOne({ productID, loginID })
        if (!cartItem) {
            const addToCart = new cartModel({ loginID, productID, quantity: 1, status: 0,date:formattedDate });
            await addToCart.save()
            return res.status(200).json({
                success: true,
                error: false,
                message: "the item is added to cart successfully"
            })
        }
        else {
            return res.status(500).json({
                success: false,
                error: true,
                message: "the item is already exist in cart"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "failed to add item in cart"
        })

    }
})

cart.post('/checkout', checkAuth, async (req, res) => {
    try {
        const { loginID } = req.userData
        const updateStatus = await cartModel.updateMany({ loginID }, { status: 1 });
        if (updateStatus) {

            const checkout = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                postcode: req.body.postcode,
                phone: req.body.phone,
                email: req.body.email,
                ordernotes: req.body.ordernotes,
                event: req.body.event,
                theme: req.body.theme,
                date: req.body.date,
                time: req.body.time,
                location: req.body.location,
            }
            const save_details = await checkoutModel(checkout).save()
            if (save_details) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    message: "place order"
                })
            }
            else {
                return res.status(400).json({
                    success: false,
                    error: true,
                    message: "failed to place order"
                })
            }
        }
        else {
            return res.status(500).json({
                success: false,
                error: true,
                message: "Status not updated",
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: true,
            error: false,
            message: "something went wrong"
        })

    }
})

cart.get('/view-cart', checkAuth, async (req, res) => {
    try {
        const { loginID } = req.userData;
        console.log('userId', loginID);
        const cartItems = await cartModel.aggregate([

            {
                '$lookup': {
                    'from': 'product_tbs',
                    'localField': 'productID',
                    'foreignField': '_id',
                    'as': 'productDetails'
                }
            },
            {
                '$unwind': '$productDetails'
            },
            {
                '$match': {
                    'loginID': new mongoose.Types.ObjectId(loginID),
                    'status': '0'
                }

            },
            {
                '$group': {
                    '_id': '$_id',
                    'quantity': { '$first': '$quantity' },
                    'status': { '$first': '$status' },
                    'category': { '$first': '$productDetails.category' },
                    'itemName': { '$first': '$productDetails.itemName' },
                    'price': { '$first': '$productDetails.price' },
                    'image': { '$first': '$productDetails.image' },

                }
                // $group: {
                //     _id: '$productID',
                //     cartItems: {
                //         $push: {
                //             quantity: '$quantity',
                //             status: '$status',
                //             productDetails: {
                //                 category: '$productDetails.category',
                //                 itemName: '$productDetails.itemName',
                //                 price: '$productDetails.price',
                //                 image: '$productDetails.image'
                //             }        
                //         }
                //     }
                // }

            }
        ]);
        cartItems.forEach((item) => {
            item.subtotal = item.price * item.quantity;
        })

        if (cartItems) {
            return res.status(200).json({
                success: true,
                error: false,
                details: cartItems
            })
        } else {
            return res.status(400).json({
                success: true,
                error: false,
                message: "No data found"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

cart.get('/displayItems-withStatus2', checkAuth, async (req, res) => {
    try {
        const { loginID } = req.userData;
        console.log('userId', loginID);
        const cartItems = await cartModel.aggregate([

            {
                '$lookup': {
                    'from': 'product_tbs',
                    'localField': 'productID',
                    'foreignField': '_id',
                    'as': 'productDetails'
                }
            },
            {
                '$unwind': '$productDetails'
            },
            {
                '$match': {
                    'loginID': new mongoose.Types.ObjectId(loginID),
                    'status': '2'
                }

            },
            {
                '$group': {
                    '_id': '$_id',
                    'quantity': { '$first': '$quantity' },
                    'status': { '$first': '$status' },
                    'date': { '$first': '$date' },
                    'category': { '$first': '$productDetails.category' },
                    'itemName': { '$first': '$productDetails.itemName' },
                    'price': { '$first': '$productDetails.price' },
                    'image': { '$first': '$productDetails.image' },

                }
                // $group: {
                //     _id: '$productID',
                //     cartItems: {
                //         $push: {
                //             quantity: '$quantity',
                //             status: '$status',
                //             productDetails: {
                //                 category: '$productDetails.category',
                //                 itemName: '$productDetails.itemName',
                //                 price: '$productDetails.price',
                //                 image: '$productDetails.image'
                //             }        
                //         }
                //     }
                // }

            }
        ]);
        cartItems.forEach((item) => {
            item.subtotal = item.price * item.quantity;
        })

        if (cartItems) {
            return res.status(200).json({
                success: true,
                error: false,
                details: cartItems
            })
        } else {
            return res.status(400).json({
                success: true,
                error: false,
                message: "No data found"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

cart.post('/delete/:_id', async (req, res) => {
    try {
        const { _id } = req.params
        const deleteItem = await cartModel.deleteOne({ _id: _id })
        if (deleteItem.deletedCount == 1) {
            return res.status(200).json({
                success: true,
                error: false,
                message: "the item is deleted"
            })
        }
        else {
            return res.status(404).json({
                success: false,
                error: true,
                message: "the item is not found"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "something went wrong"
        })
    }
})

cart.get('/quantity-add-cart/:_id', async (req, res) => {
    try {
        const { _id } = req.params
        const old = await cartModel.findOne({ _id: _id })
        const quantity = old.quantity + 1
        const add = await cartModel.updateOne({ _id: _id }, { $set: { quantity: quantity } })
        if (add.modifiedCount === 1) {
            const old_product = await productModel.findOne({ _id: old.productID })
            const available_quantity = old_product.product_available - 1
            console.log(available_quantity);
            const products = await productModel.updateOne({ _id: old.productID }, { $set: { product_available: available_quantity } })
            console.log(products);
            if (products.modifiedCount === 1) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    message: "updated"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    error: true,
                    message: "error"
                })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" })
    }
})

cart.get("/quantity-minus-cart/:_id", async (req, res) => {
    try {
        const { _id } = req.params
        const old = await cartModel.findOne({ _id: _id })
        const quantity = old.quantity - 1
        const add = await cartModel.updateOne({ _id: _id }, { $set: { quantity: quantity } })
        if (add.modifiedCount === 1) {
            const old_product = await productModel.findOne({ _id: old.productID })
            const available_quantity = old_product.product_available + 1
            const products = await productModel.updateOne({ _id: old.productID }, { $set: { product_available: available_quantity } })
            if (products.modifiedCount === 1) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    message: "updated"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    error: true,
                    message: "error"
                })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" })
    }
})

cart.post('/payment', checkAuth, async (req, res) => {
    try {
        const { loginID } = req.userData
        const updateStatus = await cartModel.updateMany({ loginID }, { status: 2 });
        if (updateStatus) {
            return res.status(200).json({
                success: true,
                error: false,
                message: "the payment is done"
            })
        }
        else {
            return res.status(400).json({
                success: false,
                error: true,
                message: "the payment is failed"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "something went wrong"
        })
    }
})

module.exports = cart







