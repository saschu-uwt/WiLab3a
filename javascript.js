var map = L.map('map').setView([47.25, -122.46], 12);
L.tileLayer('https://api.mapbox.com/styles/v1/saschu/ckl493xxy35s017qmc8gf09ei/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FzY2h1IiwiYSI6ImNrZ3poNGVkYjA1b3Ayd3JzOHczb29iNjEifQ.MqXTIcUhZl4C-s0Jk5o49A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
}).addTo(map);

// mapbox://styles/saschu/ckl493xxy35s017qmc8gf09ei
// https://api.mapbox.com/styles/v1/saschu/ckl493xxy35s017qmc8gf09ei/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FzY2h1IiwiYSI6ImNrZ3poNGVkYjA1b3Ayd3JzOHczb29iNjEifQ.MqXTIcUhZl4C-s0Jk5o49A


// Makes the layer (feature group) to draw to
var drawnItems = L.featureGroup().addTo(map);

// Makes the drawing tools
new L.Control.Draw({
    draw : {
        polygon : true,
        polyline : false,
        rectangle : false,     // Rectangles disabled
        circle : false,        // Circles disabled
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);

// Add an HTML form that is also a popup
function createFormPopup() {
    var popupContent =
        '<form>' +
        'Title:<br><input type="text" id="input_title" value="Joe\'s Triangle"><br>' +
        'Description:<br><input type="text" id="input_desc" value="A stand of apple trees"><br><br>' +
        '<input type="button" value="Submit" id="submit">' +
        '</form>'
    drawnItems.bindPopup(popupContent).openPopup();
}

// Event listner that adds items drawn to the drawnItems layer so they don't immediately disappear. It also fires the HTML form popup from above.
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});

// Print data to the console
function setData(e) {

    if(e.target && e.target.id == "submit") {

        // Get user name and description
        var enteredUsername = document.getElementById("input_title").value;
        var enteredDescription = document.getElementById("input_desc").value;

        // Print user name and description
        console.log(enteredUsername);
        console.log(enteredDescription);

        // Get and print GeoJSON for each drawn layer
        drawnItems.eachLayer(function(layer) {
            var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            console.log(drawing);
        });

        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();

    }
}

// Makes the setData function run
document.addEventListener("click", setData);

// Makes the popup HTML form go away when the user is editing the shape/line/point. Once the user is happy with their drawing, the popup will reappear.
map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});
