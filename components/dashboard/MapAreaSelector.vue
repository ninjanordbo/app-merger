<template>
  <div
    :class="[
      'mb-2 grid w-full items-center justify-stretch gap-2',
      showFeaturesSelection ? 'grid-cols-2' : 'grid-cols-1',
    ]"
  >
    <CommonDropdown
      v-model="selectedLevel"
      class="w-full flex-grow"
      label="Velg geografisk nivå"
      :items="mapTilesLayers"
      :value-transform="stringLayerToSingular"
      :in-progress="featuresInProgress"
    />
    <CommonDropdownObject
      v-if="showFeaturesSelection"
      v-model="selectedFeature"
      class="w-full"
      :label="'Velg ' + selectedLevel"
      :items="features"
      :value-transform="getFeatureName"
      :in-progress="featuresInProgress"
    />
  </div>
</template>

<script lang="ts" setup>
import { capitalize } from "vue";

import {
  isKeyOfMapTilesLayersNames,
  layerNameToSingular,
  mapTilesLayers,
  type MapTilesLayersNamesKey,
} from "~/utils/mapTilesUtils";

defineOptions({
  inheritAttrs: false,
});

defineProps({
  cardWidth: { type: Number, default: 2 },
  cardHeight: { type: Number, default: 2 },
  x: { type: Number },
  y: { type: Number },
  initialMapZoom: { type: Number },
});

const showFeaturesSelection = computed(
  () => selectedLevel.value !== "hele_landet",
);

function stringLayerToSingular(layer: string | null) {
  if (!layer || !isKeyOfMapTilesLayersNames(layer)) return "";
  return capitalize(layerNameToSingular(layer));
}

function getFeatureName(feature: Record<string, any> | null) {
  return String(feature?.name) || "";
}

const { pushNotification } = useNotifications();

const { mapSource, selectedArea } = storeToRefs(useMap());
const { setMapSourceLayer, handleAreaSelection } = useMap();
const { fetchCounties, fetchMunicipalities, fetchCircuits, fetchZones } =
  useIndicators();
const {
  counties,
  countiesInProgress,
  municipalities,
  municipalitiesInProgress,
  circuits,
  circuitsInProgress,
  zones,
  zonesInProgress,
} = storeToRefs(useIndicators());

const selectedLevel = ref<MapTilesLayersNamesKey>("fylker");
const selectedFeature = ref<{ id: string | number; name: string } | null>(null);

const features = shallowRef<{ id: string; name: string }[]>([]);
const featuresInProgress = computed(() => {
  return (
    (selectedLevel.value === "fylker" && countiesInProgress.value) ||
    (selectedLevel.value === "kommuner" && municipalitiesInProgress.value) ||
    (selectedLevel.value === "grunnkretser" && circuitsInProgress.value) ||
    (selectedLevel.value === "soner" && zonesInProgress.value)
  );
});

watch(
  mapSource,
  () => {
    selectedLevel.value = mapSource.value;
  },
  { immediate: true },
);

async function getCurrentLevelFeatures() {
  switch (selectedLevel.value) {
    case "hele_landet":
      return ref([{ id: "1", name: "Norge" }]);
    case "fylker":
      if (!counties.value) {
        await fetchCounties();
      }
      return counties;
    case "kommuner":
      if (!municipalities.value?.length) {
        await fetchMunicipalities();
      }
      return municipalities;
    case "grunnkretser":
      if (!circuits.value?.length) {
        await fetchCircuits();
      }
      return circuits;
    case "soner":
      if (!zones.value?.length) {
        await fetchZones();
      }
      return zones;
    default:
      return null;
  }
}

watch(
  selectedLevel,
  async () => {
    setMapSourceLayer(selectedLevel.value);

    const currentFeatures = await getCurrentLevelFeatures();

    if (!currentFeatures?.value || !currentFeatures?.value?.length) {
      pushNotification({
        title: "No features found",
        message: `No features found for ${selectedLevel.value}`,
        type: "error",
      });
      return;
    }

    features.value = currentFeatures.value;
  },
  { immediate: true },
);

watch(
  selectedFeature,
  () => {
    if (selectedFeature.value?.id === selectedArea.value?.id) return;

    const feature = features.value.find(
      (feature) => feature.id === selectedFeature.value?.id,
    );

    if (!feature) {
      pushNotification({
        title: "Feature not found",
        message: `Feature not found: ${selectedFeature.value}`,
        type: "error",
      });
      return;
    }

    handleAreaSelection(feature);
  },
  { immediate: true },
);

watch(
  selectedArea,
  () => {
    selectedFeature.value = selectedArea.value;
  },
  { immediate: true },
);

onMounted(() => {
  fetchCounties();
  fetchMunicipalities();
  fetchCircuits();
});
</script>
