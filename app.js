require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app= express();

console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true, useUnifiedTopology: true });

const userschema = new mongoose.Schema({
  email: String,
  pass: String
});


userschema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["pass"]});

const User = mongoose.model("user",userschema);


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});


app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newuser = new User({
    email: req.body.username,
    pass: req.body.password
  });
  newuser.save(function(err){
    if(err){
      console.log(err);
    }else {
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const name = req.body.username;
  const password = req.body.password;
  User.findOne({email: name},function(err,founduser){
    if(err){
      console.log(err);
    }else {
      if(founduser){
        if(founduser.pass === password){
          res.render("secrets");
        }
      }
    }
  });
});



app.listen(3000,function(){
  console.log("server staerted at port 3000");
});
