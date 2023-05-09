//                  XXV. DEFINING THE REVIEW MODEL

// XXV.01. We follow the same model structure that we've made before (campground.js)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//                  LIX. REVIEWS PERMISSION

// XXV.02. We create our schema: (NOTE: "body" is the textarea)
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    // LIX.01. We add in a new fiels "author":
    author: {
        // LIX.02. Type is the objectId, and we have to add reference (the User model):
        // AFTER: We require isLoggedIn to reviews.js (LIX.03.) => check the routes, if someone is logged in they can see the form!
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// XXV.03. We can create a model and export it right away:
// AFTER: Next step is that we are going to connect the review with the campground model (XXV.04.)
// NOTE: We have to update our schemas after!
module.exports = mongoose.model('Review', reviewSchema);


 
