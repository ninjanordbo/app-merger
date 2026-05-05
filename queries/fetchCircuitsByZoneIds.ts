import { getErrorMessage } from "~/helpers/getErrorMessage";

import { fetchCircuitsPopulation } from "./fetchCircuitsPopulation";

import type { Api } from "~/utils/types";

export async function fetchCircuitsByZoneIds(
  zoneIds: string[],
): Promise<Omit<Circuit, "hovered">[]> {
  const { getAuthorizationHeaders } = useAuth();
  return $apiRequest<Api.Response.AreaData.Circuit[]>(
    "/area-data/zoned-circuits",
    {
      method: "GET",
      query: { zoneIds },
      headers: await getAuthorizationHeaders(),
      onResponseError: (error) => {
        useNotifications().pushNotification({
          type: "error",
          title: "Error fetching circuits",
          message: getErrorMessage(error),
        });
      },
    },
  ).then(async (res) => {
    const circuits = res.data;
    if (!circuits?.length) return [];

    const circuitsPopulation = await fetchCircuitsPopulation(
      circuits.map((circuit) => circuit.id),
    );

    return circuits.map((circuit) => ({
      id: circuit.id,
      name: circuit.name,
      zoneId: circuit.zone_id,
      initialZoneId: circuit.initial_zone_id,
      inhabitantsAmount:
        Number(
          circuitsPopulation?.find(
            (item) => item.attributes.grunnkrets_id === circuit.id,
          )?.attributes.ald_totalt,
        ) || 0,
    }));
  });
}

export async function fetchCircuitIdsByZones(
  zoneIds: string[],
): Promise<Map<string, string[]>> {
  const { getAuthorizationHeaders } = useAuth();
  return $apiRequest<Api.Response.AreaData.Circuit[]>(
    "/area-data/zoned-circuits",
    {
      method: "GET",
      query: { zoneIds },
      headers: await getAuthorizationHeaders(),
      onResponseError: (error) => {
        useNotifications().pushNotification({
          type: "error",
          title: "Error fetching circuits",
          message: getErrorMessage(error),
        });
      },
    },
  ).then((res) => {
    const circuits = res.data;
    const zonedCircuitsMap = new Map<string, string[]>();

    if (circuits && circuits.length) {
      circuits.forEach((circuit) => {
        if (circuit.zone_id) {
          if (!zonedCircuitsMap.has(circuit.zone_id)) {
            zonedCircuitsMap.set(circuit.zone_id, []);
          }
          zonedCircuitsMap.get(circuit.zone_id)?.push(circuit.id);
        }
      });
    }

    return zonedCircuitsMap;
  });
}
