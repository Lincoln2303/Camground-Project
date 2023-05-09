//                  LXII. ADDING A REVIEWS CONTROLLER

// LXII. We do the same process with the reviews route as we did with controllers/campgrounds.js

// LXII.05. We have to require Campground and Review model:
// AFTER: Same process goes for DELETE route below (XLII.06.)
const Campground = require('../models/campground');
const Review = require('../models/review');

// LXII.01 We're moving logic from POST route here from routes/reviews.js, and name it "createReview":
// AFTER: We have to require the file in routes/reviews.js (LXII.02.)
module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id; 
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created New Review '); 
    res.redirect(`/campgrounds/${campground._id}`);
};

// XLII.06. We move logic from DELETE route here, and name it "deleteReview":
// AFTER: We have to require the file in routes/reviews.js (LXII.07.)
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Review Deleted!'); 
    res.redirect(`/campgrounds/${id}`);
};

