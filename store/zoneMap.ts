import { bbox } from "@turf/bbox";
import { featureCollection } from "@turf/helpers";
import { type FeatureCollection } from "geojson";
import mapboxgl, {
  Map as MapBox,
  NavigationControl,
  type ExpressionSpecification,
  type FilterSpecification,
  type Layer,
  type LayerSpecification,
  type LngLatBoundsLike,
  type LngLatLike,
} from "mapbox-gl";

const DEFAULT_MAP_SOURCE: MapTilesLayersNamesKey = "grunnkretser";
const DEFAULT_MAP_ZOOM = 4.5;
const NORWAY_CENTER: LngLatLike = [15, 65];

const HOVERED_LINE_COLOR = "#fff";

export const useZoneMap = defineStore("zoneMap", () => {
  const map = shallowRef<MapBox | null>(null);
  const mapSource = ref<MapTilesLayersNamesKey>(DEFAULT_MAP_SOURCE);
  const selectedArea = ref<{ id: string | number; name: string } | null>(null);
  const hoveredAreaId = ref<string | null>(null);
  const control = new NavigationControl();
  const mapLayers: {
    areaFill: LayerSpecification;
    areaBorder: LayerSpecification;
  } = {
    areaFill: {
      id: "area-fill",
      type: "fill",
      source: mapSource.value,
      "source-layer": mapSource.value,
      layout: {},
      paint: {
        "fill-color": "rgba(0,0,0,0)",
        "fill-opacity": 0.7,
      },
    },
    areaBorder: {
      id: "area-border",
      type: "line",
      source: mapSource.value,
      "source-layer": mapSource.value,
      layout: {},
      paint: {
        "line-color": "black",
        "line-width": 0.5,
      },
    },
  };
  const { selectedMunicipality } = storeToRefs(useAuth());

  function initMap(container: HTMLElement) {
    mapboxgl.accessToken = useRuntimeConfig().public.mapboxToken;

    map.value = new MapBox({
      container,
      style: "mapbox://styles/nabolagshelse/cm1532dk201f201pj2dgqadxr",
      center: map.value?.getCenter() || NORWAY_CENTER,
      zoom: getLayerZoom(mapSource.value),
      trackResize: true,
    });

    map.value?.on("style.load", () => {
      map.value?.resize();
    });

    window.addEventListener("resize", () => map.value?.resize());

    map.value?.on("load", async () => {
      if (!map.value?.hasControl(control)) {
        map.value?.addControl(control);
      }

      await centerMapOnMunicipality();

      map.value?.addSource(mapSource.value, {
        type: "vector",
        url: `mapbox://nabolagshelse.${mapSource.value}`,
      });

      // Forced to do this, since zones selection store might not be initialized outside
      const { initializeZoneColors: initinializeZoneColors } =
        useZoneSelection();
      const { circuits } = storeToRefs(useZoneSelection());

      initinializeZoneColors();
      addInitialLayers();

      let isCircuitFiltered = false;
      watch(
        circuits,
        (newCircuits, _oldCircuits) => {
          if (!newCircuits?.length || isCircuitFiltered) return;

          const circuitIds = newCircuits.map((item) => item.id);
          filterFetchedFeatures(circuitIds);
          isCircuitFiltered = true;
        },
        { immediate: true, deep: true },
      );

      map.value?.on("mousemove", "area-fill", onMapMouseOver);
      map.value?.on("mouseleave", "area-fill", onMapMouseLeave);
    });
  }

  function destroyMap() {
    if (!map.value) return;

    map.value.off("mousemove", "area-fill", onMapMouseOver);
    map.value.off("mouseleave", "area-fill", onMapMouseLeave);

    if (map.value.getLayer("area-fill")) map.value.removeLayer("area-fill");
    if (map.value.getLayer("area-border")) map.value.removeLayer("area-border");

    map.value.remove();
    map.value = null;
  }

  function setMapSourceLayer(source: MapTilesLayersNamesKey) {
    if (source === mapSource.value) return;

    removeInitialLayers();
    removeLayerIfExists("area-fill-hover");

    map.value?.removeSource(mapSource.value);

    mapSource.value = source;
    map.value?.addSource(mapSource.value, {
      type: "vector",
      url: `mapbox://nabolagshelse.${mapSource.value}`,
    });

    addInitialLayers();

    map.value?.flyTo({
      zoom: getLayerZoom(mapSource.value),
    });

    selectedArea.value = null;
  }

  function onMapMouseOver(e: any) {
    if (!e.features || e.features.length === 0) return;
    const currentFeatureId = e.features[0].id;

    if (hoveredAreaId.value === currentFeatureId) return;
    if (hoveredAreaId.value) {
      useZoneSelection().setAreaHoverState(hoveredAreaId.value, false);
    }
    hoveredAreaId.value = currentFeatureId;

    hoverMapArea(currentFeatureId);
    if (hoveredAreaId.value) {
      useZoneSelection().setAreaHoverState(hoveredAreaId.value, true);
    }
  }

  function onMapMouseLeave() {
    removeLayerIfExists("area-fill-hover");
    if (hoveredAreaId.value) {
      useZoneSelection().setAreaHoverState(hoveredAreaId.value, false);
    }
    hoveredAreaId.value = null;
  }

  function hoverMapArea(featureId: string) {
    removeLayerIfExists("area-fill-hover");
    addHoverLayer(Number(featureId));
  }

  function filterFetchedFeatures(featureIds: string[]) {
    removeLayerIfExists("area-fill-hover");

    setMapFiltersByIds(featureIds);

    // Forced to do this, since zones selection store might not be initialized outside
    useZoneSelection().initializeAreaZones(featureIds);
    reloadInitialLayers();
  }

  function setMapFiltersByIds(ids: string[]) {
    const filter = [
      "match",
      ["id"],
      ids.map(Number),
      true,
      false,
    ] as ExpressionSpecification;

    Object.values(mapLayers).forEach((layer) => {
      layer.filter = filter;
    });

    return map.value;
  }

  function addInitialLayers() {
    Object.values(mapLayers).forEach((layer) => {
      map.value?.addLayer(layer);
    });
  }

  function removeInitialLayers() {
    Object.values(mapLayers).forEach((layer: Layer) => {
      removeLayerIfExists(layer.id);
    });
  }

  function reloadInitialLayers() {
    Object.values(mapLayers).forEach((layer) => {
      removeLayerIfExists(layer.id);
      map.value?.addLayer(layer);
    });
  }

  function removeLayerIfExists(layerId: string) {
    if (map.value?.getLayer(layerId)) {
      return map.value?.removeLayer(layerId);
    }
  }

  function addHoverLayer(featureId: number) {
    return map.value?.addLayer({
      id: "area-fill-hover",
      type: "line",
      source: mapSource.value,
      "source-layer": mapSource.value,
      layout: {},
      paint: {
        "line-color": HOVERED_LINE_COLOR,
        "line-width": 2,
      },
      filter: ["==", ["id"], featureId] as FilterSpecification,
    });
  }

  function goToFeaturesCenter(features: FeatureCollection) {
    // Forced to use "as" since center.coordinates: Position returns as number[]
    const bounds = bbox(features) as LngLatBoundsLike;
    map.value?.fitBounds(bounds, {
      padding: {
        bottom: 20,
        top: 20,
        left: 20,
        right: 20,
      },
    });
  }

  function centerMapOnMunicipality() {
    const municipalityLayerName = "kommuner";

    map.value?.addSource(municipalityLayerName, {
      type: "vector",
      url: `mapbox://nabolagshelse.${municipalityLayerName}`,
    });
    map.value?.setZoom(getLayerZoom("fylker"));
    map.value?.setCenter(NORWAY_CENTER);

    const temporaryLayerName = "tmp-layer";
    map.value?.addLayer({
      id: temporaryLayerName,
      type: "line",
      source: municipalityLayerName,
      "source-layer": municipalityLayerName,
      paint: {
        "line-opacity": 0,
      },
    });

    return new Promise<void>((resolve) => {
      const onSourceData = (e: any) => {
        if (
          e.sourceId !== municipalityLayerName ||
          !map.value?.getLayer(temporaryLayerName)
        )
          return;

        const features = map.value?.querySourceFeatures(municipalityLayerName, {
          sourceLayer: municipalityLayerName,
        });

        if (!features || !features.length) {
          return;
        }

        const municipalityFeature = features.find(
          (feature) =>
            feature.properties?.id.toString() ===
            selectedMunicipality.value?.id.toString(),
        );

        if (!municipalityFeature) return;

        goToFeaturesCenter(featureCollection([municipalityFeature]));
        map.value?.off("sourcedata", onSourceData);
        map.value?.removeLayer(temporaryLayerName);
        map.value?.removeSource(municipalityLayerName);
        resolve();
      };

      map.value?.on("sourcedata", onSourceData);
    });
  }

  return {
    initMap,
    destroyMap,
    onMapMouseOver,
    onMapMouseLeave,
    setMapFiltersByIds,
    setMapSourceLayer,
    filterFetchedFeatures,
    hoverMapArea,
    reloadInitialLayers,

    map,
    mapSource,
    mapLayers,
    hoveredAreaId,
    selectedArea,
  };
});

function getLayerZoom(source: MapTilesLayersNamesKey) {
  switch (source) {
    case "fylker":
      return 3.25;
    case "kommuner":
      return 4.5;
    case "grunnkretser":
      return 7;
    default:
      return DEFAULT_MAP_ZOOM;
  }
}
