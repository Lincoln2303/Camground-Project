//                  XLII. REGISTER FORM

// XLII.01. First we add express and a router:
const express = require('express');
const router = express.Router();
// XLIX.06. Requiring passport: (NOTE: To make authentication work in login post route!)
const passport = require('passport');
// LXII.09. Requiring our users controller: (AFTER: We add controller to register GET route (LXII.10.))
const users = require('../controllers/users');
// XLIII.04. Requiring catchAsync: (NOTE: For async errors) (AFTER: We wrap that around post route (XLIII.05.))
const catchAsync = require('../utilities/catchAsync'); 
// XLII.02. We also have to require the user:
const User = require('../models/user');

// LXIII.05. Grouping and chaining routes (with the same path): (NOTE: Starting with /register)
// NOTE: Remove path from routes - COMMENT OUT THE OLD ROUTES -
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

// LXIII.05. Grouping and chaining login routes:
// NOTE: Remove path from routes - COMMENT OUT THE OLD ROUTES -
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// LXIII.07. We're just moving logout route here:
router.get('/logout', users.logout);

// LXII.10. - COMMENTING OUT OLD ROUTE - UPDATED BELOW - 

// XLII.04. Now we can start to create our routes:
// router.get('/register', (req, res) => {
    // XLII.05. Here we are going to render the form for registering:
    // AFTER: We have to make a template for the form, in views/users/register.ejs (XLII.06)
//     res.render('users/register');
// });

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXII.10. Updating the register GET route with controller: (NOTE: users.renderRegister) => Test it!
// AFTER: Same process goes for register POST route (XLII.11.)
// router.get('/register', users.renderRegister);

// LXII.12. - COMMENTING OUT OLD ROUTE - UPDATED BELOW - 

//                  XLIII. REGISTER ROUTE LOGIC 

// XLIII.05. Wrapping the route with catchAsync: (NOTE: This will take any issues and errors)
// XLII.08. Setting up POST route:
// router.post('/register', catchAsync( async (req, res, next ) => {
    // Testing: (NOTE: Make sure, we get everything what we expect!)
    // NOTE: In next section (section XLIII.) we write the logic to register the user! 
    // res.send(req.body);
    // XLIII.06. We add a try and catch to handle error: (NOTE: catch (e) has a message property on it)
    // try {
        // XLIII.02. We're destructuring what we want from req.body:
        // const { email, username, password } = req.body;
        // XLIII.01. We're taking the form data and create a new user:
        // NOTE: We only pass in email, and username
        // const user =  new User({ email, username });
        // XLIII.03. Then we have to call User.register(): (NOTE: It creates the new user, plus hashing and salting password) 
        // AFTER: Couple of things can go wrong, so we require catchAsync at the top (XLIII.04.), and add it to the route!
        // const registeredUser = await User.register(user, password);
        // LIII.01. Adding req.login passport method, and pass in the registeredUser: (NOTE: Test if it works, and keeps logged in)
        // NOTE: It requires a callback, which is an err parameter, and if there's an error we return it with next (but it's impossible, but we have to do it) => add next() to the route parameters
        // req.login(registeredUser, err => {
        //     if(err) return next(err);
            // Testing: (NOTE: Remember to specify key 'sussess' for flash)
            // console.log(registeredUser);
//             req.flash('success', 'Welcome to Yelpcamp');
//             res.redirect('/campgrounds');
//          });
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('register');
//     }
// }));

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXII.12. Updating the register POST route with controller: (NOTE: users.renderRegister) => Test it!
// AFTER: Same process goes for login GET route (XLII.13.)
// router.post('/register', catchAsync(users.register));

//                  XLIX. LOGIN ROUTES

// LXII.14. - COMMENTING OUT OLD ROUTE - UPDATED BELOW - 

// XLIX.01. We create our get route for login: (NOTE: This will just render, and serve the form)
// router.get('/login', (req, res) => {
    // Testing:
    // res.send('It works');
    // XLIX.02. We are rendering login form:
    // AFTER: We have to make the template too, views/users/login.ejs (XLIX.03.)
    // res.render('users/login');
// });

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXII.14. Updating the login GET route with controller: (NOTE: users.renderLogin) => Test it!
// AFTER: Same process goes for login POST route (XLII.15.)
// router.get('/login', users.renderLogin);

// LXII.16. - COMMENTING OUT OLD ROUTE - UPDATED BELOW -

// XLIX.04. Creating post route for login: (NOTE: We are adding passport middleware)
// NOTE: Passport gives us a middleware we can use "passport.authenticate()" => Read more in Setup.txt (06.06. Login Routes)
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    // XLIX.05. If someone successfully logged in we flash a message and redirect the user to campgrounds:
    // AFTER: Don't forget to require passport too at the top (XLIX.06.)
    // req.flash('success', 'Welcome to YelpCamp');
    // LIII.04. Saving a page to returnTo, when the user has to login: (NOTE: either last page or /campgrounds)
    // NOTE: We add /campgrounds in case , if someone instantly wants to log in!
    // const redirectUrl = req.session.returnTo || '/campgrounds';
    // LIII.06. After we redirect the user we use the following method:
    // delete req.session.returnTo;
    // LIII.05. Passing redirectUrl to res.redirect(): (NOTE: Comment out the old!)
    // res.redirect('/campgrounds');
//     res.redirect(redirectUrl);
// });

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXII.16. Updating the login POST route with controller: (NOTE: users.login) => Test it!
// AFTER: Same process goes for logout GET route (XLII.17.)
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

//                  LI. ADDING LOGOUT

// LXII.18. - COMMENTING OUT OLD ROUTE - UPDATED BELOW -

// LI.01. We start by creating a logout route:
// NOTE: Passport adds a method to the request object, simply called "logout()", that we can use
// router.get('/logout', (req, res) => {
    // LI.02. Adding req.logout(), flashing a message, and redirecting to campgrounds: (NOTE: Test, if it works.)
    // AFTER: We'll add login, register, and logout to navbar, in navbar.ejs (LI.03.)
//     req.logout();
//     req.flash('success', 'Goodbye Friend'); 
//     res.redirect('/campgrounds'); 
// });

// LXIII. COMMENTING OUT - UPDATED VERSION ABOVE - router.route()

// LXII.18. Updating the logout GET route with controller: (NOTE: users.logout) => Test it!
// router.get('/logout', users.logout);

// XLII.03. Then we export the router:
module.exports = router; 
