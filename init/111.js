const initdata=require("./data.js");
const listing=require("../models/listing.js");
const mongoose=require("mongoose");
const main=async ()=>{
    await mongoose.connect("mongodb+srv://bhavin:bhavin123@cluster0.mgx7o8u.mongodb.net/project");
}
main().then((res)=>{
    console.log("succes");
}).catch((err)=>{
    console.log(err);
});
const init=async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"65ddf04c5da99e39bab4f38c"}));
    await listing.insertMany(initdata.data);
}
init().then((res)=>{
    console.log("inti succes");
}).catch((err)=>{
    console.log(err);
});