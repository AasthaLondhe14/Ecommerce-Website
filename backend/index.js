const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require('path');
const { type } = require("os");
const jwt = require("jsonwebtoken");


// Middleware
app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://aasthalondhe:14102004%40Aastha@cluster0.umyyu.mongodb.net/e-commerce", {
    useNewUrlParser: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log("MongoDB Connection Error: " + error));

// Model Setup product table
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Image Storage Setup
const storage = multer.diskStorage({
    destination: './upload/images',  // Destination for image storage
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Create API to handle Image Upload
app.use('/images', express.static('upload/images'));  // Static folder to serve images

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,  // Return image URL
    });
});

// API to Add Product admin
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product = products[products.length - 1];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    const { name, image, category, new_price, old_price } = req.body;

    const product = new Product({
        id: id,
        name: name,
        image: image,
        category: category,
        new_price: new_price,
        old_price: old_price,
    });

    try {
        await product.save();
        console.log("Product Saved Successfully");
        res.json({
            success: true,
            name: name,
        });
    } catch (error) {
        console.log("Error in saving product: ", error);
        res.json({
            success: false,
            message: "Failed to add product",
        });
    }
});

// Updated API to Remove Product
app.post('/removeproduct', async (req, res) => {
    try {
        const result = await Product.findOneAndDelete({ id: req.body.id });
        if (result) {
            console.log("Product Removed Successfully");
            res.json({
                success: true,
                message: "Product removed",
            });
        } else {
            console.log("Product not found");
            res.json({
                success: false,
                message: "Product not found",
            });
        }
    } catch (error) {
        console.error("Error removing product:", error);
        res.json({
            success: false,
            message: "Error removing product",
        });
    }
});

// API to Get All Products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
});

//Schema creating for user model
const Users= mongoose.model('Users',{
    name:{
        type:String, 
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// creating endpoint for registering the user
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with the same email_id" });
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();

        const data = {
            user: {
                id: user.id,
            },
        };
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//creating endpoint for newcollection data
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);//get 8 items
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products= await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);//get 4 items
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})


//creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
    }
}

// creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

// creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

// creating endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("Get Cart");
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData);
})

// creating endpoint for userlogin 
app.post('/login',async (req,res)=>{
    let user= await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data= {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,error:"Wrong Password"});
        }   
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})


// Server Listening
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});

