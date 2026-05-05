import { getErrorMessage } from "~/helpers/getErrorMessage";

import type { Api } from "~/utils/types";

export async function fetchZonesByMunicipalityId(
  municipalityId: string,
): Promise<Zone[]> {
  const { getAuthorizationHeaders } = useAuth();
  const authHeaders = await getAuthorizationHeaders();

  return $apiRequest<Api.Response.AreaData.Zone[]>("/area-data/zones", {
    method: "GET",
    query: {
      municipalityId,
    },
    headers: authHeaders,
    onResponseError: (error) => {
      useNotifications().pushNotification({
        type: "error",
        title: "Error fetching zones",
        message: getErrorMessage(error),
      });
    },
  }).then(
    (res) =>
      res.data?.map((zone) => ({
        id: zone.id,
        name: zone.name,
        inhabitantsAmount: 0,
        displayId: "",
        municipalityId: zone.municipalityId,
      })) || [],
  );
}
