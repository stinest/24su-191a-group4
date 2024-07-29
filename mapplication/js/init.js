// declare variables
let mapOptions = {'centerLngLat': [-118.444,34.0709],'startingZoomLevel':15}

const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/landscape/style.json?key=dZ59VPBA7A1UHvaquwWJ',
    center: mapOptions.centerLngLat,
    zoom: mapOptions.startingZoomLevel
});

let markers = {
    encampment: [],
    protest: [],
    significant: []
};

const uniqueEncampmentLocations = new Set();
const uniqueProtestLocations = new Set();
const uniqueSignificantLocations = new Set();

function addMarker1(data){
    let lng = data['lng1'];
    let lat = data['lat1'];
    let locationKey = `${lng},${lat}`;

    if (!uniqueProtestLocations.has(locationKey)) {
        uniqueProtestLocations.add(locationKey);

        let popup_message = `<h2>Protest Site</h2> <h3>Location: ${data['Could you best specify the location where you were present?']}</h3>`

        let marker = new maplibregl.Marker({ element: createImage('signIcon') })
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup()
                .setHTML(popup_message))
            .addTo(map)
        markers.protest.push(marker);
        createButtons(1, lat, lng, data['Could you best specify the location where you were present?']);
    }
}

function addMarker2(data){
    let lng = data['lng2'];
    let lat = data['lat2'];
    let locationKey = `${lng},${lat}`;

    if (!uniqueEncampmentLocations.has(locationKey)) {
        uniqueEncampmentLocations.add(locationKey);

    let popup_message = `<h2>Encampment Site</h2> <h3>Location: ${data['If involved at any encampments related to the Pro-Palestine movement, could you best specify the location where you were present?']}</h3>`
 
    let marker = new maplibregl.Marker({ element: createImage('tentIcon') })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    console.log(popup_message)
    markers.encampment.push(marker);
    createButtons(2, lat, lng, data['If involved at any encampments related to the Pro-Palestine movement, could you best specify the location where you were present?']);
    }
}

function addMarker3(data){
    let lng = data['lng3'];
    let lat = data['lat3'];
    let locationKey = `${lng},${lat}`;

    if (!uniqueSignificantLocations.has(locationKey)) {
        uniqueSignificantLocations.add(locationKey);

    let popup_message = `<h2>Significant Landmark</h2> <h3>Location: ${data["Can you describe any specific location on UCLA's campus that have become significant in the context of Pro-Palestine movements?"]}</h3>`

    let marker = new maplibregl.Marker({ element: createImage('flagIcon') })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    console.log(popup_message)
    markers.significant.push(marker);
    createButtons(3, lat, lng, data["Can you describe any specific location on UCLA's campus that have become significant in the context of Pro-Palestine movements?"]);
    }
}

