var express = require('express')
const mongoose=require('mongoose')
const validator=require('validator')
var bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI"
// const router = express.Router();
const { body, validationResult } = require('express-validator');


mongoose.set('strictQuery', false);

var app = express()
app.use(express.json())
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
        // unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new  Error("Email is invalid")
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    exercise: [
      {
        Date: { type: String },
        Type: { type: String },
        Duration: { type: String },
        Comments: { type: String },
      },
    ],
})
//Generating Tokens
// myschema.methods.generateAuthToken = async function (){
// try{
    
//         const token= await jwt.sign({_id:this._id.toString()} , "mynameisazeemchaudary5iliveinlahore")
//       console.log(token)
// }catch(err){
// res.send(" There is an error "+err)
// console.log(err)
// }
// }

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
    User.findOne({email:email}).then((user)=>{
        if(user)
        return res.status(400).json({message : "user already exists"})
 else if(!firstName || !lastName || !email || !password) {
        return res.status(400).send({status: false, message: "Please submit all required fields!"})
    }else if(password.length < 8) {
        return res.status(400).send({status: false, message: "Password should be at least 8 characters!"})
    }
    else if(!validateEmail(email)) {
        return res.status(400).send({status: false, message: "Please enter valid email"})
    }
    else{
        try{
const result =  new User({
        firstName : firstName , 
        lastName : lastName , 
        email:email ,
        password : password 
    })
    result.save();
    let token = null
    token=jwt.sign({email : result.email , id : result._id} , SECRET_KEY);
    return res.status(201).json({ message: "User created successfully!", data:[result , token]})
        }
        catch(err){
    console.log(err)
    res.status(500).json({message : "Something went wrong"});
        }

    }
    })
   
    
    

    
    //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzM3NjE5NjJ9.Tbm7_LzZNQInUsAgfPKCU04491pVnz5x4D6VmfzdWF0"

 
        
            //let user = await User.create({firstName, lastName, email, password});
    
    //const hashedpassword = await bcrypt.hash(password,10);
    
    //const token = await User.generateAuthToken();
    
})

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
    
//   app.get('/',async (req,res)=>{
//    
//     User.findOne({email :req.body.email})
//     .then((user)=>{
//         const hash =user.password;
//         bcrypt.compare(req.body.password,hash, function(err,result){
//             if(err) console.log("You are having an error in GET API "+err)
//             //const {firstName, lastName, email, password} = res.body;
// //res.send( res.body)
// res.set(res.body)
//         }
//         )
//     })
//   })

// app.post('/login' , async (req, res)=>{
//     try{
//         const email= req.body.email;
//         const password=re.body.password;
//         const useremail = await User.findOne({email :req.body.email})
    
//         const isMatch = await bcrypt.compare(password , useremail.password)
//         if(isMatch){
//             res.status(201)
//         }
//         else{
//             res.send("invalid password")
//         }
//     }catch(err){
//         res.status(400).send("invalid login details")
//     }
   
// })

app.post("/login", (req, res) => {
    User.findOne({ email: req.body.email })
    .then((user) => {
        console.log(user)
      const hash = user.password;
      bcrypt.compare(req.body.password, hash, function (err, result) {
        if(result){
        const logindata = {
          fname: user.firstName,
          lname: user.lastName,
          emailid: user.email
        };
        token=jwt.sign({email : result.email , id : result._id} , SECRET_KEY);
        return res
        .status(200)
        .json({
        success: true,
        message: "Logged In succesfully",
        data: [logindata , token ]
      });
    }
      if(err){
        console.log("You are having an error while login "+err)
      }
        else {res.send("Incorrect Password")}
      });
    }
    )
   .catch(()=>{
    res.send("not valid email")
   })
   
  });

//   app.get('/Profile', (req, res)=>{  
//     const token = req.headers.authorization.split(' ')[1]; 
//     //Authorization: 'Bearer TOKEN'
//     if(!token)
//     {
//         res.status(200).json({success:false, message: "Error! Token was not provided."});
//     }
//     //Decoding the token
//     const decodedToken = jwt.verify(token,SECRET_KEY );
//     res.status(200).json({
//         success:true, 
//         data:{
//             userId:decodedToken.userId,
//      email:decodedToken.email
//     }});   
// })

app.get('/Profile', (req, res)=>{  
    const token = req.headers.authorization.split(' ')[1]; 
    //Authorization: 'Bearer TOKEN'
    if(!token)
    {
        res.status(200).json({success:false, message: "Error! token not provided"});
    }
    //Decoding the token
    const decodedToken = jwt.verify(token, SECRET_KEY);
    res.status(200).json({success:true, data:{fname:decodedToken.fname, lname:decodedToken.lname,
     email:decodedToken.email
    }}
    )});

     app.post('/EditProfile', (req,res)=>{
        User.updateOne({email:req.body.email},{$set: {
          "firstName": req.body.newfname, 
          "lastName": req.body.newlname,
          "email":req.body.newEmail
        }})
        .then(()=>
        {
          
          return res
          .status(200).json({success:true, message:"Profile Edited successfully"})
        })
        .catch(()=>{
          res.send("there was some issue")
        })
        })

        app.post('/UpdatePassword', async (req,res)=>{
            const {email,password} = req.body;
            if(password.length < 8) {
                return res.status(400).send({status: false, message: "Password should be at least 8 characters!"})
            }
            else if(!validateEmail(email)) {
                return res.status(400).send({status: false, message: "Please enter valid email"})
            }
            else{
                console.log("Your updated password is " +password);

                const newPass = await bcrypt.hash(password , 10)
                console.log("Your updated password (Encrypted ) is " +newPass);

                User.updateOne({email:email},{$set: {
                    "password" : newPass
                  }})
                  .then(()=>
                  {
                    
                    return res
                    .status(200).json({success:true, message:"Password Edited successfully"})
                  })
                  .catch(()=>{
                    res.send("there was some issue")
                  })
            }
            
            })

            app.post("/workout", (req, res) => {
              User.updateOne(
                { email: req.body.email },
                {
                  $push: {
                    track: {
                      Date: req.body.Date,
                      Type: req.body.Type,
                      Duration: req.body.Duration,
                      Comments: req.body.Comments,
                    },
                  },
                }
              )
                .then(() => {
                  User.findOne({ email: req.body.email }).then((user) => {
                    token = jwt.sign(
                      {
                        fname: user.firstName,
                        lname: user.lastName,
                        email: user.email,
                        track: user.track,
                      },
                      SECRET_KEY,
                      { expiresIn: "10h" }
                    );
                    return res.status(200).json({
                      success: true,
                      message: "Exercise added successfully",
                      token: token,
                    });
                  });
                })
                .catch(() => {
                  res.send("there was some issue");
                });
            });
    //For API Testing in Postman Use this URL
//http://localhost:8081/api/v1/user/new
app.listen(8081 , ()=>{
    console.log("Listening at Port 8081")
});