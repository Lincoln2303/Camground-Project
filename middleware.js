// LVIII.09. Requiring reviewSchema too!
// LVIII.07. We have to require { campgroundSchema }, ExpressError, Campground here to make the codes work!
// NOTE: Test it, if it works!
// AFTER: We add "validateReview" middleware below, and comment it out in reviews.js (LVIII.08.)
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');
// LX.09. Requiring the review model: (AFTER: We have to add require isReviewAuthor middleware in routes/reviews.js(LX.10.))
const Review = require('./models/review');


// L.04. We're moving here our passport authenticate middleware: (NOTE: Export it right away!)
// AFTER: We have to require this in campgrounds.js (L.06.)
module.exports.isLoggedIn = (req, res, next) => {
    // LII.01. Testing and printing out req.user: (NOTE: This is coming from passport, read Setup.txt (06.09. ))
    // AFTER: We are going to set it in app.js, and app.use() (LII.02.)
    // console.log('req.user:', req.user);
    if(!req.isAuthenticated()){
        // LIII.01. We have to redirect the user to the page that he was visited instead of always campgrounds: (NOTE: Testing)
        // NOTE: We have two things we could use (req.path, req.originalUrl) => both added to the request object
        // console.log(req.path, req.originalUrl);
        // LIII.02. We're using req.originalUrl, and put it into a session:
        // AFTER: In our app.js, we can print out the entire session for testing (LIII.03.) => app.use()
        req.session.returnTo = req.originalUrl;  
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    // L.05. If there wasn't any authentication problem, we call next(): 
    next();
};

// LVIII.05. Moving "validateCampground", and "isAuthor" middleware here:
// NOTE: Export them right away!
// AFTER: We have to require them in campgrounds.js (put it together with isLoggedIn) (LVIII.06.)
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

// LVIII.08. Moving validateReview middleware here: (NOTE: Export it right away!)
// AFTER: We have to require reviewSchema to make this work (LVIII.09.)
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

// LX.06. We're checking if the the currentUser is the author of the review:
module.exports.isReviewAuthor = async (req, res, next) => {
    // LX.07. We change the id to the review's id: (NOTE: It comes from '/:reviewId')
    // NOTE: We have to leave the id too => the review comes from /campgrounds/:id/reviews/:reviewId
    const { id, reviewId } = req.params;
    // LX.08. We have to look up for the review: (NOTE: And passing in the reviewId )
    // AFTER: We have to require Review model at the top to make it work (LX.09.)
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};


