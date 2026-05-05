import type { Api, IndicatorSource } from "../types";
import type { Feature } from "geojson";

export async function fetchAreaDataById<T extends string>(
  areaLayer: MapTilesLayersNamesKey,
  areaIds: string[],
  fieldsToFetch: { name: string; indicatorSource: IndicatorSource }[] = [
    { name: "ald_totalt", indicatorSource: "geoData" },
    { name: "grunnkrets_id", indicatorSource: "geoData" },
  ],
): Promise<{
  features: (Feature & {
    id: string;
    attributes: { [K in T]: string | number };
  })[];
}> {
  const { getAuthorizationHeaders } = useAuth();
  const { data } = await $apiRequest<Api.Response.GeoData.AreaData<T>>(
    "/indicators/data/get",
    {
      method: "POST",
      headers: await getAuthorizationHeaders(),
      body: {
        areaLayer,
        areaIds,
        fieldsToFetch,
      },
    },
  );

  if (!data?.features?.length) {
    throw new Error("No data found for areas");
  }

  return data;
}
