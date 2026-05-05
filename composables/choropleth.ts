import { bbox } from "@turf/bbox";
import { featureCollection } from "@turf/helpers";
import { until } from "@vueuse/core";
import { type FeatureCollection } from "geojson";
import mapboxgl, {
  Map as MapBox,
  NavigationControl,
  type ExpressionSpecification,
  type Layer,
  type LayerSpecification,
  type LngLatBoundsLike,
  type LngLatLike,
} from "mapbox-gl";

import { areaDataIndicators } from "~/data/indicators";
import { keysDenominators } from "~/data/keyDenominators";
import { PATTERN_SVG, registerPatternFromSvg } from "~/helpers/mapSvgPattern";
import { getAreasByParent } from "~/queries/fetchAreasByParent";
import { getCalculationFunction } from "~/utils/geoData/getCardData";
import { fetchAreaDataById } from "~/utils/geoData/getGeodata";
import { MapTilesLayersNames } from "~/utils/mapTilesUtils";

const DEFAULT_MAP_SOURCE: MapTilesLayersNamesKey = "soner";
const DEFAULT_MAP_ZOOM = 4.5;
const NORWAY_CENTER: LngLatLike = [15, 65];
const GRADE_COLORS = [
  "#D5C9DD",
  "#BAA5C9",
  "#A082B7",
  "#885FA6",
  "#6E448E",
  "#59377A",
  "#43285C",
];

