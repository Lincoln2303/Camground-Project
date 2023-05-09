//                  III. SEEDING CAMPGROUNDS

// III.01. We have to copy first our mongoose connection and also our campground model:
// const mongoose = require('mongoose');
// const Campground = require('../models/campground');
// III.04. We have to require the array from cities:
// const cities = require('./cities');
// III.11. Requiring our fake descriptors, and places:
// const { descripotrs, places } = require('./seedHelpers');  

// mongoose.connect('mongodb://localhost:27017/yelp-camp');

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("database connected");
// });

// III.12. Creating a function for randomizing:
// const sample = array => array[Math.floor(Math.random() * array.length)];

// III.02. Then we are starting by removing everything from db:
// const seedDB = async () => {
//     await Campground.deleteMany({});
    // const c = new Campground({ title: 'purple field'});
    // await c.save();
    // III.03. We are looping the:
    // AFTER: We have to require the cities array above (III.04.)
    // for (let i = 0; i < 50; i++){
        // III.05. In here we are going to pick a random number:
        // const random1000 = Math.floor(Math.random() * 1000);
        // III.06. Inside we are going to create a new campground, and save it to a variable:
        // const camp = new Campground ({
            // III.07. We add the location from our array with the city and the state:
            // NOTE: The first one is giving us a random city from the array, the second a random state.
            // location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // III.09. Then we want to add a titles/names to those cities: (NOTE: We have to export seedHelpers.js (III.10.))
            // title: `${sample(descripotrs)} ${sample(places)}`
//         }) // III.08. After we've added what we wanted, we can just save it to our db: (NOTE: use "await"!)
//         await camp.save();
//     }
// }
// III.03. We have to execute seedDB:
// seedDB().then(() => {
//     mongoose.connection.close();
// })


//          COLTS VERSION:
// NOTE: If you need an exp, just take a look at the notes above!

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

//                  LXXXVII. CHANGING CLUSTER SIZE AND COLOR

// LXXXVII.01. First we change the number of campgrounds from 50 to 300 in our for loop (NOTE: restart seeds!)
// AFTER: We're just styling, and playing around in clusterMap 

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        // XIII.04. We create a random price:
        // AFTER: We will add the image on the client-side, first in campgrounds/show.ejs (XIII.05.)
        // NOTE: See this section in Setup.txt that explains how it works, if something isn't clear!
        const price = Math.floor(Math.random() * 30 ) + 10;
        const camp = new Campground({
            // LV.02. Adding author: (NOTE: By picking a random objectId from mongo)
            // NOTE: This is going to work as long as we don't delete that account!
            // AFTER: We have to "re-seed" this to update both db, and user interface (we have to run seeds/index.js)
            // NOTE: Check mongo db, if it has added the author for campgrounds!
            // AFTER: We're going to add the author to the show page, and we have to populate it first in campgrounds.js (LV.03.)
            author: '626a7e675350d3423224421e', 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}  ${sample(places)}`,
            // XIII.02. Adding image to the new campground: (by using unsplash collection url)
            // NOTE: This will give us a different image every time when we open campgrounds in browser! 
            // image: 'https://source.unsplash.com/collection/9280841',
            // XIII.03. We also adding description and price: (NOTE: hardcoded for testing)
            description: 'lorem ipsum',
            price,
            // LXXXI.03. We have to add geometry: (NOTE: If we want to avoid validation problems )
            // geometry: {
            //     type: "Point",
            //     coordinates: [-113.1331, 47.0202]
            // },
            // LXXXIV.01. We're updating geometry with the coordinates from our seeds/cities.js file: (NOTE: COMMENT OUT THE OLD)
            geometry: {
                type: "Point",
                // LXXXIV.02. We're going to take the cities data (of that random number), and adding longitude, and after latitude:
                // NOTE: After we should test it, if the map dynamically works with the city location!
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            // LXXI.01. We're fixing images in seeds: (NOTE: Copy-pasting an array of two images in terminal)
            // NOTE: COMMENT OUT THE image (XIII.02) above! We have to run our seeds/index.js file again!
            // AFTER: We to change images in campgrounds/index.ejs (LXXI.02.)
            images: [ // NOTE: We only need url, and filename
                {
                    url: 'https://res.cloudinary.com/dxxk0lqln/image/upload/v1652726512/YelpCamp/qajs07knxqhsqkncvjxl.jpg',
                    filename: 'YelpCamp/qajs07knxqhsqkncvjxl'
                },
                {
                    url: 'https://res.cloudinary.com/dxxk0lqln/image/upload/v1652726513/YelpCamp/fwy8zgk5yiy4ykdptqsi.jpg',
                    filename: 'YelpCamp/fwy8zgk5yiy4ykdptqsi'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})