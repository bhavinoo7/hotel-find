const joi = require("joi");
//use for the server side validation handling using joi npm pakage
module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      //here name is same then compare
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().min(0).required(),
      image: joi.string().allow("", null),
      country: joi.string().required(),
      location: joi.string().required(),
    })
    .required(),
});
module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().min(1).max(5).required(),
        comment:joi.string().required(),
    }).required()
});