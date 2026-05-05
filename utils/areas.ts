import { fetchCircuitIdsByZones } from "~/queries/fetchCircuitsByZoneIds";
import { type MapTilesLayersNamesKey } from "~/utils/mapTilesUtils";

export function getSublayerIds(
  areaLayer: MapTilesLayersNamesKey,
  areaIds: string[],
) {
  switch (areaLayer) {
    case "soner":
      return fetchCircuitIdsByZones(areaIds);

    default:
      return Promise.resolve(new Map<string, string[]>());
  }
}
