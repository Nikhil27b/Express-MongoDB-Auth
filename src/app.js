require("dotenv").config();
const auth = require("./db/auth")
const express = require("express");
require("./db/connection");
const bcrypt = require("bcryptjs");
const cookieparser = require("cookie-parser");
const Users = require("./model/user")
const path = require("path");
const port = process.env.port || 3000;
const hbs = require("hbs");
const app = express();


const static = path.join(__dirname, "./public");
const dynamic = path.join(__dirname, "./screens");

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieparser());
app.set("view engine", "hbs");

app.set("views", dynamic);

hbs.registerPartials(dynamic);

app.use(express.static(static));

app.get("/", (req, res) => {
  res.render("home", {
  });
});

app.get("/user", auth, (req, res) => {
  res.render("user", {
    username: auth.findOne({username}),
  });
});


app.get("/register", (req,res)=>{
res.status(200).render("signup")
})

app.get("/login",(req , res)=>{
  res.render("login");
})

app.post("/login", async (req ,res)=>{
  try {
    const email = req.body.email;
    const password = req.body.password;
    const checkemail = await Users.findOne({email : email});
    const isValid = bcrypt.compare(password,checkemail.password);
    const token = await checkemail.genrateAuthToken();
    res.cookie("jwt",token,{
      httpOnly:true,
      expires: new Date(Date.now() + 50000)
    });


    if(isValid) {
      res.status(201).render("home",{
        username:checkemail.username,
      });
    } else {
      res.status(400).send("Please check your email & password")
    }
  } catch (e) {
    res.status(400).send("Invalid Email" + e);
  }
})


app.post("/register", async (req, res) => {
  try {
    const user = new Users({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
    });
    const token = await user.genrateAuthToken();
    res.cookie("jwt",token,{
      httpOnly:true,
      expires: new Date(Date.now() + 50000)
    });

    const userdata = await user.save();
    res.status(201).render("home",{
        username:req.body.username,        
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log("Server Started");
});
