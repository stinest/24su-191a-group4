// declare variables
let mapOptions = {'centerLngLat': [-118.444,34.0709],'startingZoomLevel':15}

const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/landscape/style.json?key=dZ59VPBA7A1UHvaquwWJ',
    center: mapOptions.centerLngLat,
    zoom: mapOptions.startingZoomLevel
});

function addMarker1(data){
    let popup_message;
    let lng = data['lng1'];
    let lat = data['lat1'];
    popup_message = `<h2>Protest Site</h2> <h3>Location: ${data['Could you best specify the location where you were present?']}</h3>`

    var signIcon = document.createElement('div');
    signIcon.classList.add("sign")

    new maplibregl.Marker(signIcon, {
        anchor: 'bottom',
        offset: [0, 6]
    })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    createButtons(1, lat,lng,data['Could you best specify the location where you were present?']);
}

function addMarker2(data){
    let popup_message;
    let lng = data['lng2'];
    let lat = data['lat2'];
    popup_message = `<h2>Encampment Site</h2> <h3>Location: ${data['If involved at any encampments related to the Pro-Palestine movement, could you best specify the location where you were present?']}</h3>`

    new maplibregl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    createButtons(2, lat,lng,data['If involved at any encampments related to the Pro-Palestine movement, could you best specify the location where you were present?']);
}

function addMarker3(data){
    let popup_message;
    let lng = data['lng3'];
    let lat = data['lat3'];
    popup_message = `<h2>Significant Landmark</h2> <h3>Location: ${data["Can you describe any specific location on UCLA's campus that have become significant in the context of Pro-Palestine movements?"]}</h3>`

    new maplibregl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    createButtons(3, lat,lng,data["Can you describe any specific location on UCLA's campus that have become significant in the context of Pro-Palestine movements?"]);
}

function createButtons(markerNum, lat,lng,title){
    const buttonId = "button" + title.replace(/\s+/g, '_'); // Replace spaces with underscores
    const existingButton = document.getElementById(buttonId);
    if (existingButton) {
        console.log("Button with this title already exists:", title); // For debugging
        return; // Exit the function if the button already exists
    }

    const newButton = document.createElement("button");
    newButton.id = buttonId;
    newButton.innerHTML = title;
    newButton.setAttribute("lat", lat);
    newButton.setAttribute("lng", lng);
    newButton.addEventListener('click', function() {
        map.flyTo({
            center: [lng, lat],
        });
    });

    // Append the new button to the 'contents' element
    document.getElementById("buttonmap").appendChild(newButton);
}

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPNJwVJXo0yXNrpejSqaLoJmkjabEdnKbI47-VEL-WX7FUofONme430LdJLNV9ZTTPftO1_HNXJJdt/pub?output=csv"

// When the map is fully loaded, start adding GeoJSON data
map.on('load', function() {
    // Use PapaParse to fetch and parse the CSV data from a Google Forms spreadsheet URL
    Papa.parse(dataUrl, {
        download: true, // Tells PapaParse to fetch the CSV data from the URL
        header: true, // Assumes the first row of your CSV are column headers
        complete: function(results) {
            // Process the parsed data
            processData(results.data); // Use a new function to handle CSV data
        }
    });
});

function processData(results){
    console.log(results) //for debugging: this can help us see if the results are what we want
    results.forEach(feature => {
        //console.log(feature) // for debugging: are we seeing each feature correctly?
        // assumes your geojson has a "title" and "message" attribute
        // let coordinates = feature.geometry.coordinates;
        if (feature['Are you comfortable with sharing your story?'] == "Yes") {
            if (feature['lat1'] != "0")
                addMarker1(feature);
            if (feature['lat2'] != "0")
                addMarker2(feature);
            if (feature['lat3'] != "0")
                addMarker3(feature);
        }
    });
};