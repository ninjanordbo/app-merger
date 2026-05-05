import { getErrorMessage } from "~/helpers/getErrorMessage";

import type { Api } from "~/utils/types";

export async function getAreasByParent(
  parentAreaId: string,
  parentLayer: MapTilesLayersNamesKey,
  sourceLayer: MapTilesLayersNamesKey,
) {
  const { getAuthorizationHeaders } = useAuth();
  return $apiRequest<Api.Response.AreaData.Circuit[]>(
    "/area-data/areas-by-parent",
    {
      method: "GET",
      query: { parentAreaId, parentLayer, sourceLayer },
      headers: await getAuthorizationHeaders(),
      onResponseError: (error) => {
        useNotifications().pushNotification({
          type: "error",
          title: "Error fetching circuits",
          message: getErrorMessage(error),
        });
      },
    },
  ).then((res) => res.data);
}
