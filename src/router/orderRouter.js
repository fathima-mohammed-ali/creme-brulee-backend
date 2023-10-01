const express = require('express')
const order = express.Router()
const multer = require('multer')
const fs = require('fs');
const path= require('path')
const productModel = require('../models/productModel');
const { log } = require('console');
// getFilesInDirectory();
// fs.unlink("example_file.txt", (err => {
//     if (err) console.log(err);
//     else {
//         console.log("\nDeleted file: example_file.txt");

//         // Get the files in current directory
//         // after deletion
//         getFilesInDirectory();
//     }
// }));
function getFilesInDirectory() {
    console.log("\nFiles present in directory:");
    let files = fs.readdirSync(__dirname);
    files.forEach(file => {
        console.log(file);
    });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/creme-brulee/public/upload/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name)
    }
})
const upload = multer({ storage: storage })

order.post('/product-details', upload.single('file'), async (req, res) => {
    try {
        const productdetails = {
            category:req.body.category,
            itemName: req.body.itemName,
            description: req.body.description,
            ingredients: req.body.ingredients,
            product_available:req.body.product_available,
            price: req.body.price,
            image: req.body.image,
        }
        const saveProduct = await productModel(productdetails).save()
        if (saveProduct) {
            return res.status(200).json({
                success: true,
                error: false,
                details: saveProduct,
                message: "Product details saved"
            })
        }
        else {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Product details missing"
            })
        }
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: true,
            message: "something went wrong"
        })
    }
})

order.get('/view-product', async (req, res) => {
    try {
        const id = req.params._id
        const viewProduct = await productModel.find(id)
        if (viewProduct) {
            return res.status(200).json({
                success: true,
                error: false,
                details: viewProduct,
                message: "ready to view"
            })
        }
        else {
            return res.status(404).json({
                success: false,
                error: true,
                message: "can't view"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: true,
            error: false,
            message: "something went wrong"
        })
    }
})

order.post('/delete-product', async (req, res) => {
    try {
        const name = req.body.itemName
        const deleteProduct = await productModel.deleteOne({ itemName: name })
        console.log(deleteProduct);
        if (deleteProduct.deletedCount == 1) {
            return res.status(200).json({
                success: true,
                error: false,
                message: "item is deleted"
            })
        }
        else {
            return res.status(404).json({
                success: false,
                error: true,
                message: "item not found"
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

order.post('/update-product', upload.single('file'), async (req, res) => {
    try {
        const productName = req.body.olditemName
        console.log(req.body);
        const { category,itemName, description, ingredients, price,product_available,image } = req.body;
        console.log(category,itemName, description, ingredients, price,product_available,image);
        const details= await productModel.findOne({olditemName:productName})
        // const fileName =details.image
        // const directoryPath = path.join(__dirname, '/client/creme-brulee/public/upload');
        // console.log(directoryPath);
        // fs.unlink(directoryPath + fileName, (err) => {
        //     if (err) {
        //         throw err;
        //     }
        
        //     console.log("Delete File successfully.");
        // });

        const updateItem = await productModel.updateMany({itemName: productName },
            { $set: { category,itemName, description, ingredients, price,product_available,image } }

        );
        console.log(updateItem);
        if (updateItem.modifiedCount == 1) {
            return res.status(200).json({
                success: true,
                error: false,
                details: updateItem,
                message: "Data Updated"
            })
        } else {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Not Updated"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: true,
            error: false,
            message: "something went wrong"
        })
    }
})

order.get('/product-image/:name', async (req, res) => {
    try {
        const productName = req.params.name;
        console.log(productName);
        const viewProduct = await productModel.find({ name: productName })
        console.log(viewProduct);
        if (viewProduct.length>0) {
            return res.status(200).json({
                success: true,
                error: false,
                details:viewProduct[0],
                message: "single view"
            })
        }
        else {
            return res.status(404).json({
                success: false,
                error: true,
                message: "unable to view"
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

order.get('/price-filter', async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query
        console.log('Received query:', minPrice, maxPrice);
        // const items = await productModel.find({price:{$gte:minPrice,$lte:maxPrice}})
        const items = await productModel.find()
        // console.log({price:{$gte:minPrice,$lte:maxPrice}});
        const filteredValue=items.filter(function(x){ return x.price >= parseInt(minPrice) && x.price <= parseInt(maxPrice)});
        console.log(filteredValue);
        // const filteredData=filteredValue.filter(function(y){ return y.category === category});
        if (filteredValue) {
            return res.status(200).json({
                success: true,
                error: false,
                details: filteredValue,
                message: "filter process is done"
            })
        }
        else {
            return res.status(400).json({
                success: false,
                error: true,
                message: "filter process is failed"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: true,
            error: false,
            message: "something went wrong"
        })
    }
})


order.get('/category-filter', async (req, res) => {
    try {
        const selectedCategory  = req.query.category
        console.log(selectedCategory);
        const products = await productModel.find({ category: selectedCategory });
        console.log({ category: selectedCategory });
        if (products.length > 0) {
            return res.status(200).json({
                success: true,
                error: false,
                details:products,
                message: "Category filtered",
            });
        } else {
            return res.status(404).json({
                success: false,
                error: true,
                message: "No products found in the selected categories"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "Something went wrong"
        });
    }
});


module.exports = order
