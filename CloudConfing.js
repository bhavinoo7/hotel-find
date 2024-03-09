const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,//here key is final but in env file key is your choice
    api_secret:process.env.CLOUD_API_KEY_SECRET,
});

 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'airbnb_DEV',
      allowerdFormats:["png","jpg","jpeg","img"],
    },
  });

  module.exports={
    cloudinary,storage
  }