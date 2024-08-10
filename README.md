# Earthquake Visualization

This project involves visualizing earthquake data using the Leaflet library. The goal is to create a map that plots all the earthquakes from a dataset based on their longitude and latitude, with markers that reflect the magnitude and depth of each earthquake.

## Table of Contents
1. [Getting Started](#getting-started)
   - [Dataset Acquisition](#dataset-acquisition)
   - [JSON Data Overview](#json-data-overview)
2. [Creating the Earthquake Map](#creating-the-earthquake-map)
   - [Plotting Earthquakes with Leaflet](#plotting-earthquakes-with-leaflet)
   - [Customizing Markers](#customizing-markers)
   - [Adding Popups](#adding-popups)
   - [Creating a Legend](#creating-a-legend)
3. [Code Examples](#code-examples)
   - [Popups](#popups)
   - [Legend](#legend)

## Getting Started

### Dataset Acquisition

1. Visit the [USGS GeoJSON Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page.
2. Select a dataset to visualize, such as "All Earthquakes from the Past 7 Days".
3. Copy the URL of the JSON data provided for that dataset.

### JSON Data Overview

The dataset will be in JSON format, containing details about recent earthquakes, including their location, magnitude, and depth.

## Creating the Earthquake Map

### Plotting Earthquakes with Leaflet

Using Leaflet, plot the earthquake data on a map. Each earthquake's location is determined by its latitude and longitude coordinates.

### Customizing Markers

Markers should reflect the magnitude of the earthquake by size and the depth by color. Larger markers indicate higher magnitudes, and darker colors represent greater depths.

### Adding Popups

To provide more context for each earthquake, popups are used to display additional information when a marker is clicked.

### Creating a Legend

Add a legend to the map that explains the color coding for earthquake depths.

## Code Examples

### Popups

The following code snippet demonstrates how to add popups to the map:

javascript
```
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
}
```
![Chart](https://github.com/omidk414/leaflet-challenge/blob/main/Images/Part1.png)

### Legend

This code snippet shows how to create a legend for the map:

javascript
```
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend"),
          depth = [-10, 10, 30, 50, 70, 90];
  
      div.style.backgroundColor = "#fff"; // Set background to white
      div.innerHTML += "<h3>Legend</h3>";
  
      for (let i = 0; i < depth.length; i++) {
          div.innerHTML += 
              '<i style="background:' + getDepthColor(depth[i]) + '; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' +
              depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
      }
      return div;
  };
  legend.addTo(myMap);
```
![Legend](https://github.com/omidk414/leaflet-challenge/blob/main/Images/Legend.png)
