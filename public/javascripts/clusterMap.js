// LXXXIII.02. Copy-pasting the javascript for cluster map: (NOTE: From Mapbox DOCS)
// AFTER: We have to include the script to index.ejs (LXXXIII.03.)
// LXXXIII.05. Adding our access key token (mapToken from index.ejs) to mapboxgl.accessToken:
// NOTE: If the token changes, it will be updated in all our scripts
// EXTRA-NOTE: Check the console (in browser) occassionally, if it shows any error message (we're good so far!)
// AFTER: In next lecture we're going to reseed db, and connect it with the map (section LXXXIV.)
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    // XCIII.04. Changing container to be "cluster-map"
    container: 'cluster-map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-103.5917, 40.6699],
    zoom: 3
});

//                  CXIV. ADDING MAP CONTROLS

// CXIV.01. In Mapbox DOCS we can find additional features (with zoom in, zoom out) that we're just going to add:
// NOTE: Test it if you can see it! => by adding 'bottom-left' it'll be positioned there.
// AFTER: We duplicate it, and add it to showPageMap.js too! (CXIV.02.)
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left'); 

//                  LXXXV. BASIC CLUSTERING CAMPGROUND

// LXXXV. NOTE: We want to connect our cluster map with the campgrounds. The accessToken above just gives us the regular map, so we'll start to add codes below

// LXXXV.01. We want to include our data: (NOTE: Look for the code where do they include data)

// NOTE: map has a method "map.on()", and we can call eventlistener on that method. Test it, by printing out what do we get back!
map.on('load', () => {
// LXXXV. Testing: (NOTE: We're pinting out, when we've loaded the map) => This is a good way to discover which codes run, and when! 
// console.log('map loaded');
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
//                  LXXXVI. TWEAKING CLUSTER CODE
// LXXXVI. NOTE: For map.addSoucre() we pass in a label (a name for a source), and we're referring that. => We can have multiple later on
// LXXXVI.01. We're adding source 'campgrounds': (AFTER: We have to change the other sources to 'camgprounds', anyway won't work (LXXXVI.02.))
    map.addSource('campgrounds', {
        type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
// LXXXV.02. We pass through campgrounds here: (NOTE: We can refer to campgrounds that way!)
// AFTER: To make this work, we have to include campgrounds to our script and do JSON.stringify(); (LXXXV.03. )
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
 
    map.addLayer({
        id: 'clusters',
        type: 'circle',
// LXXXVI.02. Adding source 'campgrounds':
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#548ed6',
                // 100,
                20,
                '#34ebb7',
                // 750,
                30,
                '#8034eb'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                10,
                20,
                30,
                25
            ]
        }
    });
 
// LXXXVI. NOTE: map.addLayer includes extras (e.g. style of the cluster, text-size etc.  )
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
// LXXXVI.02. Adding source 'campgrounds':
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
 
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
// LXXXVI.02. Adding source 'campgrounds':
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
 
// inspect a cluster on click
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
// LXXXVI.02. Changing getSource() to 'campgrounds' too:
    map.getSource('campgrounds').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
            if (err) return;
 
        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
        });
        }
    );
    });
 
// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', (e) =>  {
// LXXXV. Testing: (NOTE: We're printing out, when we've clicked on unclustered part of the map )
// console.log('clicked on unclustered part of the map');
// LXXXVIII. Testing: (NOTE: See what we get back, if we print out "e.features[0]")
// NOTE: In the browsers console when we click, we get back an object, where we have properties, and geometry we can use. => We're going to use codes from Mapbox DOCS (they're expecting to follow a pattern). We don't have properties on our campground object yet (and we need that information)
// AFTER: We're going to handle this by adding a virtual property to models/campground.js (LXXXVIII.01.) 
// console.log(e.features[0]); 
// LXXXVIII. Testing: (NOTE: We're going to use this, and save it)
// console.log(e.features[0].properties.popUpMarkup);
// LXXXVIII.07. Saving the properties.popUpMarkup to a variable:
// AFTER: We can pass that to mapboxgl.Popup() (LXXXVIII.08.)
    const { popUpMarkup } = e.features[0].properties.popUpMarkup; 
    const coordinates = e.features[0].geometry.coordinates.slice();
// LXXXVIII. NOTE: WE CAN COMMENT OUT THE CODES BELOW (We only need the cordinates)
// const mag = e.fea  perties.tsunami === 1 ? 'yes' : 'no';
 
// Ensure that if the map is zoomed out such that
// multiple copies of the feature are visible, the
// popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

//                  LXXXVIII. ADDING CUSTOM POPUPS

// LXXXVIII. NOTE: We're changing the default mapboxgl.Popup() below, and update it with our code (so we'll see the campgrounds title and location pop up, and we can redirect to the show page by clicking) => First we test above by printing out "e.features[0]"
// EXTRA NOTE: We need to have a campground id?

    new mapboxgl.Popup()
        .setLngLat(coordinates)
    // LXXXVIII.08. We're passing in the { popUpMarkup }:
    // AFTER: We'll connect it to our model virtual (LXXXVIII.09.)
        .setHTML(popUpMarkup)
        .addTo(map);
    });
 
    map.on('mouseenter', 'clusters', () => {
// LXXXV. Testing: (NOTE: We're pinting out, when we're moving the cursor over a cluster)
// console.log('mousing over a cluster');
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });

}); 



