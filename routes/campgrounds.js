//                  XXXIII. BREAKING OUT CAMPGROUND ROUTES

// XXXIII.01. We start it by requiring express:
const express = require('express');
// XXXIII.02. Then we require the express router: (NOTE: From previous lecture!)
const router = express.Router();
// LXI.02. Requiring controllers: (NOTE: from controllers/campgrounds.js)
// NOTE: Now we have the campground ojbect, which will have a bunch of method on it.
// AFTER: We're adding the index controller to the index route below (LXI.03.)
const campgrounds = require('../controllers/campgrounds');
// XXXIII.09. Requiring missing pieces: (NOTE: We have to change their path to make it work!)
const catchAsync = require('../utilities/catchAsync');
// const { campgroundSchema } = require('../schemas.js');
// LVIII.06. Requiring validateCampground, and isAuthor middleware:
// AFTER: We have to move  { campgroundSchema } to middleware.js (LVIII.07.) COMMENT IT OUT HERE!
// L.06. Requiring passport authentication middleware: (AFTER: Now we can pass that into new route (L.07.))
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


//                  LXVI. MULTER MIDDLEWARE
// LXVI.01. After we've installed multer, we require it:
const multer = require('multer');

// LXVIII.11. Requiring cloudinary storage: (NOTE: We don't have to specify index, because it's looking for it)
// AFTER: We can pass in storage to multer upload below (LXVIII.12.) - COMMENT OUT THE OLD
const { storage } = require('../cloudinary');

// LXVIII.12.  - COMMENTING OUT - UPDATED BELOW
// LXVI.02. Then we execute it in the following way: (NOTE We pass in the path/destination => This is just for testing)
// const upload = multer({ dest: 'uploads/' });
// LXVIII.12. Passing storage through multer: (NOTE: As a path or destination)
const upload = multer({ storage });

// const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');


//                  LXIII. FANCY WAY OF RESTRUCTURING ROUTES

// LXIII. NOTE: This part is just about structuring better our routes.
 
// LXIII.01. We group routes together, and chain them: (NOTE: To learn more about it, read Setup.txt 08.03.)
// NOTE: We can remove the path from get, and post route - WE COMMENT OUT THE OTHER ROUTES AFTER!
// LXIX.02. We're adding upload.array('image') middleware to post route: (NOTE: 'image' comes from form name attribute!)
// AFTER: We have to go to controllers/campgrounds.js we'll have acces to req.files createCampground route (LXIX.03.)
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

// LXIII.02. We're moving new route here: (NOTE: So we won't break the code, because of :id routes)
router.get('/new', isLoggedIn, campgrounds.rednerNewForm);

// LXIII.03. We're grouping together the :id routes: (NOTE: We can move the path from the routes here too!)
// NOTE: WE COMMENT OUT THE OTHER ROUTES AFTER!
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) // LXXII.02. Adding upload.array('image') middleware: (AFTER: Change edit form)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

// LXIII.04. We move our edit route here: (NOTE: Test it, if it works!)
// AFTER: We group and chain the routes together in routes/users.js (LXIII.05.)
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// LVIII. COMMENT THIS OUT AND MOVE IT TO MIDDLEWARE.JS
// XXXIII.10. We also have to move our "validateCampground" middleware: (NOTE: Comment it out in app.js)
// const validateCampground = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     if (error){
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }


//                  LVIII. AUTHORIZATION MIDDLEWARE

// LVIII. COMMENT THIS OUT AND MOVE IT TO MIDDLEWARE.JS
// LVIII.01. We create a middleware for checking if the author equals to the current user:
// NOTE: If the current user is the author, he can edit the campground
// AFTER: We're going to add it to the edit PUT route (LVIII.02.)
// const isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if(!campground.author.equals(req.user._id)){
//         req.flash('error', 'You do not have permission to do that');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

