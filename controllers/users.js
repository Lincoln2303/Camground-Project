// LXII. We do the same process with the reviews route as we did with reviews, and campgrounds
const User = require('../models/user');

// LXII.08. We're moving logic from GET route here from routes/users.js, and name it "renderRegister":
// AFTER: We have to require the file in routes/users.js (LXII.09.)
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

// LXII.11. We're moving logic from register POST route here from routes/users.js, and name it "register":
// AFTER: We update the register POST route with this function (LXII.12.)
module.exports.register = async (req, res, next ) => {
    try {
        const { email, username, password } = req.body;
        const user =  new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp');
            res.redirect('/campgrounds');
         });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

// LXII.13. We're moving logic from login GET route here from routes/users.js, and name it "renderLogin":
// AFTER: We update the login GET route with this function (LXII.14.)
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

// LXII.15. We're moving logic from login GET route here from routes/users.js, and name it "login":
// AFTER: We update the login GET route with this function (LXII.16.)
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome to YelpCamp');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

// LXII.17. We're moving logic from logout GET route here from routes/users.js, and name it "logout":
// AFTER: We update the logout GET route with this function (LXII.18.)
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye Friend'); 
    res.redirect('/campgrounds'); 
}


