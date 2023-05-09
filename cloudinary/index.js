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

// LXVIII.05. Next stop we're going to instantiate an instance of cloudinary storage:
// NOTE: Now this CloudinaryStorage is configured, and has the credentials for cloudinary accout
const storage = new CloudinaryStorage({
    // LXVIII.07. Here we have to pass in cloudinary object: (NOTE: That we've just configured)
    cloudinary,
    // LXVIII.08. We can specify folder: (NOTE: The folder in cloudinary, where we store things in)
    // NOTE: We have to put these to params:
    params: {
        folder: 'YelpCamp',
        // LXVIII.09. We can specify formats we allow:
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

// LXVIII.10. Then we're just exporting it: (NOTE: both cloudinary instance (that we've configured), and storage)
// AFTER: We'll require storage in routes/campgrounds.js (LXVIII.11.)
module.exports = {
    cloudinary,
    storage
};


