// LXXIX.04. Moving Mapbox script here: (NOTE: from show.ejs)
// AFTER: We need to make sure we require the file (only on the show page!), so we include <script> tag in show.ejs (LXXIX.05.)

mapboxgl.accessToken = mapToken;

// LXXIX.08. Adding mapToken variable with the token access from show.ejs:
// mapboxgl.accessToken = mapToken ;
// const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'map box://styles/mapbox/streets-v11', //stylesheet location
    // centre: [-74.5, 40], // starting position [lng, lat]
    // LXXX.03. Setting the center to be equal to the coordinates: (AFTER: We add it to the Marker() too (LXXX.04.))
//     center: campground.geometry.coordinates, 
//     room: 9 // starting zoom
// });

//                  LXXX. CENTERING THE MAP ON CAMPGROUND

// LXXX.01. We're adding a pin to our map: (NOTE: from Mapbox DOCS)
// NOTE: for setLngLat we set the same points as above in the centre, and for the addTo, we match with the container above!
// AFTER: We have to set a new script for fixing our page in show.ejs (LXXX.02.)
//new mapboxgl.Marker()
    // .setLngLat([-74.5, 40])
    // LXXX.04. Setting the longitude, and latitude to be equal to the locations coordinates:
    // .setLngLat(campground.geometry.coordinates)
    // .addTo(map)
 

//      ** COLT'S CODE **

// const goodCampground = JSON.parse(campground);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// XCIV.02. Adding map control: (NOTE: copy the code from clusterMap.js)
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left'); 

//                  LXXXII. CUSTOMIZING MAP POPUP

// LXXXII. NOTE: We add a method (from Mapbox DOCS) called ".setPopup()", and inside we have to pass in a new mapboxgl.Popup()

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    // LXXXII.01. Adding .setPopup method: (NOTE: from Mapbox DOCS)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                // LXXXII.02. If we click on the marker the location and the name should pop up: (NOTE: Test it!)
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)