function createButtons(markerNum, lat,lng,title){
    const newButton = document.createElement("button");
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
    if (markerNum == 1)
        document.getElementById("protestbuttons").appendChild(newButton);
    else if (markerNum == 2)
        document.getElementById("encampmentbuttons").appendChild(newButton);
    else if (markerNum == 3)
        document.getElementById("significantbuttons").appendChild(newButton);
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

map.on('load', function() {
    Papa.parse(dataUrl, {
        download: true,
        header: true,
        complete: function(results) {
            processData(results.data); 
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
            if (feature['lat1'] != "0") addMarker1(feature);
            if (feature['lat2'] != "0") addMarker2(feature);
            if (feature['lat3'] != "0") addMarker3(feature);
            makeResponseCards(feature);
        }
    });
    toggleMarkersVisibility();
};

function toggleMarkersVisibility() {
    // sees if checked
    let showEncampment = document.getElementById('showEncampment').checked;
    let showProtest = document.getElementById('showProtest').checked;
    let showSignificant = document.getElementById('showSignificant').checked;

    markers.encampment.forEach(marker => marker.getElement().style.display = showEncampment ? 'block' : 'none');
    markers.protest.forEach(marker => marker.getElement().style.display = showProtest ? 'block' : 'none');
    markers.significant.forEach(marker => marker.getElement().style.display = showSignificant ? 'block' : 'none');
}

document.getElementById('showEncampment').addEventListener('change', toggleMarkersVisibility);
document.getElementById('showProtest').addEventListener('change', toggleMarkersVisibility);
document.getElementById('showSignificant').addEventListener('change', toggleMarkersVisibility);

function makeResponseCards(data) {
    let timestamp = data['Timestamp'];
    let date = new Date(timestamp);
    let monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

    let responseCard = document.createElement('div');
    responseCard.className = 'response-card';

    let title = `Response from ${data['How are you/have been affiliated with UCLA?']} (${monthYear}, ${data['Where are you currently located?']})`;
    let titleElement = document.createElement('h3');
    titleElement.textContent = title;
    responseCard.appendChild(titleElement);

    let hasContent = false; // ignores blank forms

    if (data['How have you supported the Palestinian resistance?']) {
        let q1 = 'How have you supported the Palestinian resistance?';
        let a1 = data['How have you supported the Palestinian resistance?'];
        let questionElement = document.createElement('h4');
        questionElement.textContent = q1;
        let answerElement = document.createElement('p');
        answerElement.textContent = a1;
        responseCard.appendChild(questionElement);
        responseCard.appendChild(answerElement);
        hasContent = true; }

    if (data['If involved at any encampments related to the Pro-Palestine movement, could you share your experience?']) {
        let q2 = 'If involved at any encampments related to the Pro-Palestine movement, could you share your experience?';
        let a2 = data['If involved at any encampments related to the Pro-Palestine movement, could you share your experience?'];
        let questionElement = document.createElement('h4');
        questionElement.textContent = q2;
        let answerElement = document.createElement('p');
        answerElement.textContent = a2;
        responseCard.appendChild(questionElement);
        responseCard.appendChild(answerElement);
        hasContent = true; }

    if (data['Is there anything else you would like to share in regards to your experience advocating for Palestine?']) {
        let q3 = 'Is there anything else you would like to share in regards to your experience advocating for Palestine?';
        let a3 = data['Is there anything else you would like to share in regards to your experience advocating for Palestine?'];
        let questionElement = document.createElement('h4');
        questionElement.textContent = q3;
        let answerElement = document.createElement('p');
        answerElement.textContent = a3;
        responseCard.appendChild(questionElement);
        responseCard.appendChild(answerElement);
        hasContent = true; }

    if (data['Has showing solidarity with Palestine impacted you in any way?']) {
        let q4 = 'Has showing solidarity with Palestine impacted you in any way?';
        let a4 = data['Has showing solidarity with Palestine impacted you in any way?'];
        let questionElement = document.createElement('h4');
        questionElement.textContent = q4;
        let answerElement = document.createElement('p');
        answerElement.textContent = a4;
        responseCard.appendChild(questionElement);
        responseCard.appendChild(answerElement);
        hasContent = true; }

    if (data['How have recent events affected your perception of UCLA\'s campus spaces?']) {
        let q5 = 'How have recent events affected your perception of UCLA\'s campus spaces?';
        let a5 = data['How have recent events affected your perception of UCLA\'s campus spaces?'];
        let questionElement = document.createElement('h4');
        questionElement.textContent = q5;
        let answerElement = document.createElement('p');
        answerElement.textContent = a5;
        responseCard.appendChild(questionElement);
        responseCard.appendChild(answerElement);
        hasContent = true; }

    if (data['How have UCLA\'s administrative responses to Pro-Palestine activism affected your use of campus spaces?']) {
        let q6 = 'How have UCLA\'s administrative responses to Pro-Palestine activism affected your use of campus spaces?';
        let a6 = data['How have UCLA\'s administrative responses to Pro-Palestine activism affected your use of campus spaces?'];
        let questionElement = document.createElement('h4');
        questionElement.textContent = q6;
        let answerElement = document.createElement('p');
        answerElement.textContent = a6;
        responseCard.appendChild(questionElement);
        responseCard.appendChild(answerElement);
        hasContent = true; }

    if (data['Is there anything else you would like to share?']) {
        let q7 = 'Is there anything else you would like to share?';
        let a7 = data['Is there anything else you would like to share?'];
        let questionElement = document.createElement('h4');
        questionElement.textContent = q7;
        let answerElement = document.createElement('p');
        answerElement.textContent = a7;
        responseCard.appendChild(questionElement);
        responseCard.appendChild(answerElement);
        hasContent = true; }
    if (hasContent) {
        document.getElementById('responses').appendChild(responseCard); }
}