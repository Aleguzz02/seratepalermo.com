// Initialize the map
var map = L.map("map").setView([38.050, 13.330], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Events
var eventsData = [
    { name: "AlbertiniBeachClub", lat: 38.15992, lng: 13.08529, date: "2024-05-11", org: "Fireworks" },
    { name: "Vintage", lat: 38.1361984, lng: 13.3317784, date: "2024-05-11", org: "Habitat"},
    { name: "Wave", lat: 38.1461984, lng: 13.3217784, date: "2024-05-12", org: "Testa" },
    // ... more event data
    { name: "All day", lat: 38.090, lng: 13.340, date: "all" }
];

// Create a custom icon with modified iconSize and iconAnchor
var customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png",
  iconSize: [25, 41], // specify the modified icon size
  iconAnchor: [12, 41], // specify the modified icon anchor
  popupAnchor: [1, -28] // specify the modified popup anchor
});

// Define marker locations and add markers to the map
var markers = [];
eventsData.forEach(function(event) {
    var marker = L.marker([event.lat, event.lng], {icon: customIcon}).addTo(map);
    var formattedDate = new Date(event.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
    var popupContent = event.name + "\n\n" + " - " + formattedDate;
    popupContent += "<p style='margin: 0; padding: 5px 0px;'>" + event.org + "</p>";
    // Add a link to the popup content that scrolls to the corresponding event in the table
    popupContent += "<a href='javascript:void(0)' onclick='scrollToEvent(\"" + event.name + "\")'>Dettagli</a>";
    marker.bindPopup(popupContent, { autoClose: false });
    markers.push({ marker: marker, date: event.date, name: event.name });
});

// JavaScript function to scroll to the corresponding event in the table and highlight the row
function scrollToEvent(eventName) {
    var eventElement = document.getElementById(eventName);
    if (eventElement) {
        // Remove the 'highlight' class from all rows
        var tableRows = document.querySelectorAll('tr');
        tableRows.forEach(function(row) {
            row.classList.remove('highlight');
        });

        // Add the 'highlight' class to the selected row
        eventElement.classList.add('highlight');

        // Scroll to the selected row
        eventElement.scrollIntoView({ behavior: "smooth" });
    }
}

// Define the handleAllSelection function
function handleAllSelection() {
    document.getElementById('daySelect').value = "";
    // Call the filterMarkers function to display all markers on the map
    filterMarkers();
    }

// Define the selectToday function
function selectToday() {
  var today = new Date().toLocaleDateString('en-CA');
  document.getElementById('daySelect').value = today; // Set the value of the daySelect input to today
  filterMarkers();
}

function filterMarkers() {
  var selectedDay = document.getElementById('daySelect').value;
  markers.forEach(function(markerData) {
    var marker = markerData.marker;
    var date = markerData.date;
    if (markerData.name === "All day") {
      return;
    }
    if (!selectedDay) {
      // Show all markers when no day is selected
      map.addLayer(marker);
    } else if (selectedDay === date) {
      // Show the marker if its date matches the selected day
      map.addLayer(marker);
    } else {
      // Remove the marker if its date does not match the selected day
      map.removeLayer(marker);
    }
  });
}

// Hide the "All day" marker
markers.forEach(function(markerData) {
  if (markerData.name === "All day") {
    map.removeLayer(markerData.marker);
  }
});


// Add event listeners to the "Vedi sulla mappa" buttons
document.querySelectorAll('.scrollToMapButton').forEach(function(button) {
  button.addEventListener('click', function() {
    var mapElement = document.getElementById('map');
    mapElement.scrollIntoView({ behavior: "smooth" }); // Scroll to the map
    var eventName = button.parentElement.parentElement.id;
    var event = eventsData.find(function(event) {
      return event.name === eventName;
    });
    if (event) {
      var eventLat = event.lat;
      var eventLng = event.lng;
      var eventMarker = markers.find(function(markerData) {
        return markerData.name === event.name;
      });
      if (eventMarker) {
        // Close all popups before opening the new one
        markers.forEach(function(markerData) {
          markerData.marker.closePopup();
        });
        map.flyTo([eventLat, eventLng], 14); // Fly to the latitude and longitude of the event
        eventMarker.marker.openPopup();
      }
    }
  });
});