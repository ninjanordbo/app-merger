import { fetchAreaDataById } from "~/utils/geoData/getGeodata";

export function fetchCircuitsPopulation(circuitIds: string[]) {
  return fetchAreaDataById("grunnkretser", circuitIds, [
    { name: "ald_totalt", indicatorSource: "geoData" },
    { name: "grunnkrets_id", indicatorSource: "geoData" },
  ]).then((res) => res.features);
}
