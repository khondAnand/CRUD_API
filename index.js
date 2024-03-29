import express from 'express'
import mongoose from "mongoose"


import { v4 as uuidv4 } from 'uuid';
import bodyParser from "body-parser";

mongoose.connect('mongodb://127.0.0.1:27017/BA_ProductsDb', {

    useUnifiedTopology: true
});
// ba_productsdb is the database name.

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


const { Schema } = mongoose;

const ProductSchema = new Schema({

    name: String,
    price: Number,
    ProductId: String
});

const ProductModel = mongoose.model('Product', ProductSchema);
// the collection name is table name so here "Product" is collection/table name




// in the below route we get a particular product.

app.get('/product/:id', (req, res) => {

    const PdtId = req.params.id;
    ProductModel.find({ ProductId: PdtId }, (err, val) => {

        if (err) console.log(err);
        else console.log(val);

    })



})

// in the below route we get all the products.

app.get('/AllProducts', (req, res) => {

    ProductModel.find((err, val) => {
        if (err) console.log(err);
        else {
            console.log(val);
        }


    })

})


// this route is to create/add new product to db.

app.post('/createProduct',  (req, res) => {

   




    const userId = uuidv4();
    const newProduct = new ProductModel({
        name: req.body.name,
        price: req.body.price,
        ProductId: userId

    });



    newProduct.save((err) => {
        if (err) {
            console.log("error in saving new product");

        } else {
            console.log("product saved");

        }
    });



});


// this is to update particular product.

app.put('/update/:id',  (req, res) => {

    const UpdateId = req.params.id;
    const UpDateName = req.body.name;
    const UpDatePrice = req.body.price;

    ProductModel.findOneAndUpdate({ ProductId: UpdateId }, { $set: { name: UpDateName, price: UpDatePrice } }, { new: true }, (err, data) => {

        if (data == null) {
            res.send("no matching product found")
        }
        else {
            res.send("updated")
        }



    })
})


// this is to delete a particular product.

app.delete('/delete/:id', (req, res) => {
   

    const id = req.params.id;
    ProductModel.findOneAndDelete(({ ProductId: id }), (err, data) => {
        if (err) res.send("no such product found");
        else {
            console.log("sucessfully deleted");
            res.send(data);
        }
    })


})





app.listen(3000, () => {
    console.log("app running at 3000");
})
