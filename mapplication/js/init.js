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

    new maplibregl.Marker({anchor: 'bottom', element: createImage('signIcon') })
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
 
    new maplibregl.Marker({anchor: 'right', element: createImage('tentIcon') })
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

    new maplibregl.Marker({anchor: 'left', element: createImage('flagIcon') })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    createButtons(3, lat,lng,data["Can you describe any specific location on UCLA's campus that have become significant in the context of Pro-Palestine movements?"]);
}

function createButtons(markerNum, lat,lng,title){
    const buttonId = "button" + title.replace(/\s+/g, '_'); 
    const existingButton = document.getElementById(buttonId);
    if (existingButton) {
        return; // for no duplicate buttons
    }

    const newButton = document.createElement("button");
    newButton.id = buttonId;
    newButton.innerHTML = title;
    newButton.setAttribute("lat", lat);
    newButton.setAttribute("lng", lng);
    newButton.addEventListener('click', function() {
        map.flyTo({
            center: [lng, lat],
            zoom: 20
        });

    });

    // appends to corresponding buttonmap
    document.getElementById("buttonmap").appendChild(newButton);
    //document.getElementById("encampmentbuttons").appendChild(newButton);
    //document.getElementById("protestbuttons").appendChild(newButton);
    //document.getElementById("significantbuttons").appendChild(newButton);
}

function createImage(img) {
    const imgURL = `js/${img}.png`;
    const marker = document.createElement('div');
    marker.style.backgroundImage = `url(${imgURL})`;         // custom markers for map
    marker.style.backgroundSize = 'cover';
    marker.style.width = '50px';
    marker.style.height = '50px';

    marker.addEventListener('mouseenter', function() {
        marker.style.width = '70px';
        marker.style.height = '70px';
    });
    marker.addEventListener('mouseleave', function() {
        marker.style.width = '50px';
        marker.style.height = '50px';
    });

    return marker;
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

var protestbtn = document.getElementById("protestbtn");
var encampmentbtn = document.getElementById("encampmentbtn");
var siglandmarkbtn = document.getElementById("siglandmarkbtn");
var divP = document.getElementById("divP");
var divE = document.getElementById("divE");
var divS = document.getElementById("divS");
protestbtn.addEventListener('click', ()=>{
    divP.style.display='block';
    divE.style.display='none';
    divS.style.display='none';
});
encampmentbtn.addEventListener('click', ()=>{
    divP.style.display='none';
    divE.style.display='block';
    divS.style.display='none';
});
siglandmarkbtn.addEventListener('click', ()=>{
    divP.style.display='none';
    divE.style.display='none';
    divS.style.display='block';
});