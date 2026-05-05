import { until } from "@vueuse/core";
import chroma from "chroma-js";
import { z } from "zod";

import { getErrorMessage } from "~/helpers/getErrorMessage";
import { fetchCircuitsByZoneIds } from "~/queries/fetchCircuitsByZoneIds";
import { fetchZonesByMunicipalityId } from "~/queries/fetchZonesByMunicipalityId";

import type { Feature } from "geojson";
import type { DataDrivenPropertyValueSpecification } from "mapbox-gl";

const SELECTED_FILL_COLOR = "#ef4444";

const ZONE_COLORS_PALETTE_COLORS = [
  // Light shades:
  "#d2ebef",
  "#cfd6e3",
  "#c7d1b2",
  "#f3f1c0",
  "#e4d8bd",
  "#dedcd1",
  "#e2c58d",
  "#c9ded9",
  "#dac4d0",
  "#ddd2d1",

  // Medium shades:
  "#92c6d9",
  "#929ec0",
  "#99b47e",
  "#e8d86d",
  "#cfb872",
  "#b8b29e",
  "#d09847",
  "#91bab3",
  "#b4879c",
  "#b5a4a0",

  // Dark shades:
  "#5398c0",
  "#5a6497",
  "#6a8d54",
  "#d4ae20",
  "#d4ae20",
  "#ac9932",
  "#8f8c6b",
  "#9a6126",
  "#5d9391",
  "#875466",
  "#907a70",
];

