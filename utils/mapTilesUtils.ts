import type { SourceSpecification } from "mapbox-gl";

export enum MapTilesLayersNames {
  "hele_landet" = 0,
  "fylker" = 1,
  "kommuner" = 2,
  "soner" = 3,
  "grunnkretser" = 4,
}

export type MapTilesLayersNamesKey = keyof typeof MapTilesLayersNames;

export const mapTilesLayers: MapTilesLayersNamesKey[] = Object.keys(
  MapTilesLayersNames,
)
  .filter((k) => isNaN(Number(k)))
  .map((v) => v as MapTilesLayersNamesKey);

export function getAreaLayerIdField(layer: MapTilesLayersNamesKey) {
  switch (layer) {
    case "hele_landet":
      return "";
    case "fylker":
      return "fylke_id";
    case "kommuner":
      return "kommune_id";
    case "soner":
      return "zone_id";
    case "grunnkretser":
      return "grunnkrets_id";
  }
}

export function isKeyOfMapTilesLayersNames(
  key: string,
): key is MapTilesLayersNamesKey {
  return key in MapTilesLayersNames;
}

export function layerNameToSingular(name: MapTilesLayersNamesKey) {
  switch (name) {
    case "hele_landet":
      return "hele landet";
    case "fylker":
      return "fylke";
    case "kommuner":
      return "kommune";
    case "soner":
      return "sone";
    case "grunnkretser":
      return "grunnkrets";
    default:
      return "";
  }
}

export function getHigherLayer(layerName: string): string {
  if (!isKeyOfMapTilesLayersNames(layerName)) {
    return "";
  }
  const currentLayerIndex = MapTilesLayersNames[layerName];
  if (currentLayerIndex === 0) {
    return MapTilesLayersNames[0];
  }
  return MapTilesLayersNames[MapTilesLayersNames[layerName] - 1];
}

export function getLayerTilesSource(
  layer: MapTilesLayersNamesKey,
): SourceSpecification {
  if (layer === "soner") {
    const { apiUrl } = useRuntimeConfig().public;
    return {
      type: "vector",
      tiles: [`${apiUrl}/tiles/{z}/{x}/{y}.pbf`],
    };
  }
  return {
    type: "vector",
    url: `mapbox://nabolagshelse.${layer}`,
  };
}

export const mapLayersZooms: Map<
  MapTilesLayersNamesKey,
  {
    maxZoom: number;
    minZoom: number;
  }
> = new Map([
  ["hele_landet" as MapTilesLayersNamesKey, { minZoom: 3, maxZoom: 22 }],
  [
    "fylker" as MapTilesLayersNamesKey,
    {
      minZoom: 3,
      maxZoom: 22,
    },
  ],
  [
    "kommuner",
    {
      minZoom: 3,
      maxZoom: 22,
    },
  ],
  [
    "soner",
    {
      minZoom: 3,
      maxZoom: 22,
    },
  ],
  [
    "grunnkretser",
    {
      minZoom: 5,
      maxZoom: 22,
    },
  ],
]);
