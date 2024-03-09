maptilersdk.config.apiKey=mapToken;
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: [78.9629, 20.5937], // starting position [lng, lat]
  zoom: 3 // starting zoom
});

const marker = new maptilersdk.Marker()
  .setLngLat(coordinates)
  .addTo(map);