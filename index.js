if(process.env.NODE_ENV!="production")
{
    require('dotenv').config()
}

console.log(process.env);
const dburl=process.env.DB_URL;

const express=require("express");//fpr express
const app=express();
app.set("view engine","ejs");//for ejs
const path=require("path");//for path
const ejsMate=require("ejs-mate");//for ejs-mate
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));//parse middleware
app.set("views",path.join(__dirname,"views"));//find path
app.use(express.static(path.join(__dirname,"/public")));//find path
const mongoose=require("mongoose");//for mongoose
const methodOverride=require("method-override");//for methodoverride
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
app.use(methodOverride("_method"));
const passport=require("passport");
const localStretgy=require("passport-local");

//connect database
const main=async()=>{
    await mongoose.connect(dburl);
}
//for database
main().then((res)=>{
    console.log("succes");
}).catch((err)=>{
    console.log(err);
});

const listing=require("./models/listing.js");//listing model
const wrapAsync=require("./utils/wrapAsync.js")//wrap async function
const ExpressError=require("./utils/ExpressError.js")//expresseroor class
const reviewl=require("./models/review.js");//review model
const { restart } = require("nodemon");
const User=require("./models/user.js");
//port
const port=3000;
//for session store
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
store.on("error",()=>{
    console.log("error in mongo session store",err);
})
const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*30*1000,//like 7 days
        maxAge:7*24*60*30*1000,
        httpOnly:true//for prevent cross site scripting attack
    }
}
app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStretgy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

app.get("/demouser",async(req,res)=>{
    let user1=new User({
        email:"bhaivn@123gmail.com",
        username:"bhaivn"
    });
    let newuser=await User.register(user1,"bhavin");
    console.log(newuser);
    res.send(newuser);
})
const listingrouter=require("./routers/listing.js");
const reviewrouter=require("./routers/review.js");
const userrouter=require("./routers/user.js");
// app.get("/",(req,res)=>{
//     res.send("this is index page");
// });
// app.get("/test",async(req,res)=>{
//     const newlisting=new listing({
//         title:"bhavin",
//         desc:"this is",
//         price:30000,
//         location:"jamngar",
//         country:"india"
//     });
//     await newlisting.save().then((res)=>{
//         console.log("data saved");
//     }).catch((err)=>{
//         console.log(err);
//     });
// });
//this listingschemavlidation using joi
const {listingSchema,reviewSchema}=require("./schema.js");

//there are parent route
app.use("/listings",listingrouter);
app.use("/listings/:id/review",reviewrouter);//if use the in parent route id or parameter then use mergeparms
app.use("/",userrouter);
// app.get("/",(req,res)=>{
//     res.redirect("/listings");
// });
//all

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="some error"}=err;
    res.status(status).render("error.ejs",{message});
});

//web listen
app.listen(port,()=>{
    console.log("Web listen");
});
