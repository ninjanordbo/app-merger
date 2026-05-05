<template>
  <div class="relative h-full w-full">
    <div
      :class="[
        'absolute left-0 top-0 z-10 h-full w-full items-center justify-center bg-gray-200 text-center text-lg',
        isMapBlocked ? 'flex opacity-100' : 'hidden opacity-0',
      ]"
    >
      <div class="-translate-y-1/4 p-5">
        <h3 class="text-xl">Data ikke tilgjengelig!</h3>
        Det finnes ikke data for dette geografiske nivået. Om du ønsker å se
        data for denne indikatoren, må du velge et høyere geografisk nivå i
        hovedkartet.
      </div>
    </div>

    <div :id="mapId" ref="containerEl" class="h-full w-full" />
  </div>
</template>

<script lang="ts" setup>
import { areaDataIndicators } from "~/data/indicators";
import {
  mapTilesLayers,
  MapTilesLayersNames,
  type MapTilesLayersNamesKey,
} from "~/utils/mapTilesUtils";

import type { PropType } from "vue";
import type { CardExportMethods } from "~/utils/types";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  id: { type: Number, required: true },
  indicatorName: { type: String },
  sourceLayer: {
    type: String as PropType<MapTilesLayersNamesKey>,
    default: "soner",
  },
  chartMode: {
    type: String as PropType<"numeric" | "percent">,
    default: "numeric",
  },
});

const mapId = `choropleth-map-${props.id}`;

const {
  initMap,
  setParentArea,
  setMapSourceLayer,
  withMapLoaded,
  setAreasDataFields,
  waitForIdle,
  syncMapCard,
  mapSource: choroplethSource,
  chartMode: choroplethChartMode,
  map,
} = useChoropleth();

const { selectedArea: parentSelectedArea, mapSource: globalMapSource } =
  storeToRefs(useMap());

const isMapBlocked = computed(
  () =>
    MapTilesLayersNames[globalMapSource.value] >=
      MapTilesLayersNames[choroplethSource.value] || !parentSelectedArea.value,
);

watch(
  () => props.sourceLayer,
  (newSource) => {
    withMapLoaded(async () => {
      if (!newSource || !props.indicatorName) return;

      const sourceLayer: MapTilesLayersNamesKey | undefined =
        mapTilesLayers.find((layer) => layer === newSource);
      if (!sourceLayer) return;

      setMapSourceLayer(sourceLayer);
      await waitForIdle();

      handleAreaDataChange(props.indicatorName);
    });
  },
  { immediate: true },
);

watch(
  [() => props.indicatorName, () => props.chartMode],
  ([newIndicatorName, newChartMode]) => {
    if (!newIndicatorName) return;

    choroplethChartMode.value = newChartMode;
    withMapLoaded(() => handleAreaDataChange(newIndicatorName));
  },
  { immediate: true },
);

watch(
  [parentSelectedArea, globalMapSource],
  ([newSelectedArea, newGlobalSource]) => {
    withMapLoaded(async () => {
      console.log(
        "watch parent selected area and source",
        newSelectedArea,
        "indicator name",
        props.indicatorName,
      );
      if (!newSelectedArea || !newGlobalSource || !props.indicatorName) return;
      setParentArea(newGlobalSource, newSelectedArea.id?.toString());

      await waitForIdle();

      handleAreaDataChange(props.indicatorName);
    });
  },
  { immediate: true },
);

function handleAreaDataChange(indicatorName: string) {
  const indicatorKey = getIndicatorKeys(indicatorName)?.[0];
  if (!indicatorKey) return;
  setAreasDataFields(indicatorKey);
}

function getIndicatorKeys(indicatorName: string) {
  return areaDataIndicators.find(
    (indicator) => indicator.name === indicatorName,
  )?.keys;
}

onMounted(async () => {
  initMap(mapId);

  await waitForIdle();

  pushGridEventCallback("resizestop", syncMapCard);
  pushGridEventCallback("resizecontent", syncMapCard);
});

const containerEl = ref(null);

const exportMethods: CardExportMethods[] = ["png", "jpeg"];

async function exportMapContainerWithControls(
  format: CardExportMethods,
  fileName: string = "Sammenligning " + new Date(),
) {
  if (!map.value || !containerEl.value) {
    throw new Error("Could not find container");
  }
  if (!exportMethods.find((method) => method === format)) {
    throw new Error("Invalid export method");
  }

  await waitForIdle();

  const mapPng = map.value.getCanvas().toDataURL("image/png");

  const mapContainer = map.value.getContainer() as HTMLElement;
  const overlay = document.createElement("img");
  overlay.src = mapPng;
  Object.assign(overlay.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  });

  const prevPos = getComputedStyle(mapContainer).position;
  if (prevPos === "static") mapContainer.style.position = "relative";
  mapContainer.appendChild(overlay);

  try {
    exportHtml(containerEl.value, format, fileName);
  } finally {
    mapContainer.removeChild(overlay);
    if (prevPos === "static") mapContainer.style.position = "";
  }
}

defineExpose({
  exportCard: exportMapContainerWithControls,
  exportMethods,
});
</script>
