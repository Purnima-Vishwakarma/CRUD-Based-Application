const express=require("express");
const app=express();
const mongoose = require('mongoose');
const bodyParser=require("body-parser");
app.use(express.static("public"));
app.set("view engine", "ejs"); 

const Item = require('./models/item');
const methodOverride=require('method-override');
app.use(methodOverride('_method'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
main()
    .then(()=>{
    console.log("connection successfull");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/CRUD');
}
app.get("/",async(req,res)=>{
res.render("item.ejs");
});
app.post('/add-item',async(req,res)=>{
    // res.send("insert the item");
    const {name,description,price}=req.body;
    const newItem=new Item({
        name,
        description,
        price,
    });
    console.log(req.body);
    await newItem.save();

    // res.render("item.ejs");
    // res.send("item added succesfully");
    res.redirect("/items");
});
app.get('/items',async(req,res)=>{
    const items=await Item.find();
    res.render('items',{items});
});
app.get('/edit-item/:id',async(req,res)=>{
    const item=await Item.findById(req.params.id);
    res.render('editItem',{item});
})
app.post('/update-item/:id',async(req,res)=>{
    await Item.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
    },{new:true});
    res.redirect('/items')
});
app.delete('/delete-item/:id',async(req,res)=>{
    await Item.findByIdAndDelete(req.params.id);
    res.redirect('/items');
});
app.listen(3000,()=>{
    console.log("port is listenting 3000");
});
