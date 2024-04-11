// Creating the map object
let myMap = L.map("map", {
    center: [37.6, -97.3],
    setView: ([37.6, -97.3], 7),
    zoom: 5
});


  // let myMap = L.map("map", {
  //   setView: [37.6, -97.3],
  //   zoom: 5
  // });

  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Store the API query variables.
  let baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  
  // Assemble the API query URL.
  let url = baseURL;
  
  // Get the data with d3.
  d3.json(url).then(function(response) {

    features = response.features;
    let marker_limit = features.length;
    
    for (let i = 0; i < marker_limit; i++) {
      //data markers should reflect
      //  magnitude of the earthquake by their size and debth of the earthquake by color.
      //  earthquakes with higher magnitude should appear larger
      //  earthquakes with greater depth should appear darker


      //used by color and legend functions to define data breaks
      var breaks = [9,29,49,69,89,100,1000];
      var labels = ['-10-10', '10-30', '30-50', '50-70','70-90','90+'];

      
      let location = features[i].geometry;
      opacity = (location.coordinates[2] * .25) * .25
      radius = (features[i].properties.mag * (features[i].properties.mag + 2))
      color = getColor(location.coordinates[2],breaks)

      if(location){
      L.circleMarker([location.coordinates[1], location.coordinates[0]], {radius: radius})
        .setStyle({color: color, fillColor: color, opacity: location.coordinates[2] , fillOpacity: opacity})
        .bindPopup("<h3>Info: " + features[i].properties.title + 
          "<h3>Magnitude: " + features[i].properties.mag + 
          "<h3>Latitude: " + location.coordinates[1] + 
          "<h3>Longitude: " + location.coordinates[0] +
          "<h3>Depth: " + location.coordinates[2] +
          "<h3>Time: " + features[i].properties.time + "</h3>")
          .addTo(myMap);
      }                   
    }

    //No error but I can't get legend to actually show up on the map

    var legend = L.control({position: 'bottomright'});
       
    legend.onAdd = function (myMap) {
    
      var div = L.DomUtil.create('div', 'info legend');

      //loop through items and generate legend
      for (var i = 0; i < breaks.length; i++) {
        div.innterHTML +=
        '<i style="background:' + getColor(breaks[i], breaks) + ' "></i> ' +
        labels[i] + (breaks ? ' ' + '<br>' : '');

        }
        return div;
      };

    legend.addTo(myMap);
    }
  )
  
  //set color of marker function
function getColor(d, breaks) {
  return d <= breaks[0] ? '#7fcdbb' : // < 10
    d <= breaks[1] ? "#41b6c4" :  // < 30
    d <= breaks[2] ? "#1d91c0" :  // < 50
    d <= breaks[3] ? "#225ea8" :  // < 70
    d <= breaks[4] ? "#253494" : // < 90
    "#081d58";  //> 90
 }
 
 
 ;