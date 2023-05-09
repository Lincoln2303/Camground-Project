//                  II. CAMPGROUND MODEL BASICS

// II.01. We start by requiring mongoose:
const mongoose = require('mongoose');
// II.02. We are making a variable for our Schema:
// NOTE: This is a shortcut, it makes easier to use it as a reference! 
const Schema = mongoose.Schema;
// XXV.05. Requiring Review model:
const Review = require('./review')

//                  LXXVI. ADDING A THUMBNAIL VIRTUAL PROPERTY

// LXXVI. NOTE: We want to set up a size for each image, and for that we have to set a virtual property on images

// LXXVI.01. To make this easier, we're going to make a separate image schema:
// NOTE: We're moving the codes here from campground schema (COMMENT IT OUT THERE => AND UPDATE IT images: [imageSchema])
const imageSchema = new Schema({ 
            url: String,
            filename: String
})
// LXXVI.02. Now we can set up a thumbnail on each images:
imageSchema.virtual('thumbnail').get(function () {
    // LXXVI.03. Here we can access "this.filename": (NOTE: this will refer to a particular image => Test it after!)
    // NOTE: We want to take the url, and we want to add after "/upload/" the size we want to set (by replacing)
    // AFTER: now we have a new property "image.thumbnail" that we have to add to /campgrounds/edit.ejs (LXXVI.04.) 
    return this.url.replace('/upload', '/upload/w_200');
});

// LXXXVIII.05. We have to set an options to make mongoose work with the the properties:
// NOTE: By adding this we're enabling mongoose to convert virtuals
// AFTER: We have to add opt to our schema below at the bottom (LXXXVIII.06. )
const opts = { toJSON: { virtuals: true } };

//                  LV. ADDING AN AUTHOR TO CAMPGROUND

//                  LXIX. STORING UPLOADED IMAGE LINKS IN MONGO

// LXIX. NOTE: Technically we're storing the pictures in a folder in cloudinary. We want to strore the path (so we can set up an image with a source, and display the image) and the filename (in case if we want a user to be able to delete pictures), that we get back from the file. => So we're going to update our model below!

// II.03. We are making our schema:
const CampgroundSchema = new Schema({
    // II.04. We are just adding simple attributes:
    title: String,
    // XIII.01. Adding image attribute:
    // AFTER: We have to add image in /seeds/index.js (XIII.02.)
    // LXIX.01. We're making image an array: 
    // NOTE: We want pontentially multiple images, and we need the url, and filename for that (both are String)
    // AFTER: We have to add a middleware to POST route called "upload.array('image')" (LXIX.02.)
    // images: [
        // LXXVI. COMMENTING OUT => MOVE IT TO imageSchema
        // {
        //     url: String,
        //     filename: String
        // }
    // ],
    images: [imageSchema], 
    //                  LXXVIII. WORKING WITH GEOJSON
    // LXXVIII.01. Setting Geo JSON in the model: (NOTE: Changing the location to geometry, see more in Setup.txt to understand)
    // AFTER: We need to store geoData.body.features[0].geometry.coordinates in our POST route controllers/campgrounds.js (LXXVIII.02.)
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    // LV.01. When we save a campground, we take the user id, and save that on the campground, so we add a new field with author:
    // NOTE: This is going to be a reference to User
    // AFTER: We're going to update our seeds/index.js file with author (LV.02.) => We'll need an objectId of a user from mongo db!
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // XXV.04. Adding reviews array: (NOTE: type from prev lesson!)
    // AFTER: We have to require reviews model (XXV.05.)
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] // LXXXVIII.06. We pass in the options: (NOTE: Now our campgrounds should be stringified and have "properties" in it)
    // AFTER: Now we can access that, and use it in our /javasctipts/clusterMap.js (LXXXVIII.07.)
}, opts);

// LXXXVIII.01. We're adding a virtual property to campground: (AFTER: We're nesting it in the schema(LXXXVIII.02.))
// NOTE: This isn't gonna be stored in a db, it's just automatically made for us with a virtual
// LXXXVIII.02. We're passing through "properties.popUpMarkup"
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    // LXXXVIII.03. Testing: (NOTE: Now we have access to 'popUpMarkup' in our templates)
    // AFTER: We're testing it in /campgrounds/index.ejs what do we get back, if we add it there (LXXXVIII.04.)
    // return 'I am popup text';
    // LXXXVIII.09. Connect the text (properties.popUpMakrup) with the virtual: (NOTE: "this" refers to the instinct)
    // NOTE: the <p> includues campground description (the first 20 letters of it!) => That's what we set up there!
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong> 
    <p>${this.description.substring(0, 20)}...</p>`
});

//                  XXXII. DELETE MIDDLEWARE

// XXXII.01. We start it by creating a post middleware on our schema: 
// NOTE: Learn more about 'findOneAndDelete' in mongoose docs or chapter 13!
// EXTRA NOTE: We have acces to the thing that was deleted and we can just pass in as "doc" to our middleware function! 
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    // Testing: (NOTE: if we see this, we know that the function is running )
    // console.log('deleted');
    // Testing: (NOTE: See what we get back if we print out the doc)
    // console.log(doc);
    // XXXII.02. We want to take the reviews we want to delete, and therefore we create a boolean:
    // NOTE: If we find a doc, then we call review.deleteMany() (and we have to make sure we required review! )
    if(doc){
        await Review.deleteMany({ // NOTE: This seems fucked up, but the _id we want to delete is somewhere $in doc.reviews!
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// II.05. We need to export it at the end: (NOTE: We have to pass in the name of our model and the schema)
// AFTER: We need to connect mongoose in app.js (II.06.)
module.exports = mongoose.model('Campground', CampgroundSchema);
