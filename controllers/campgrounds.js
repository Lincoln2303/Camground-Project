//                  LXI. REFACTORING TO CAMPGROUNDS CONTROLLER

// LXI. NOTE: Here we'll export specific functions

// LXI.04. Requiring Campground model:
// AFTER: We'll do the same process with the logic from new route below (LXI.05.)
const Campground = require('../models/campground');

//                  LXXVII. GEOCODING OUR LOCATIONS

// LXXVII.01. After we have downloaded mapbox-sdk, we have to require it: (NOTE: geocoding is one of their services, there're more)
// AFTER: We need to pass in our token from process.env (from our .env file) (LXXVII.02.)
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// LXXVII.02. Saving the mapbox token to a variable:
const mapBoxToken = process.env.MAPBOX_TOKEN;
// LXXVII.03. And then we're going to pass that through, when we initialize a new mapbox geocoding instance: (NOTE: save it to variable) => And this contains the two methods we want forward and reverse geocode
// NOTE: We pass in our "accessToken" (under the key), and we pass in our token that we just grabbed from process.env
// AFTER: Now we should be able to call the method in createCampground below with geocoder (LXXVII.04.)
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
// LXXV.02. We want to require the cloudinary object (from our cloudinary directory): 
// NOTE: We use a particular method that comes with our cloudinary client we set up
// AFTER: Then in our update route we check to see, if there's any images to delete (LXXV.03.)
const { cloudinary } = require('../cloudinary'); 

// LXI.01. First we export index: (NOTE: We pick the name according to the route)
// AFTER: Then we have to require it in routes/campgrounds.js, and add it to the index route (LXI.02.)
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

// LXI.05. We're moving logic from new route here: (NOTE: And export it right away)
// AFTER: We update new GET route, with this function (LXI.06.) => COMMENT OUT THE OLD!
module.exports.rednerNewForm = (req, res) => {
    res.render('campgrounds/new');
};

// LXI.07. We're moving logic from POST route here, and name it "createCampground":
// AFTER: We update POST route, with this function (LXI.08.) => COMMENT OUT THE OLD!
module.exports.createCampground = async (req, res, next) => {
    // LXXVII.05. Calling geocoder and using forwardGeocode method on it: (NOTE: Save it to a varialbe and await it)
    // NOTE: We have to pass in a query (with name), and a limit(number of results), and we have to send() it, after calling function
    const geoData = await geocoder.forwardGeocode({
        // LXVII.06. We're going to pass in to query our location: (NOTE: That comes from req.body.campground.location)
        query: req.body.campground.location,
        limit: 1
    }).send()
    // LXXVII. Testing:
    // console.log(geoData);
    // console.log(geoData.body.features);
    // res.send(geoData.body.features[0].geometr y.coordinates);
    const campground = new Campground(req.body.campground);
    // LXXVIII.02. We have to store the geodata: (NOTE: By this our model will retrieve the data from form )
    campground.geometry = geoData.body.features[0].geometry;
    // LXIX.03. We're mapping the files we get from req.files: (NOTE: Test it! Make sure everything matches!)
    // NOTE: We're mapping it into an object, take the path and filename, make a new object for each one, and put that into an array 
    // AFTER: We have to comment out Joi.image in schemas.js => ANYWAY IT WON'T WORK!
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    // LXIX.04. Testing: (NOTE: We should be able to see images { url, filename, id }!)
    // AFTER: We have to display it (loop over the images) in our show.ejs (LXIX.05.)
    console.log(campground);
    res.redirect(`/campgrounds/${campground.id}`);
};  
 
// LXI.09. We're moving logic from POST route here, and name it "createCampground":
// AFTER: We update show route, with this function (LXI.10.) => COMMENT OUT THE OLD!
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Campground Not Found');
        return  res.redirect('/campgrounds'); 
    }
    res.render('campgrounds/show', { campground });
};

// LXI.11. We're moving logic from edit GET route here, and name it "renderEditForm":
// AFTER: We update edit GET route, with this function (LXI.12.) => COMMENT OUT THE OLD!
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds'); 
    }
    res.render('campgrounds/edit', { campground });
};

//                  LXXV. DELETING IMAGES BACKEND

// LXXV. We have to make sure we'll delete images both from cloudinary, and mongo db, and images array we start it in edit route!

// LXI.13. We're moving logic from edit GET route here, and name it "updateCampground":
// AFTER: We update edit GET route, with this function (LXI.14.) => COMMENT OUT THE OLD!
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // LXXIV. Testing: 
    // console.log(req.body);
    const campground  = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    // LXXII.06. We have to make a variable: (NOTE: We save the array that we map from req.files)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })); 
    // LXXII.04. Pushing the new images: (NOTE: We have to set multiple in the form input (edit.ejs))
    // NOTE: We can pass and spread (spread operator) the new images => Test it if it works after LXII.06.
    campground.images.push(...imgs);
    // LXXV.02. We only want to use this, if there's deleteImages
    if (req.body.deleteImages){ 
        // LXXV.03. We're looping the images we want to delete: (NOTE: We're deleting this way from cloudinary)
        // NOTE: For each filename we want to call cloudinary.uploader.destroy(), we have to await it
        for (let filename of req.body.deleteImages){
            // LXXV.04. We call this method to delete the image from cloudinary, and pass in the filename
            await cloudinary.uploader.destroy(filename);
        }
        // LXXV.01. Using pull operator to delete from db: (NOTE: We have to await that)
        // NOTE: We want to pull elements from images array, where the filename is in req.body.deleteImages
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages }}}});
        // LXXV. Testing: (NOTE: So far, we're deleting images only from our database by doing this)
        // AFTER: We want to remove those images also from cloudinary, so we have to require it at the top (LXXV.02.)
        console.log(campground);
    } 
    // LXXII.05. We have to save it:  
    // NOTE: There is gonna be at least one change, so we have to await it and save it!
    await campground.save(); 
    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${campground.id}`); 
}

// LXI.15. We're moving logic from edit GET route here, and name it "updateCampground":
// AFTER: We update edit GET route, with this function (LXI.16.) => COMMENT OUT THE OLD!
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted!');
    res.redirect('/campgrounds');
}