// XXXIII.08. Now that we have prefixed our routes we can remove '/campgrounds' from the routes and change it to '/':
// AFTER: We're fixing the missing pieces in the file and requiring them (XXXIII.09.)
// XXXIII.03. Now we are going to add our routes to router:
// NOTE: It means that we're moving all of our campground routes here and COMMENT THEM OUT in app  .js!
// XXXIII.04. We changle "app" to "router" for every route:
// AFTER: We export the router at the bottom (XXXIII.05.)

// LXI.03. - COMMENTING OUT THE OLD ONE -
// router.get('/', catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds });
// }));

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXI.03. Adding index route logic: (NOTE: From controllers/campgrounds.js)
// AFTER: We have to require Campground model to controllers/campgrounds.js (LXI.04.)
// router.get('/', catchAsync(campgrounds.index));

// LXI.06. - COMMENT OUT THE OLD - UPDATED BELOW -
//                  L. ISLOGGEDIN MIDDLEWARE

// L.07. Adding isLoggedIn middlware to the route: (AFTER: We'll add it to post route too (L.08.))
// L.01. We're using a helper method (comes from passport):
// NOTE: called "isAuthenticated()" => it's automatically added to the request object itself
// router.get('/new', isLoggedIn, (req, res) => {
    // L.02. We are adding passport method, and create a boolean:
    // if(!req.isAuthenticated()){
        // L.03. If it wasn't authenticated, then we flash a message and redirect: (NOTE: Test, if it works!)
        // AFTER: We're moving this boolean into middleware.js (L.04.) => COMMENT IT OUT HERE!
    //     req.flash('error', 'You must be signed in!');
    //     return res.redirect('/login');
    // }
//     res.render('campgrounds/new');
// });

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXI.06. Updating the new GET route with controller: (NOTE: campgrounds.renderNewForm)
// AFTER: We move the logic from campground POST route to controllers/campgrounds.js (LXI.07.)
// router.get('/new', isLoggedIn, campgrounds.rednerNewForm);

// LXI.08. - COMMENTING OUT OLD - UPDATED BELOW
// L.08. Adding isLoggedIn middleware: (AFTER: We'll add it to edit route too (L.09.))
// router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError(400, 'Invalid Campground Data');
    // const campground = new Campground(req.body.campground);
    // LV.05. We're associating the user to be the author of the campground: (NOTE: user._id on the request object! Test, if it works)
    // campground.author = req.user._id;
    // await campground.save();
    // XXXVII.03. We are adding a flash message:
    // AFTER: We will add a middleware for flash messages to app.js (XXXVII.04. )
//     req.flash('success', 'Successfully made a new campground');  
//     res.redirect(`/campgrounds/${ campground.id }`);
// }));

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXI.08. Updating POST route with controller: (NOTE: campgrounds.createCampground) => Always Test it!
// AFTER: Moving logic from the show route to controllers/campgrounds.js (LXI.09.)
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

//                  LX. MORE AUTHORIZATION

// LX. NOTE: We want to associate reviews with a user id. We have to populate the review's author!

// LXI.10. - COMMENTING OUT OLD - UPDATED BELOW
// router.get('/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
    // LV.03. We're populating the author of the campground too:
    // NOTE: That should give us the author, and not only the objectId. Now this campground has automatically access to the username under the key of 'author.username'
    // AFTER: We'll add author to our show.ejs (LV.04.)
    // LX.01. We're populating the reviews author: (NOTE: We do that by adding a path for 'reviews' and the 'author')
    // AFTER: Now we can render it in show.ejs (LX.02.) 
    // const campground = await Campground.findById(id).populate({
    //     path:'reviews',
    //     populate: { // NOTE: We're populating the author in the review => called   "nested populate"
    //         path: 'author' // NOTE: Test it in the REPL, if you can see author on reviews  !
    //     }
    // }).populate('author');
    // LV.04. Testing: (NOTE: to see, if we get back the author of the campground!)
    // console.log(campground);
    // XXXIX.02. Adding error flash message: (NOTE: In case, if we didn't find any campground)
    // if(!campground){
    //     req.flash('error', 'Campground Not Found');
        // XXXIX.03. After we have to redirect to index: (NOTE: Plus we have to return that)
        // AFTER: We do the same thing with edit (XXXIX.04.)
