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

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30 ) + 10;
        const camp = new Campground({
            author: '626a7e675350d3423224421e', 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}  ${sample(places)}`,
            description: 'lorem ipsum',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
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