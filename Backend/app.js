var express = require('express')
const mongoose=require('mongoose')
const validator=require('validator')
var bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const cors = require("cors");

// const router = express.Router();
const { body, validationResult } = require('express-validator');


mongoose.set('strictQuery', false);

var app = express()
app.use(cors({origin: "*"}))
mongoose.connect("mongodb://127.0.0.1:27017/ExerciseTracking")
.then(()=>{
    console.log("MongoDB Connection Successfull")
})
.catch((err)=>{
    console.log("You are having an error while connecting to MongoDB"+err)
});


//Making Schema
const myschema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,        
        trim:true,
        minlength:2,
        maxlength:20
    },
    lastName:{
        type:String,
        //required:true,
        trim:true,
        lowercase:true
       
    },
        email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new  Error("Email is invalid")
            }
        }
    },
    password:{
        type:String,
        required:true
    }
})

myschema.pre("save", async function(next){
    try{
        if(this.isModified("password")){
            // const passwordHash= await bcrypt.hash(this.password,10)
             console.log(`current password is ${this.password}`)
             this.password= await bcrypt.hash(this.password , 10)
             console.log(`current password after encryption is ${this.password}`)
     
         }
        
         next()    // now save method will be called 
    }
    catch(err){
 console.log("You are having an error "+err);
    }
})

//Making Collection
const User=new mongoose.model("ExerciseTracking", myschema)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//First Method for validating POST API
// app.post("/",
// body('firstName').isString().isLength({
//     min: 2,
//     max:20
// }),
// body('lastName').isString(),
// body('email').isEmail().normalizeEmail(),
// body('password').isLength({
//     min: 6,
//     max:15
// }).isString()
// ,
// async (req,res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             errors: errors.array()
//         });
//     }
//     else{
//         const user= await User.create(req.body);

//         res.status(201).json({
//             success: true,
//             user
//         })
//     }
    
//     // console.log(request.body);
//     });


    //Second Method for Validating POST API
    app.post("/", async (req, res)=> {
    console.log(req.body)
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !email || !password) {
        return res.status(400).send({status: false, message: "Please submit all required fields!"})
    }
    if(password.length < 8) {
        return res.status(400).send({status: false, message: "Password should be at least 8 characters!"})
    }
    if(!validateEmail(email)) {
        return res.status(400).send({status: false, message: "Please enter valid email"})
    }
    let user = await User.create({firstName, lastName, email, password});
    res.send({status: true, message: "User created successfully!", user})
})

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
    // app.use("/", router);

    //For API Testing in Postman Use this URL
//http://localhost:8081/api/v1/user/new
app.listen(8081 , ()=>{
    console.log("Listening at Port 8081")
});