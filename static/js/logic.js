let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
    // Initialize the map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
    });

    // Base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create overlay map with earthquakes data
    let earthquakes = createMap(data, myMap);

    // Base maps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Overlay map object
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Add layers control to the map
    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

    // Add legend for depth correlation
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90];

        // Increase the legend box size
        div.style.backgroundColor = "#fff"; // Set background to white
        div.style.width = "80px"; // Adjust the width of the legend box
        div.style.padding = "10px"; // Add padding inside the legend box
        div.style.fontSize = "14px"; // Adjust font size for better readability

        // Loop through depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < depth.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getDepthColor(depth[i]) + '; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' +
                depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);

});

// Function to create the map with earthquake data
function createMap(data, myMap) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function getColor(mag) {
        if (mag > 5) return "#ea2c2c";
        if (mag > 4) return "#ea822c";
        if (mag > 3) return "#ee9c00";
        if (mag > 2) return "#eecc00";
        if (mag > 1) return "#d4ee00";
        return "#98ee00";
    }

    function getRadius(mag) {
        if (mag === 0) return 1;
        return mag * 4;
    }

    // Add earthquake data to the map
    return L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);
}

// Function to get color based on depth
function getDepthColor(depth) {
    return depth > 90 ? "#ea2c2c" :
           depth > 70 ? "#ea822c" :
           depth > 50 ? "#ee9c00" :
           depth > 30 ? "#eecc00" :
           depth > 10 ? "#d4ee00" :
           "#98ee00";
}
