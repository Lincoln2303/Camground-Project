//                  LXVIII. UPLOADING TO CLOUDINARY BASICS

// LXVIII.01. Requiring cloudinary, and multer-storage-cloudinary here:
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// LXVIII.02. We need to pass in cloudinary, to CloudinaryStorage:
// NOTE: We begin by setting the config on cloudinary (in case of questions look at cloudinary packages DOCS)
// EXTRA NOTE: This is basically about associating our account with this cloudinary instance
cloudinary.config({
    // LXVIII.03. Here we need to specify cloud name (NOTE: Same name from .env file)
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // LXVIII.04. We add the API key, and secret the same way:
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
};


