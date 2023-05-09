//                  XXXIV. BREAKING OUT REVIEW ROUTES

// XXXIV.02. Just like with in campgrounds.js we have to require express and express route:
// NOTE: After we have to change "app" to "route" AFTER: We export it (XXXIV.03.)
const express = require('express');
// NOTE: We have to add mergeParams, so the params can be merged now, and there won't be id problem! 
const router = express.Router({ mergeParams: true });
// XXXIV.06. Adding missing pieces:
const Review = require('../models/review');
const Campground = require('../models/campground');
// LXII.02. We have to require our controller for reviews: (NOTE: Now we can export them on reviews!)
// AFTER: Updating the POST route below (XLII.03.)
const reviews = require('../controllers/reviews');

// LX.10. Requiring isReviewAuthor middleware: (AFTER: Add it to DELETE route (LX.11.))
// LIX.03. Requiring isLoggedIn middleware: (AFTER: We add to the POST route (LIX.04.))
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// LVIII. We can COMMENT OUT reviewSchema here:
// const { reviewSchema } = require('../schemas.js');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// LVIII.08. Move this to middleware.js - COMMENT IT OUT HERE -
// XXXIV.07. We also have to add validateReview middleware: (NOTE: COMMENT OUT in app.js)
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error){
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

// LXIII.03. - COMMENT OUT THE OLD ROUTE - UPDATED BELOW - 

// LIX.04. Adding isLoggedIn middleware: (AFTER: In our route we set the review.author LIX.05.)
// NOTE: Express Router likes to keep params separataly, so we have to add { mergeParams: true } in router
// XXXIV.01. We're moving our review routes here: (NOTE: COMMENT IT OUT in app.js)
// NOTE: Changing "app" to "route", plus remove prefix from routes ('/campgrounds/:id/reviews' )
// router.post('/', isLoggedIn,  validateReview, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     const review = new Review(req.body.review);
    // LIX.05. Setting the author of the review equals to the user id on the request object: (NOTE: Test if we can see it in mongo!)
    // review.author = req.user._id; 
    // campground.reviews.push(review);
    // await review.save();
    // await campground.save();
    // XXXVIII.07. Adding flash message: (NOTE: Don't forget to test it!)
    // AFTER: Same thing when we delete review, plus campground (XXXVIII.08.)
//     req.flash('success', 'Created New Review '); 
//     res.redirect(`/campgrounds/${campground._id}`);
// }));

// LXII.03. Updating the POST route with controller: (NOTE: reviews.createReview) => Test it!
// AFTER: We have to require Campground and Review model (to make it work) in the reviews controller (LXII.04.)
router.post('/', isLoggedIn,  validateReview, catchAsync(reviews.createReview));

// LXIII.03. - COMMENT OUT THE OLD ROUTE - UPDATED BELOW - 

// LX.11. Adding isReviewAuthor middleware: (NOTE: Test it (by commenting out conditional on reviews delete button))
// LX.05. We have to protect delete route: (NOTE: We have to check, if you logged in, and you own the review )
// NOTE: We're adding isLoggedIn middleware
// AFTER: We write a middleware "isReviewAuthor", in middleware.js (LX.06.)
// router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Review.findByIdAndDelete(reviewId);
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // XXXVIII.08. Flash message after deleting review: (NOTE: Same thing with campground.delete())
//     req.flash('success', 'Review Deleted!'); 
//     res.redirect(`/campgrounds/${id}`);
// }));

// LXII.07. Updating the DELETE route with controller: (NOTE: reviews.deleteReview) => Test it!
// AFTER: We're also creating a controller for users, controllers/users.js (XLII.08.)
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// XXXIV.03. Exporting the routes:
// AFTER: We have to require it in app.js and prefix in app.use '/campgrounds/:id/reviews' (XXXIV.04.)
module.exports = router;