//         return  res.redirect('/campgrounds'); 
//     } // NOTE: Otherwise, we just render campground show page:
//     res.render('campgrounds/show', { campground });
// }));

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXI.10. Updating show route with controller: (NOTE: campgrounds.showCampground) => Always Test it!
// AFTER: Same process goes on with the edit GET route in controllers/campgrounds.js (LXI.11.)
// router.get('/:id', catchAsync(campgrounds.showCampground));

// LXI.12. - COMMENTING OUT OLD - UPDATED BELOW
// LVIII.03. Adding "isAuthor" middleware: (AFTER: Same thing with DELETE route (LVIII.04.))
// L.09. Adding isLoggedIn middleware here: (AFTER: Same thing for the put and delete route (L.10.))
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if(!campground){
//         req.flash('error', 'Campground Not Found');
//         return res.redirect('/campgrounds'); 
//     }
//     res.render('campgrounds/edit', { campground });
// }));

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXI.12. Updating show route with controller: (NOTE: campgrounds.renderEditForm) => Always Test it!
// AFTER: Same process goes on with the edit PUT route in controllers/campgrounds.js (LXI.13.)
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//                  LVII. CAMPGROUND PERMISSIONS

// LXI.12. - COMMENTING OUT OLD - UPDATED BELOW

// LVII.01. We have to make sure from the server side that campground has the same author id as the current user

// LVIII.02. Adding "isAuthor" middleware: (NOTE: Check it, if it works!)
// AFTER: We add it to our edit GET route too (LVIII.03.)
// L.10. Adding isLoggedIn middleware:
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
//     const { id } = req.params;
    // LVII.02. Testing: (NOTE: by adding a conditional to secure the campground from server-side)
    // NOTE: First we'll need the campground id, then we check, if the author is matching with the current user
    // AFTER: In the next section we're going to move this to it's own middleware and add it to our other routes (section LVIII.)
    // LVIII. COMMENT THIS OUT, AND MOVE IT TO A MIDDLEWARE (LVIII.01.)
    // const campground = await Campground.findById(id);
    // if(!campground.author.equals(req.user._id)) {
    //     req.flash('error', 'You do not have permission to do that!');
    //     return res.redirect(`/campgrounds/${id}`);
    // } 
    // const campground  = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    // XXXVIII.06. We add a flash massage: (NOTE: In case of successful update)
    // AFTER: Same thing goes for reviews.js (XXXVIII.07.)
//     req.flash('success', 'Successfully Updated Campground!');
//     res.redirect(`/campgrounds/${campground.id}`); 
// }));

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXI.14. Updating edit PUT route with controller: (NOTE: campgrounds.updateCampground) => Always Test it!
// AFTER: Same process goes on with the DELETE route in controllers/campgrounds.js (LXI.15.)
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// LXI.16. - COMMENTING OUT OLD - UPDATED BELOW

// LVIII.04. Adding "isAuthor" middleware:
// AFTER: We're moving the middlewares to middleware.js (LVIII.05.)
// L.10. Adding isLoggedIn middleware:
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
    // XXXVIII.08. Flash message after deleting campground:
//     req.flash('success', 'Campground Deleted!');
//     res.redirect('/campgrounds');
// }));

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXI.16. Updating DELETE route, with controller: (NOTE: campgrounds.deleteCampground) => Always Test it!
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// XXXIII.05. Exporting the router: (NOTE: We will definitely face some issues, since we have to require some things!)
// AFTER: We are requiring  the router in app.js (XXXIII.06.)
module.exports = router; 

