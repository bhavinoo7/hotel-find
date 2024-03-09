const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewl = require("../models/review.js"); //review model
const { restart } = require("nodemon");
const { listingSchema } = require("../schema.js");
const mapToken = process.env.MAP_TOKEN;
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = mapToken;

module.exports.index = async (req, res) => {
  let alllistings = await listing.find();
  res.render("listings/listings.ejs", { alllistings });
};

module.exports.rendernewlistingform = (req, res) => {
  //if this route use after the  id then error ocuure
  res.render("listings/add.ejs");
};

module.exports.addnewlisting = async (req, res, next) => {
  //for cordinate
  const resulta = await maptilerClient.geocoding.forward(
    req.body.listing.location
  );

  let result = listingSchema.validate(req.body); //this is one type of serverside validation
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, filename);
  let newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = resulta.features[0].geometry;
  console.log(newlisting);
  await newlisting.save();
  req.flash("success", "listing is created succefully");
  res.redirect("/listings");
};

module.exports.rendershowlisting = async (req, res) => {
  let { id } = req.params;
  let listingi = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(listingi);
  if (!listingi) {
    req.flash("error", "listing is not exist");
    res.redirect("/listings");
  }
  console.log(listingi);
  res.render("listings/show.ejs", { listingi });
};

module.exports.redereditlistingform = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let listinge = await listing.findById(id);
  if (!listinge) {
    req.flash("error", "listing is not exist");
    res.redirect("/listings");
  }
  let originalimageurl = listinge.image.url;
  originalimageurl.replace("/upload", "/upload/e_blur:300"); //here is not working because
  console.log(originalimageurl);
  res.render("listings/edit.ejs", { listinge, originalimageurl });
};

module.exports.editlisting = async (req, res) => {
  //here using second type of serverside validation
  let { id } = req.params; //using the validation middleware
  console.log(req.body.listing);
  let newlisting = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newlisting.image = { url, filename };
    await newlisting.save();
  }
  const resulta = await maptilerClient.geocoding.forward(
    req.body.listing.location
  );
  newlisting.geometry = resulta.features[0].geometry;
  newlisting.save();
  console.log(newlisting);
  req.flash("success", "listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  await listing.findByIdAndDelete(id);
  req.flash("success", "listing is deleted");
  res.redirect("/listings");
};
