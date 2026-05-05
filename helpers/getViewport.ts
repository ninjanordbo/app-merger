const WORLD_DIM = { width: 256, height: 256 };
const ZOOM_MAX = 22;

export function getViewportFromBBox(
  bbox: number[],
  mapWidth: number,
  mapHeight: number,
) {
  const minLng = bbox[0];
  const minLat = bbox[1];
  const maxLng = bbox[2];
  const maxLat = bbox[3];

  // Calculate center of the bbox
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  // Calculate aspect ratios
  const latFraction = (latToY(maxLat) - latToY(minLat)) / 2;
  const lngFraction = (maxLng - minLng) / 360;

  const latZoom =
    Math.log(mapHeight / WORLD_DIM.height / latFraction) / Math.LN2;

  const lngZoom = Math.log(mapWidth / WORLD_DIM.width / lngFraction) / Math.LN2;

  const zoom = Math.min(latZoom, lngZoom, ZOOM_MAX);

  return {
    lon: centerLng,
    lat: centerLat,
    zoom,
  };
}

// Utility function to convert latitudes to Y axis in Mercator projection
function latToY(lat: number) {
  return Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2)) / Math.PI;
}