export const useChoropleth = () => {
  const { selectedArea, mapSource: selectedParentSource } =
    storeToRefs(useMap());
  const selectedParentAreaId = computed(() => {
    return selectedArea.value?.id.toString() || null;
  });
  const mapSource = ref<MapTilesLayersNamesKey>(DEFAULT_MAP_SOURCE);
  const selectedAreaDataField = ref<string | null>(null);
  const dataGrades = ref<number[]>([]);
  const selectedChartMode = ref<"numeric" | "percent">("numeric");

  const map = shallowRef<MapBox | null>(null);
  const navigationControl = new NavigationControl();
  const hoverInfo = new HoverInfoControl(
    () => mapSource.value,
    () => selectedAreaDataField.value!,
    () => selectedChartMode.value,
  );
  const legend = new LegendControl(
    () => dataGrades.value,
    GRADE_COLORS,
    selectedAreaDataField.value!,
    selectedChartMode.value,
  );

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
        "fill-color": "#fff",
        "fill-outline-color": "black",
      },
    },
    areaBorder: {
      id: "area-border",
      type: "line",
      source: "",
      "source-layer": "",
      layout: {},
      paint: {
        "line-color": "black",
        "line-width": 0.5,
      },
    },
  };

  function initMap(mapId?: string) {
    mapboxgl.accessToken = useRuntimeConfig().public.mapboxToken;

    map.value = new MapBox({
      container: mapId || "choropleth-map",
      style: "mapbox://styles/nabolagshelse/cm1532dk201f201pj2dgqadxr",
      center: map.value?.getCenter() || NORWAY_CENTER,
      zoom: getLayerZoom(mapSource.value),
      trackResize: true,
      preserveDrawingBuffer: true,
    });

    map.value?.on("style.load", () => {
      map.value?.resize();
    });

    window.addEventListener("resize", () => map.value?.resize());

    map.value?.on("load", () => {
      if (!map.value?.hasControl(navigationControl)) {
        map.value?.addControl(navigationControl, "top-left");
      }
      if (!map.value?.hasControl(hoverInfo)) {
        map.value?.addControl(hoverInfo, "top-left");
      }
      if (!map.value?.hasControl(legend)) {
        map.value?.addControl(legend, "top-right");
      }

      addNoDataPattern();
    });
  }

  function setMapSourceLayer(source: MapTilesLayersNamesKey) {
    removeInitialLayers();
    removeLayerIfExists("area-no-data");
    removeLayerIfExists("area-fill-hover");

    if (map.value?.getSource(mapSource.value)) {
      map.value?.removeSource(mapSource.value);
    }

    mapSource.value = source;

    map.value?.addSource(mapSource.value, getLayerTilesSource(mapSource.value));

    setMapSourceZoomBounds();

    reloadInitialLayers();

    const onSourceData = async (e: any) => {
      if (
        e.sourceId === mapSource.value &&
        e.isSourceLoaded &&
        map.value?.getLayer("area-fill")
      ) {
        map.value.off("sourcedata", onSourceData);

        if (selectedParentAreaId.value && selectedAreaDataField.value) {
          await setAreasDataFields(selectedAreaDataField.value);
        }
      }
    };

    map.value?.on("sourcedata", onSourceData);
  }

  async function setParentArea(
    areaLayer: MapTilesLayersNamesKey,
    areaId: string,
  ) {
    if (!areaLayer) return;

    await waitForIdle();

    selectedParentSource.value = areaLayer;

    await setMapFiltersById(areaId);

    await centerOnParent();
  }

  async function setAreasDataFields(fieldName: string): Promise<void> {
    await waitForIdle();

    const parentName = selectedParentSource.value;
    const layerName = mapSource.value;

    if (!selectedParentAreaId.value) return;

    if (MapTilesLayersNames[parentName] >= MapTilesLayersNames[layerName])
      return;

    const denominatorKeys = keysDenominators.get(fieldName);

    const features = await getAreasByParent(
      selectedParentAreaId.value,
      parentName,
      layerName,
    );

    if (!features || !features.length) {
      // eslint-disable-next-line no-console
      console.warn("No features found for the selected area.");
      return;
    }

    selectedAreaDataField.value = fieldName;
    const featureIds = features.map((f) => f.id);

    const areaData = await getAreasData(featureIds, fieldName);

    const calc = getCalculationFunction(selectedChartMode.value);

    const areaDataValues = areaData.map((data) => {
      const value = !Number.isFinite(data.attributes[fieldName])
        ? null
        : calc(data.attributes, [fieldName], denominatorKeys ?? [])[0];

      return {
        id: data.id,
        [fieldName]: value,
      };
    });

    const maxDataValue = areaDataValues.reduce<number>(
      (max, f) => Math.max(max, toFiniteNumber(f[fieldName])),
      0,
    );

    const minDataValue = areaDataValues.reduce<number>((min, f) => {
      if (typeof f[fieldName] !== "number") return min;
      return Math.min(min, toFiniteNumber(f[fieldName]));
    }, maxDataValue);

    updateAreaFill(minDataValue, maxDataValue);
    updateLegendControl();

    for (const feature of areaDataValues) {
      map.value?.setFeatureState(
        {
          source: layerName,
          sourceLayer: layerName,
          id: feature.id,
        },
        { [fieldName]: feature[fieldName] },
      );
    }

    updateNoDataLayer();
  }

  function toFiniteNumber(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function getAreasData(areaIds: string[], dataField: string) {
    const fieldsToFetch = areaDataIndicators
      .filter((indicator) => indicator.keys.includes(dataField))
      .map((indicator) => ({
        name: dataField,
        indicatorSource: indicator.indicatorSource,
        aggregationMethod: indicator.aggregationMethod,
      }));

    return fetchAreaDataById(mapSource.value, areaIds, [...fieldsToFetch]).then(
      (res) =>
        res.features.map((feature) => {
          Object.keys(feature.attributes).forEach((key) => {
            if (typeof feature.attributes[key] !== "number") return;

            const numberField = toNumberOrNull(feature.attributes[key]);
            if (numberField != null) {
              feature.attributes[key] = Math.floor(numberField * 100) / 100;
            }
          });

          return feature;
        }),
    );
  }

  async function setMapFiltersById(parentId: string) {
    const filter = await getLayerFilter(parentId);
    Object.values(mapLayers).forEach((layer) => {
      layer.filter = filter;
      if (map.value?.getLayer(layer.id)) {
        map.value.setFilter(layer.id, filter);
      }
    });
    updateNoDataLayer();
  }

  async function getLayerFilter(
    areaId: string,
  ): Promise<ExpressionSpecification> {
    if (selectedParentSource.value === "hele_landet") {
      return ["all"];
    }

    // Just for zones, where we can't filter them by id, but have to query zone's circuit ids
    if (selectedParentSource.value === "soner") {
      const idsMap = await getSublayerIds(selectedParentSource.value, [areaId]);
      const ids = Array.from(idsMap.values()).flat();
      return ["match", ["get", "id"], ids, true, false];
    }

    return ["==", ["slice", ["get", "id"], 0, areaId.length], areaId];
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
    updateNoDataLayer();
  }

  function removeLayerIfExists(layerId: string) {
    if (map.value?.getLayer(layerId)) {
      return map.value?.removeLayer(layerId);
    }
  }

  function goToFeaturesCenter(features: FeatureCollection, zoom?: number) {
    const bounds = bbox(features) as LngLatBoundsLike;

    const cameraOptions: { [key: string]: any } = {
      padding: { bottom: 100, top: 50, left: 50, right: 200 },
    };

    // Can't use this in the object itself because of mapbox bug with undefined zoom
    if (zoom) cameraOptions.zoom = zoom;

    map.value?.fitBounds(bounds, cameraOptions);
  }

  function setMapSourceZoomBounds() {
    const zoomOptions = mapLayersZooms.get(mapSource.value);
    map.value?.setMinZoom(zoomOptions?.minZoom);
    map.value?.setMaxZoom(zoomOptions?.maxZoom);
  }

  function centerOnParent() {
    console.log(
      "center on parent",
      selectedParentAreaId.value,
      selectedParentSource.value,
      mapSource.value,
    );
    if (
      !selectedParentAreaId.value ||
      !selectedParentSource.value ||
      selectedParentSource.value === mapSource.value
    )
      return;

    if (selectedParentSource.value === "soner") {
      const { apiUrl } = useRuntimeConfig().public;
      map.value?.addSource(selectedParentSource.value, {
        type: "vector",
        tiles: [`${apiUrl}/tiles/{z}/{x}/{y}.pbf`],
      });
    } else {
      map.value?.addSource(selectedParentSource.value, {
        type: "vector",
        url: `mapbox://nabolagshelse.${selectedParentSource.value}`,
      });
    }

    map.value?.setMinZoom(0);
    map.value?.setZoom(getLayerMinZoom("fylker"));
    map.value?.setCenter(NORWAY_CENTER);

    const temporaryLayerName = "tmp-layer";
    map.value?.addLayer({
      id: temporaryLayerName,
      type: "line",
      source: selectedParentSource.value,
      "source-layer": selectedParentSource.value,
      paint: {
        "line-opacity": 0,
      },
    });

    return new Promise<void>((resolve) => {
      const onSourceData = (e: any) => {
        if (!selectedParentSource.value) return;
        if (
          e.sourceId !== selectedParentSource.value ||
          !map.value?.getLayer(temporaryLayerName)
        )
          return;

        const features = map.value?.querySourceFeatures(
          selectedParentSource.value,
          {
            sourceLayer: selectedParentSource.value,
          },
        );

        if (!features || !features.length) {
          return;
        }

        const parentFeature = features.find(
          (feature) =>
            feature.properties?.id.toString() ===
            selectedParentAreaId.value?.toString(),
        );

        if (!parentFeature) return;

        goToFeaturesCenter(featureCollection([parentFeature]));
        map.value?.off("sourcedata", onSourceData);
        map.value?.removeLayer(temporaryLayerName);
        map.value?.removeSource(selectedParentSource.value);
        resolve();
        setMapSourceZoomBounds();
      };

      map.value?.on("sourcedata", onSourceData);
    });
  }

  function updateAreaFill(minValue = 0, maxValue = 100000) {
    if (!selectedAreaDataField.value || !map.value) return;
    if (!map.value.getSource(mapSource.value)) return;

    selectedChartMode.value === "percent"
      ? generateGradesPercent(minValue, maxValue, {
          gradesAmount: GRADE_COLORS.length,
          hardMin: 0,
          hardMax: 100,
        })
      : generateGradeSteps(minValue, maxValue, GRADE_COLORS.length);

    const areaFillPaint = dataGrades.value.flatMap((value, index) => {
      return [value, GRADE_COLORS[index]];
    });

    mapLayers.areaFill.paint = {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["coalesce", ["feature-state", selectedAreaDataField.value], 0],
        ...areaFillPaint,
      ],
      "fill-outline-color": "black",
    } as LayerSpecification["paint"];

    removeLayerIfExists("area-fill");
    map.value.addLayer(mapLayers.areaFill, "area-border");
  }

  function updateLegendControl() {
    if (!map.value) return;

    legend.updateLegendData(
      () => dataGrades.value,
      selectedChartMode.value,
      GRADE_COLORS,
      selectedAreaDataField.value!,
    );
  }

  function generateGradeSteps(
    minValue: number,
    maxValue: number,
    gradesAmount: number,
  ) {
    if (
      !Number.isFinite(minValue) ||
      !Number.isFinite(maxValue) ||
      gradesAmount < 2
    ) {
      dataGrades.value = Array.from({ length: gradesAmount }, (_, i) => i + 1);
      return;
    }

    const niceMin = niceValue(minValue, "floor");
    const niceMax = niceValue(maxValue, "floor");
    const rawStep = (niceMax - niceMin) / (gradesAmount - 1);
    const step = niceValue(rawStep, "floor") || 1;
    const start = Math.floor(niceMin / step) * step;

    const arr = Array.from(
      { length: gradesAmount },
      (_, i) => start + i * step,
    );

    const decimals =
      step >= 1
        ? 0
        : step >= 0.1
          ? 1
          : step >= 0.01
            ? 2
            : Math.max(0, 3 - Math.floor(Math.log10(step)));

    dataGrades.value = arr.map((x) => Number(x.toFixed(decimals)));
  }

  const ceilTo = (x: number, step: number) => Math.ceil(x / step) * step;
  const floorTo = (x: number, step: number) => Math.floor(x / step) * step;

  function pickStep(
    minValue: number,
    maxValue: number,
    gradesAmount: number,
    candidates: number[],
    hardMin = 0,
    hardMax = 100,
  ): number {
    let best = candidates[0];
    let bestScore = Number.POSITIVE_INFINITY;

    for (const s of candidates) {
      const lo = Math.max(hardMin, floorTo(minValue, s));
      const hi = Math.min(hardMax, ceilTo(maxValue, s));
      const count = Math.floor((hi - lo) / s) + 1;

      const diff = Math.abs(count - gradesAmount);
      const preferPenalty = count < gradesAmount ? 0.25 : 0;
      const score = diff + preferPenalty;

      if (score < bestScore) {
        bestScore = score;
        best = s;
      }
    }
    return best;
  }

  function generateGradesPercent(
    minValue: number,
    maxValue: number,
    opts: {
      gradesAmount?: number;
      step?: number;
      allowedSteps?: number[];
      hardMin?: number;
      hardMax?: number;
      decimals?: number;
    } = {},
  ) {
    const hardMin = Number.isFinite(opts.hardMin!) ? opts.hardMin! : 0;
    const hardMax = Number.isFinite(opts.hardMax!) ? opts.hardMax! : 100;

    // клампим вход
    const dataMin = Math.max(hardMin, Math.min(minValue, maxValue));
    const dataMax = Math.min(hardMax, Math.max(minValue, maxValue));

    // шаг
    let step = opts.step;
    if (!(step! > 0)) {
      const candidates = (
        opts.allowedSteps && opts.allowedSteps.length
          ? opts.allowedSteps.slice()
          : [0.5, 1, 2, 2.5, 5, 10, 12.5, 20, 25]
      ) // типичные «красивые» для процентов
        .sort((a, b) => a - b);

      const ga = Math.max(2, opts.gradesAmount ?? 7);
      step = pickStep(dataMin, dataMax, ga, candidates, hardMin, hardMax);
    }

    // красивый низ/верх кратно шагу, в пределах харда
    const lo = Math.max(hardMin, floorTo(dataMin, step!));
    let hi = Math.min(hardMax, ceilTo(dataMax, step!));

    // если передан gradesAmount — попробуем подогнать hi, чтобы количество отсечек совпало
    const gradesAmount = Math.max(
      2,
      opts.gradesAmount ?? Math.floor((hi - lo) / step!) + 1,
    );
    const neededRange = (gradesAmount - 1) * step!;
    hi = Math.min(hardMax, lo + neededRange);

    // собираем линейку
    const grades = Array.from(
      { length: gradesAmount },
      (_, i) => lo + i * step!,
    );

    // округление для вывода: если не задано — по величине шага
    const d = Number.isFinite(opts.decimals!)
      ? opts.decimals!
      : step! >= 1
        ? 0
        : step! >= 0.1
          ? 1
          : 2;

    dataGrades.value = grades.map((v) => Number(v.toFixed(d)));
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

  function addNoDataPattern() {
    if (!map.value) return;
    registerPatternFromSvg(map.value!, "no-data", PATTERN_SVG, 32, 4);
  }

  async function updateNoDataLayer() {
    if (!map.value || !selectedAreaDataField.value) return;
    if (!map.value.getSource(mapSource.value)) return;

    const layerId = "area-no-data";
    removeLayerIfExists(layerId);

    const parentFilter = selectedParentAreaId.value
      ? await getLayerFilter(selectedParentAreaId.value)
      : undefined;

    map.value.addLayer(
      {
        id: layerId,
        type: "fill",
        source: mapSource.value,
        "source-layer": mapSource.value,
        paint: {
          "fill-pattern": "no-data",
          "fill-opacity": [
            "case",
            [
              "==",
              ["typeof", ["feature-state", selectedAreaDataField.value]],
              "null",
            ],
            1,
            0,
          ],
        },
        filter: parentFilter,
      },
      "area-border",
    );
  }

  async function withMapLoaded(fn: Function) {
    await until(map).toBeTruthy();
    await waitForMapLoad();
    setTimeout(fn, 200);
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

  function syncMapCard() {
    map.value?.resize();
  }

  return {
    initMap,
    setMapSourceLayer,

    setParentArea,

    selectedParentAreaId,
    centerOnParent,
    setAreasDataFields,
    withMapLoaded,
    selectedAreaDataField,
    waitForIdle,
    syncMapCard,

    map,
    mapSource,
    mapLayers,
    chartMode: selectedChartMode,
  };
};

function getLayerZoom(source: MapTilesLayersNamesKey) {
  switch (source) {
    case "fylker":
      return 3.25;
    case "kommuner":
      return 4.5;
    case "soner":
    case "grunnkretser":
      return 8;
    default:
      return DEFAULT_MAP_ZOOM;
  }
}

function getLayerMinZoom(source: MapTilesLayersNamesKey) {
  switch (source) {
    case "fylker":
      return 3.1;
    case "kommuner":
      return 3.1;
    case "soner":
    case "grunnkretser":
      return 5.1;
    default:
      return DEFAULT_MAP_ZOOM;
  }
}