export const useZoneSelection = defineStore("zoneSelection", () => {
  const { mapLayers, reloadInitialLayers, filterFetchedFeatures } =
    useZoneMap();
  const { map, mapSource } = storeToRefs(useZoneMap());
  const { loadUserMunicipalities } = useAuth();
  const { authenticated, selectedMunicipality } = storeToRefs(useAuth());
  const hasUnsavedChanges = ref(false);
  const saveAreasToLS = ref(true);
  const canBeEditedValue = ref(true);
  const canBeEdited = computed({
    get: () => canBeEditedValue.value,
    set: (value) => {
      if (
        !selectedMunicipality.value ||
        selectedMunicipality.value?.submitted
      ) {
        canBeEditedValue.value = false;
        return;
      }
      canBeEditedValue.value = value;
    },
  });
  const municipalitySubmitted = computed(
    () => selectedMunicipality.value?.submitted,
  );

  watch(
    municipalitySubmitted,
    () => {
      municipalitySubmitted.value && (canBeEdited.value = false);
    },
    { immediate: true },
  );

  until(selectedMunicipality)
    .toMatch((municipality) => !!municipality?.id)
    .then((res) => {
      if (res?.id) {
        validateLocalStorageData();
      }
    });

  const {
    data: zones,
    execute: fetchZones,
    refresh: refreshZones,
  } = useAsyncData(
    async (): Promise<Zone[]> => {
      await until(authenticated).toBe(true);
      const municipalityId = selectedMunicipality.value?.id || "";
      const dbZones = await fetchZonesByMunicipalityId(municipalityId);
      const localZones = getLocalStorageZones();
      return formatZonesWithDisplayIds(
        mergeDatabaseAndLocalZones(dbZones, localZones),
      );
    },
    {
      immediate: true,
    },
  );

  function getLocalStorageZones(): Zone[] {
    const savedZones = localStorage.getItem("zones");
    if (!savedZones?.length) {
      return [];
    }

    const parsedZones: Zone[] = JSON.parse(savedZones);

    return parsedZones;
  }

  function mergeDatabaseAndLocalZones(
    dbZones: Zone[],
    localZones: Zone[],
  ): Zone[] {
    // Find zones that exist only locally
    const dbZoneIds = new Set(dbZones.map((zone) => zone.id));
    const localOnlyZones = localZones.filter(
      (local) => !dbZoneIds.has(local.id),
    );

    // Find zones that exist only in database
    const dbOnlyZones = dbZones.filter(
      (db) => !localZones.some((local) => local.id === db.id),
    );

    // If all zones are new from DB, return all DB zones
    if (dbOnlyZones.length === dbZones.length) {
      return [...dbZones, ...localOnlyZones];
    }

    // Otherwise, return filtered DB zones plus local-only zones
    const filteredDbZones = dbZones.filter(
      (zone) => !dbOnlyZones.find((dbOnlyZone) => dbOnlyZone.id === zone.id),
    );

    return [...filteredDbZones, ...localOnlyZones];
  }

  function formatZonesWithDisplayIds(zones: Zone[]): Zone[] {
    return zones.map((zone) => ({
      ...zone,
      displayId: Number(zone.id.slice(-4)).toString(),
    }));
  }

  const {
    data: circuits,
    execute: fetchCircuits,
    refresh: refreshCircuits,
  } = useAsyncData(async (): Promise<Circuit[]> => {
    if (saveAreasToLS.value) {
      const savedCircuits = localStorage.getItem("circuits");
      if (savedCircuits?.length) {
        const parsedCircuits: Circuit[] = JSON.parse(savedCircuits);
        if (parsedCircuits.length) {
          return parsedCircuits;
        }
      }
    }

    // Need to wait for zonse to be fetched
    await until(zones).toMatch((value) => !!value?.length);

    if (!zones.value?.length) return [];
    const zoneIds = zones.value.map((zone) => zone.id);
    if (!zoneIds?.length) return [];

    // Fetch from the server
    const serverCircuits = await fetchCircuitsByZoneIds(zoneIds);
    return serverCircuits.map((circuit) => ({
      ...circuit,
      hovered: false,
    }));
  });

  const colorMap = ref<{ [key: string]: string }>({});

  const selectedZone = ref<Zone | null>(null);

  watch(map, (map) => {
    if (!map) return;

    map.on("load", () => {
      map.on("click", "area-fill", (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const selectedFeature: Feature = e.features[0];
        const selectedZoneId = map.getFeatureState({
          source: mapSource.value,
          sourceLayer: mapSource.value,
          id: selectedFeature.id!,
        })?.zoneId;
        if (!selectedZoneId || typeof selectedZoneId !== "string") return;
        handleZoneSelection(selectedZoneId);
      });
    });
  });

  function handleZoneSelection(zoneId: string) {
    // Disable selection for all areas
    if (selectedZone.value?.id !== undefined) {
      circuits.value?.forEach(({ id }) => {
        map.value?.setFeatureState(
          {
            source: mapSource.value,
            sourceLayer: mapSource.value,
            id,
          },
          { selected: false },
        );
      });
    }

    selectedZone.value =
      zones.value?.find((zone) => zone.id === zoneId) ?? null;
    if (!selectedZone.value) return;

    const selectZone = (zoneId: string) => {
      return circuits.value
        ?.filter((circuit) => circuit.zoneId === zoneId)
        .forEach(({ id }) => {
          map.value?.setFeatureState(
            {
              source: mapSource.value,
              sourceLayer: mapSource.value,
              id,
            },
            { selected: true },
          );
        });
    };

    // Making sure the map is loaded before setting the feature states
    if (!map.value?.isStyleLoaded()) {
      map.value?.on("load", () => selectZone(zoneId));
    } else selectZone(zoneId);
  }

  function deleteZone(zone: Zone) {
    const { pushNotification } = useNotifications();

    checkZonesCanBeDeleted();

    if (!zone.canBeDeleted) {
      pushNotification({
        type: "error",
        title: "Sletting av sone feilet",
        message: "Du kan ikke slette en sone som har grunnkretser tilknyttet",
      });
      return;
    }

    if (zones.value?.length) {
      zones.value = zones.value?.filter((item) => item.id !== zone.id);
    }

    pushNotification({
      type: "success",
      title: "Sone slettet",
      message: "Sone er slettet",
    });

    handleZoneSelection("");
  }

  function setAreaHoverState(areaId: string, hovered: boolean) {
    if (!map.value) return;

    const circuitIndex = circuits.value?.findIndex((item) => {
      return item.id.toString() === areaId.toString();
    });
    if (circuitIndex === -1 || circuitIndex === undefined) {
      throw new Error(`Circuit ${areaId} doesn't exist in the circuits list`);
    }

    if (circuits.value) {
      circuits.value = circuits.value.map((circuit, index) =>
        index === circuitIndex ? { ...circuit, hovered } : circuit,
      );
    }
  }

  function initializeZoneColors() {
    const zonesIds = zones.value
      ?.sort((a, b) => Number(a.id.slice(-4)) - Number(b.id.slice(-4)))
      .map((zone) => String(zone.id));
    if (!zonesIds) return;

    const paletteColors = chroma
      .scale(ZONE_COLORS_PALETTE_COLORS)
      .mode("rgb")
      .colors(zonesIds.length + 1);

    zonesIds.forEach((zoneId, index) => {
      colorMap.value[zoneId] = paletteColors[index];
    });

    const matchExpression: DataDrivenPropertyValueSpecification<number> = [
      "match",
      ["feature-state", "zoneId"],
    ];

    zonesIds.forEach((zoneId) => {
      matchExpression.push(zoneId);
      matchExpression.push(colorMap.value[zoneId]);
    });

    matchExpression.push("rgba(0,0,0,0)"); // Default color if zoneId doesn't match

    // Add the `case` expression to check for "selected" state first
    const colorExpressions: DataDrivenPropertyValueSpecification<number> = [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      SELECTED_FILL_COLOR,
      matchExpression, // Fallback to the match expression if "selected" is false
    ];

    if (mapLayers.areaFill.paint && "fill-color" in mapLayers.areaFill.paint) {
      mapLayers.areaFill.paint["fill-color"] = colorExpressions;
    }
  }

  function initializeAreaZones(ids: string[]) {
    if (!ids.length) return;

    ids.forEach((id) => {
      const featureState = map.value?.getFeatureState({
        source: mapSource.value,
        sourceLayer: mapSource.value,
        id,
      });

      if (!featureState) {
        throw new Error(`Feature ${id} doesn't exist on the map`);
      }

      const zoneId =
        circuits.value?.find((item) => {
          return item.id === id;
        })?.zoneId ?? 0;

      map.value?.setFeatureState(
        {
          source: mapSource.value,
          sourceLayer: mapSource.value,
          id,
        },
        {
          zoneId: zoneId.toString(),
        },
      );
    });
  }

  function setAreaZone(areaId: string | number, zoneId: string) {
    if (!areaId) {
      throw new Error("No area selected");
    }

    const featureState = map.value?.getFeatureState({
      source: mapSource.value,
      sourceLayer: mapSource.value,
      id: areaId,
    });

    if (!featureState) {
      throw new Error(`Feature ${areaId} doesn't exist on the map`);
    }

    const circuitIndex = circuits.value?.findIndex((item) => {
      return item.id === areaId.toString();
    });
    if (circuitIndex === -1 || circuitIndex === undefined) {
      throw new Error(`Circuit ${areaId} doesn't exist in the circuits list`);
    }

    if (circuits.value) {
      circuits.value = circuits.value.map((circuit, index) =>
        index === circuitIndex ? { ...circuit, zoneId } : circuit,
      );
    }

    map.value?.setFeatureState(
      {
        source: mapSource.value,
        sourceLayer: mapSource.value,
        id: areaId,
      },
      {
        zoneId,
      },
    );

    hasUnsavedChanges.value = true;
    saveCircuitsToLs();
    reloadZoneInhabitantAmounts();
  }

  function reloadZoneInhabitantAmounts() {
    zones.value?.forEach((zone) => {
      zone.inhabitantsAmount =
        circuits.value
          ?.filter((circuit) => circuit.zoneId === zone.id)
          .reduce((acc, circuit) => acc + circuit.inhabitantsAmount, 0) || 0;
    });
  }

  function resetCircuitsInitial() {
    if (!circuits.value || !zones.value) return;

    saveAreasToLS.value = false;
    canBeEdited.value = false;

    // Set the zoneId of each circuit to its initialZoneId
    circuits.value = circuits.value.map((circuit) => ({
      ...circuit,
      zoneId: circuit.initialZoneId,
    }));

    const usedZoneIds = Array.from(
      new Set(circuits.value.map((circuit) => circuit.initialZoneId)),
    );

    // Filter zones with cicruits
    zones.value = usedZoneIds.map((zoneId) => {
      const existingZone = zones.value?.find((zone) => zone.id === zoneId);
      if (existingZone) {
        return existingZone;
      }
      return {
        id: zoneId,
        displayId: Number(zoneId.slice(-4)).toString(),
        name: "",
        inhabitantsAmount: 0,
        municipalityId: zoneId.slice(4).toString(),
      };
    }) as Zone[];

    initializeAreaZones(circuits.value.map((circuit) => circuit.id));
    initializeZoneColors();
    reloadInitialLayers();
    handleZoneSelection("");
  }

  function saveAreasToLs() {
    saveAreasToLS.value = true;
    canBeEdited.value = true;
    saveCircuitsToLs();
    saveZonesToLs();
    reloadZoneInhabitantAmounts();
  }

  async function refreshAreas() {
    saveAreasToLS.value = true;
    canBeEdited.value = true;

    await refreshZones({ dedupe: "defer" });
    await refreshCircuits();

    if (!circuits.value?.length) {
      return;
    }

    initializeAreaZones(circuits.value.map((circuit) => circuit.id));
    reloadInitialLayers();
    handleZoneSelection(selectedZone.value?.id ?? "");
    reloadZoneInhabitantAmounts();
  }

  async function uploadCircuits() {
    try {
      const { getAuthorizationHeaders } = useAuth();

      await $apiRequest<Zone[]>("/area-data/update-areas", {
        method: "POST",
        body: {
          zones: zones.value,
          circuits: circuits.value,
          municipalityId: selectedMunicipality.value?.id,
        },
        headers: await getAuthorizationHeaders(),
      });

      useNotifications().pushNotification({
        title: "Lagret",
        message: "Soneinndeling er lagret",
        type: "success",
      });
      hasUnsavedChanges.value = false;
    } catch (error: any) {
      useNotifications().pushNotification({
        title: "Soner oppdatering",
        message: getErrorMessage(error),
        type: "error",
      });
    }
  }

  async function submitMunicipality() {
    try {
      await uploadCircuits();

      const { getAuthorizationHeaders } = useAuth();

      await $apiRequest<Zone[]>("/area-data/submit-municipality", {
        method: "POST",
        body: {
          municipalityId: selectedMunicipality.value?.id,
          submitted: true,
        },
        headers: await getAuthorizationHeaders(),
      });

      useNotifications().pushNotification({
        title: "Sent inn",
        message: "Soneinndelingen for din kommune er nå sendt inn",
        type: "success",
      });
      hasUnsavedChanges.value = false;
      loadUserMunicipalities();
      await sendAreaSubmittedEmail();
    } catch (error: any) {
      useNotifications().pushNotification({
        title: "Kommune sending",
        message: getErrorMessage(error),
        type: "error",
      });
    }
  }

  async function eraseAreasFromLS() {
    saveAreasToLS.value = false;
    localStorage.removeItem("zones");
    localStorage.removeItem("circuits");

    circuits.value = [];

    hasUnsavedChanges.value = false;

    await refreshZones({ dedupe: "defer" });
    await refreshCircuits();
    initializeZoneColors();
    filterFetchedFeatures(circuits.value.map((circuit) => circuit.id) ?? []);
    reloadZoneInhabitantAmounts();
    handleZoneSelection(selectedZone.value?.id ?? "");
    saveAreasToLS.value = true;
  }

  function addZone() {
    if (!zones.value?.length) return;

    const newZoneDisplayId = String(
      Math.max(...zones.value.map((zone) => Number(zone.displayId))) + 1,
    );

    const municipalityId = selectedMunicipality.value?.id;
    if (!municipalityId) return;

    zones.value.push({
      id: municipalityId + newZoneDisplayId.padStart(4, "0"),
      displayId: newZoneDisplayId,
      name: "",
      inhabitantsAmount: 0,
      municipalityId,
    });

    initializeZoneColors();
    reloadInitialLayers();

    hasUnsavedChanges.value = true;
    useNotifications().pushNotification({
      title: "Ny sone",
      message: "Ny sone er lagt til",
      type: "success",
    });
  }

  function saveCircuitsToLs() {
    if (!circuits.value?.length) return;
    localStorage.setItem(
      "circuits",
      JSON.stringify(
        circuits.value?.map((circuit) => ({ ...circuit, hovered: false })),
      ),
    );
  }

  function saveZonesToLs() {
    if (!zones.value?.length) return;
    localStorage.setItem("zones", JSON.stringify(zones.value));
  }

  function checkZonesCanBeDeleted() {
    const getCanBeDeleted = (zone: Zone) => {
      if (zone.inhabitantsAmount !== 0) {
        return false;
      }
      if (circuits.value?.find((circuit) => circuit.zoneId === zone.id)) {
        return false;
      }
      return true;
    };

    return zones.value?.forEach((zone) => {
      zone.canBeDeleted = getCanBeDeleted(zone);
    });
  }

  async function sendAreaSubmittedEmail() {
    await $apiRequest("/email/send", {
      method: "POST",
      headers: await useAuth().getAuthorizationHeaders(),
      body: {
        to: "post@nabolagshelse.no",
        subject: "Soneinndeling sendt inn",
        message: `Soneinndeling for kommune nr ${selectedMunicipality.value?.id} er sendt inn.`,
      },
    });
  }

  watch(
    circuits,
    (newCircuits, oldCircuits) => {
      if (!saveAreasToLS.value) return;

      if (!newCircuits?.length || newCircuits?.length === oldCircuits?.length) {
        return;
      }

      saveCircuitsToLs();
    },
    { deep: true },
  );

  watch(
    zones,
    () => {
      if (!zones.value?.length) {
        return;
      }
      reloadZoneInhabitantAmounts();
      if (saveAreasToLS.value) {
        saveZonesToLs();
      }
    },
    { deep: true },
  );

  watch(
    [zones, circuits],
    () => {
      checkZonesCanBeDeleted();
    },
    { immediate: true, deep: true },
  );

  watch(
    () => selectedMunicipality.value?.id,
    async (newId, oldId) => {
      const lsId = localStorage.getItem("sonebyggerMunicipalityId");
      if (!newId || (newId === oldId && lsId) || lsId === newId) return;

      localStorage.setItem("sonebyggerMunicipalityId", newId);

      if (lsId && newId !== lsId) {
        await eraseAreasFromLS();
        // await refreshAreas();
      }
    },
    { immediate: true },
  );

  return {
    colorMap,
    zones,
    circuits,
    selectedZone,
    hasUnsavedChanges,
    canBeEdited,
    municipalitySubmitted,

    submitMunicipality,

    fetchZones,
    fetchCircuits,

    resetCircuitsInitial,
    uploadCircuits,

    refreshAreas,
    saveAreasToLs,
    eraseAreasFromLS,

    selectZone: handleZoneSelection,
    addZone,
    deleteZone,

    initializeZoneColors,
    initializeAreaZones,

    setAreaZone,
    setAreaHoverState,
  };
});

function validateLocalStorageData() {
  try {
    const zones = JSON.parse(localStorage.getItem("zones") || "[]");

    if (!Array.isArray(zones) || zones.length === 0) {
      throw new Error("Zones are undefined or empty.");
    }

    zonesArraySchema.parse(zones);
  } catch (error) {
    localStorage.removeItem("zones");
  }

  try {
    const circuits = JSON.parse(localStorage.getItem("circuits") || "[]");

    if (!Array.isArray(circuits) || circuits.length === 0) {
      throw new Error("Circuits are undefined or empty.");
    }

    circuitsArraySchema.parse(circuits);
  } catch (error) {
    localStorage.removeItem("circuits");
  }
}

const zoneSchema = z.object({
  id: z.string().length(8),
  name: z.string(),
});

const circuitSchema = z.object({
  id: z.string().length(8),
  name: z.string(),
  inhabitantsAmount: z.number(),
  zoneId: z.string().length(8),
  initialZoneId: z.string().length(8),
});

const zonesArraySchema = z.array(zoneSchema);

const circuitsArraySchema = z.array(circuitSchema);
