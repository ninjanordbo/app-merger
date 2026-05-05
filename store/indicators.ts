import type { Api } from "~/utils/types";

export const useIndicators = defineStore("indicators", () => {
  const {
    result: counties,
    inProgress: countiesInProgress,
    execute: fetchCounties,
  } = usePromise(() => getAreaData("fylker"), { cache: true });
  const {
    result: municipalities,
    inProgress: municipalitiesInProgress,
    execute: fetchMunicipalities,
  } = usePromise(() => getAreaData("kommuner"), { cache: true });
  const {
    result: circuits,
    inProgress: circuitsInProgress,
    execute: fetchCircuits,
  } = usePromise(() => getAreaData("grunnkretser"), { cache: true });
  const {
    result: zones,
    inProgress: zonesInProgress,
    execute: fetchZones,
  } = usePromise(() => getAreaData("soner"), { cache: true });

  async function getAreaData(
    areaLayerName: MapTilesLayersNamesKey,
  ): Promise<{ id: string; name: string }[]> {
    const { data } = await $apiRequest<Api.Response.AreaData.Areas>(
      "/area-data/areas",
      {
        method: "GET",
        query: { areaLayer: areaLayerName },
        headers: await useAuth().getAuthorizationHeaders(),
      },
    );

    if (!data) {
      throw new Error("Could not load areas");
    }

    return data;
  }

  function groupIndicators(indicators: (GeoDataVisualKey | GeoDataTypeKey)[]) {
    const groupMap = new Map<
      string,
      {
        groupName: string;
        indicators: (GeoDataVisualKey | GeoDataTypeKey)[];
      }
    >();

    indicators.forEach((indicator) => {
      const { groupName } = indicator;

      if (groupName) {
        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, { groupName, indicators: [] });
        }

        groupMap.get(groupName)?.indicators.push(indicator);
      }
    });

    return Array.from(groupMap.values()).map((group) => ({
      ...group,
      indicators: group.indicators,
    }));
  }

  return {
    groupIndicators,

    counties,
    municipalities,
    circuits,
    zones,

    countiesInProgress,
    municipalitiesInProgress,
    circuitsInProgress,
    zonesInProgress,

    fetchCircuits,
    fetchCounties,
    fetchMunicipalities,
    fetchZones,
  };
});
