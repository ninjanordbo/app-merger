import { bbox } from "@turf/bbox";
import { featureCollection } from "@turf/helpers";
import { until } from "@vueuse/core";
import { type Feature, type FeatureCollection, type Geometry } from "geojson";
import mapboxgl, {
  Map as MapBox,
  NavigationControl,
  type ExpressionSpecification,
  type Layer,
  type LayerSpecification,
  type LngLatBoundsLike,
  type LngLatLike,
} from "mapbox-gl";
import { ref } from "vue";

import { getViewportFromBBox } from "~/helpers/getViewport";
import {
  MapTilesLayersNames,
  type MapTilesLayersNamesKey,
} from "~/utils/mapTilesUtils";

const DEFAULT_MAP_SOURCE: MapTilesLayersNamesKey = "fylker";
const DEFAULT_MAP_ZOOM = 3.25;
const NORWAY_CENTER: LngLatLike = [15, 65];

const FILL_COLOR = "#bbb";
const SELECTED_FILL_COLOR = "#333";
const LINE_COLOR = "#454545";
const HOVERED_LINE_COLOR = "#353535";

export const useMap = defineStore("map", () => {
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
      source: "",
      "source-layer": "",
      layout: {},
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          SELECTED_FILL_COLOR,
          FILL_COLOR,
        ],
        "fill-opacity": 0.3,
      },
    },
    areaBorder: {
      id: "area-border",
      type: "line",
      source: "",
      "source-layer": "",
      layout: {},
      paint: {
        "line-color": LINE_COLOR,
        "line-width": 1,
      },
    },
  };

  function initMap(container: HTMLElement) {
    if (!map.value) {
      mapboxgl.accessToken = useRuntimeConfig().public.mapboxToken;

      map.value = new MapBox({
        container,
        style: "mapbox://styles/nabolagshelse/cm1532dk201f201pj2dgqadxr",
        center: NORWAY_CENTER,
        zoom: getLayerZoom(),
        trackResize: true,
      });

      map.value?.on("style.load", () => {
        map.value?.resize();
      });

      map.value?.on("load", () => {
        if (!map.value?.hasControl(control)) {
          map.value?.addControl(control);
        }

        map.value?.addSource(
          mapSource.value,
          getLayerTilesSource(mapSource.value),
        );

        map.value?.on("mousemove", "area-fill", onMapMouseOver);
        map.value?.on("mouseleave", "area-fill", onMapMouseLeave);
        map.value?.on("click", "area-fill", onMapClick);

        until(selectedArea).toBeTruthy().then(centerOnParent);
      });
    } else {
      reattachDOMMap(map.value);
    }

    // Track window resize to resize the map
    window.addEventListener("resize", () => map.value?.resize());
  }

  function destroyMap() {
    if (!map.value) return;

    map.value.off("mousemove", "area-fill", onMapMouseOver);
    map.value.off("mouseleave", "area-fill", onMapMouseLeave);
    map.value.off("click", "area-fill", onMapClick);

    if (map.value.getLayer("area-fill")) map.value.removeLayer("area-fill");
    if (map.value.getLayer("area-border")) map.value.removeLayer("area-border");
    if (map.value.getSource(mapSource.value))
      map.value.removeSource(mapSource.value);

    map.value.remove();
    map.value = null;
    selectedArea.value = null;
    mapSource.value = DEFAULT_MAP_SOURCE;
  }

  // Ensure the map’s container is attached to the current DOM element.
  function reattachDOMMap(map: MapBox) {
    const currentContainer = document.getElementById("mapbox");
    const existingContainer = map.getContainer();

    if (
      currentContainer &&
      existingContainer.parentElement !== currentContainer
    ) {
      // Clear any content in the new container and append the existing map container.
      currentContainer.innerHTML = "";
      currentContainer.appendChild(existingContainer);
    }

    if (selectedArea.value) {
      handleAreaSelection(selectedArea.value);
    }
    // Trigger a resize to ensure the map fits its container.
    setTimeout(() => map?.resize(), 100);
  }

  function onMapClick(e: any) {
    if (e.features.length === 0) return;
    const selectedFeature: Feature<Geometry, { id: string; name: string }> =
      e.features[0];

    if (!selectedFeature.id) return;

    const feature = {
      id: selectedFeature.properties.id,
      name: selectedFeature.properties?.name,
    };

    handleAreaSelection(feature);
  }

  function setMapSourceLayer(
    source: MapTilesLayersNamesKey,
    options: { force?: boolean } = { force: false },
  ) {
    if (source === mapSource.value && !options.force) return;

    removeInitialLayers();
    removeHoverLayerIfExists();

    map.value?.removeSource(mapSource.value);

    mapSource.value = source;

    map.value?.addSource(mapSource.value, getLayerTilesSource(mapSource.value));

    setMapSourceZoomBounds();

    handleAreaSelection(
      source === "hele_landet" ? { id: "1", name: "Norge" } : null,
    );
    filterBorderById("");

    reloadInitialLayers();
  }

  function setMapSourceZoomBounds() {
    const zoomOptions = mapLayersZooms.get(mapSource.value);
    map.value?.setMinZoom(zoomOptions?.minZoom);
    map.value?.setMaxZoom(zoomOptions?.maxZoom);
  }

  function onMapMouseOver(e: any) {
    if (e.features.length === 0) return;
    const currentFeatureId = e.features[0].id;

    if (hoveredAreaId.value === currentFeatureId) return;
    hoveredAreaId.value = currentFeatureId;

    removeHoverLayerIfExists();
    addHoverLayer(currentFeatureId);
  }

  function onMapMouseLeave() {
    removeHoverLayerIfExists();
    hoveredAreaId.value = null;
  }

  function filterBorderById(parentId: string) {
    if (mapSource.value === "hele_landet") {
      parentId = "";
    }

    const filter = [
      "==",
      ["slice", ["get", "id"], 0, parentId.length],
      parentId,
    ] as ExpressionSpecification;

    mapLayers.areaBorder.paint = {
      "line-color": LINE_COLOR,
      "line-width": 1,
      "line-opacity": ["case", filter, 1, 0.2],
    };
  }

  function getParentAreaId(areaId: string) {
    switch (mapSource.value) {
      case "fylker":
        return "";
      case "kommuner":
        return areaId.slice(0, 2);
      case "soner":
      case "grunnkretser":
        return areaId.slice(0, 4);

      default:
        return "";
    }
  }

  async function handleAreaSelection(
    feature: { id: string | number; name: string } | null,
    options: {
      centerOnFeature?: boolean;
      zoom?: number;
    } = {
      centerOnFeature: true,
    },
  ) {
    if (selectedArea.value?.id) {
      toggleAreaSelection(selectedArea.value.id, false);
    }

    if (!feature) {
      selectedArea.value = null;
      return;
    }

    selectedArea.value = feature;

    const featureState = map.value?.getFeatureState({
      source: mapSource.value,
      sourceLayer: mapSource.value,
      id: selectedArea.value.id!,
    });

    toggleAreaSelection(selectedArea.value.id, !featureState?.selected);

    // Getting the selected feature object from the map
    let selectedFeature = map.value?.querySourceFeatures(mapSource.value, {
      sourceLayer: mapSource.value,
      filter: ["==", ["id"], Number(selectedArea.value.id)],
    })[0];

    // In case feature wasn't found on current viewbox
    if (!selectedFeature) {
      await centerOnParent();
      await waitForIdle();

      selectedFeature = map.value?.querySourceFeatures(mapSource.value, {
        sourceLayer: mapSource.value,
        filter: ["==", ["id"], Number(selectedArea.value.id)],
      })[0];
    }

    selectedArea.value = {
      id: selectedArea.value.id,
      name: selectedFeature?.properties?.name || "",
    };

    if (selectedFeature && options.centerOnFeature) {
      const areaBbox = bbox(selectedFeature);

      areaBbox &&
        map.value?.flyTo({
          center: getViewportFromBBox(
            areaBbox,
            map.value?.getCanvas().width,
            map.value?.getCanvas().height,
          ),
          zoom: options.zoom || map.value.getZoom(),
        });
    }

    const parentAreaId = getParentAreaId(selectedArea.value.id.toString());
    filterBorderById(parentAreaId);
    reloadInitialLayers();
  }

  function toggleAreaSelection(areaId: string | number, selected: boolean) {
    return map.value?.setFeatureState(
      {
        source: mapSource.value,
        sourceLayer: mapSource.value,
        id: areaId,
      },
      { selected },
    );
  }

  function removeInitialLayers() {
    Object.values(mapLayers).forEach((layer: Layer) => {
      removeLayerIfExists(layer.id);
    });
  }

  function reloadInitialLayers() {
    Object.values(mapLayers).forEach((layer) => {
      removeLayerIfExists(layer.id);
      layer.source = mapSource.value;
      layer["source-layer"] = mapSource.value;
      map.value?.addLayer(layer);
    });
  }

  function removeLayerIfExists(layerId: string) {
    if (map.value?.getLayer(layerId)) {
      return map.value?.removeLayer(layerId);
    }
  }

  function addHoverLayer(featureId: string) {
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
      filter: ["==", ["id"], featureId],
    });
  }

  function removeHoverLayerIfExists() {
    if (map.value?.getLayer("area-fill-hover")) {
      return map.value?.removeLayer("area-fill-hover");
    }
  }

  function getLayerZoom(layer?: MapTilesLayersNamesKey) {
    switch (layer || mapSource.value) {
      case "fylker":
        return 3.25;
      case "kommuner":
        return 4.5;
      case "grunnkretser":
      case "soner":
        return 7;

      default:
        return DEFAULT_MAP_ZOOM;
    }
  }

  function waitForMapLoad(): Promise<void> {
    return new Promise((resolve) => {
      if (map.value?.loaded()) {
        resolve();
      } else {
        map.value?.once("load", () => resolve());
      }
    });
  }

  async function withMapLoaded(fn: Function) {
    await until(map).toBeTruthy();
    await waitForMapLoad();
    setTimeout(fn, 200);
  }

  function syncMapCard() {
    map.value?.resize();
  }

  const isCenteringOnParent = ref(false);
  function centerOnParent() {
    if (!selectedArea.value || isCenteringOnParent.value) return;
    isCenteringOnParent.value = true;

    const parentSourceFeature = getParentFeatureId(
      mapSource.value,
      selectedArea.value?.id || "",
    );
    const parentSource: MapTilesLayersNamesKey =
      MapTilesLayersNames[mapSource.value] > MapTilesLayersNames.kommuner
        ? "kommuner"
        : "fylker";

    const isParentLayerRequired =
      MapTilesLayersNames[parentSource] < MapTilesLayersNames[mapSource.value];

    if (isParentLayerRequired) {
      map.value?.addSource(parentSource, {
        type: "vector",
        url: `mapbox://nabolagshelse.${parentSource}`,
      });
    }

    map.value?.setMinZoom(0);
    map.value?.setZoom(getLayerZoom("fylker"));
    map.value?.setCenter(NORWAY_CENTER);

    const temporaryLayerName = "tmp-layer";
    if (!map.value?.getLayer(temporaryLayerName)) {
      map.value?.addLayer({
        id: temporaryLayerName,
        type: "line",
        source: parentSource,
        "source-layer": parentSource,
        paint: {
          "line-opacity": 0,
        },
      });
    }

    return new Promise<void>((resolve) => {
      const onSourceData = (e: any) => {
        if (!parentSource) return;
        if (
          e.sourceId !== parentSource ||
          !map.value?.getLayer(temporaryLayerName)
        )
          return;

        const features = map.value?.querySourceFeatures(parentSource, {
          sourceLayer: parentSource,
        });

        if (!features || !features.length) {
          return;
        }

        const parentFeature = features.find(
          (feature) =>
            feature.properties?.id.toString() ===
            (parentSourceFeature || selectedArea.value?.id),
        );

        if (!parentFeature) return;

        goToFeaturesCenter(featureCollection([parentFeature]));
        map.value?.off("sourcedata", onSourceData);
        map.value?.removeLayer(temporaryLayerName);

        if (isParentLayerRequired) {
          map.value?.removeSource(parentSource);
        }
        resolve();
        isCenteringOnParent.value = false;
        setMapSourceZoomBounds();
      };

      map.value?.on("sourcedata", onSourceData);
    });
  }

  function goToFeaturesCenter(features: FeatureCollection) {
    const bounds = bbox(features) as LngLatBoundsLike;

    map.value?.fitBounds(bounds, {
      padding: { bottom: 100, top: 50, left: 50, right: 50 },
    });
  }

  function waitForIdle(timeoutMs = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const m = map.value;
      if (!m) return reject(new Error("map is not defined"));

      if (m.loaded() && m.isStyleLoaded() && m.areTilesLoaded()) {
        return requestAnimationFrame(() => resolve());
      }

      const onIdle = () => {
        clearTimeout(timer);
        resolve();
      };

      m.once("idle", onIdle);

      const timer = setTimeout(() => {
        m.off("idle", onIdle);
        reject(new Error("waitForIdle: timeout"));
      }, timeoutMs);
    });
  }

  return {
    initMap,
    destroyMap,
    onMapMouseOver,
    onMapMouseLeave,
    onMapClick,
    handleAreaSelection,
    setMapSourceLayer,
    withMapLoaded,
    syncMapCard,
    waitForIdle,

    map,
    mapSource,
    hoveredAreaId,
    selectedArea,
  };
});

function getParentFeatureId(
  mapSource: MapTilesLayersNamesKey,
  areaId: string | number,
): string | null {
  switch (mapSource) {
    case "kommuner":
      return areaId.toString().slice(0, 2); // First two digits for fylke
    case "soner":
    case "grunnkretser":
      return areaId.toString().slice(0, 4); // First four digits for kommune
    default:
      return null;
  }
}
