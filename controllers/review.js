const ExpressError=require("../utils/ExpressError.js")//expresseroor class
const reviewl=require("../models/review.js");//review model
const listing=require("../models/listing.js");//listing model

module.exports.addreview=async(req,res)=>{
    let {id}=req.params;
    let newreview=new reviewl(req.body.review);
    newreview.author=req.user._id;
    console.log(newreview);
    await newreview.save();
    let list=await listing.findById(id);
    list.reviews.push(newreview);
    await list.save();
    req.flash("success","review is created");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyreview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await reviewl.findByIdAndDelete(reviewid);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
}