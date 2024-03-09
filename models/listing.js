const mongoose = require("mongoose");
const review=require("./review.js");
const { listingSchema } = require("../schema");
const schemalist = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "not added",
  },
  image: {
   url:String,
   filename:String,
  },
  price: {
    type: Number,
    require: true,
  },
  location: {
    type: String,
    default: "not added",
  },
  country: {
    type: String,
    default: "not added",
  },
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
});

//this middle ware use for when whole listing is deleted 
schemalist.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await review.deleteMany({_id:{$in:listing.reviews}});
  }
});
const listing = mongoose.model("listing", schemalist);
module.exports = listing;
