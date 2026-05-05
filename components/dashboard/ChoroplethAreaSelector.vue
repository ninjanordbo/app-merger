<template>
  <div class="mb-2 flex w-full items-center justify-stretch gap-2">
    <CommonDropdown
      v-model="source"
      class="w-full flex-grow"
      label="Velg geografisk nivå"
      :value-transform="stringLayerToSingular"
      :items="availableLayers"
    />
  </div>
</template>

<script lang="ts" setup>
import { capitalize, type PropType } from "vue";

import { areaDataIndicators } from "~/data/indicators";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  modelValue: {
    type: Object as PropType<CardWithComponentIndexed<ChoroplethCard>>,
    required: true,
  },
});

function stringLayerToSingular(layer: string | null) {
  if (!layer || !isKeyOfMapTilesLayersNames(layer)) return "";
  return capitalize(layerNameToSingular(layer));
}

const emit = defineEmits<{
  (eventName: "update:modelValue", value: CardWithComponentIndexed): void;
}>();

const source = computed<string>({
  get: () => props.modelValue.sourceLayer,
  set: (value) =>
    emit("update:modelValue", {
      ...props.modelValue,
      sourceLayer: value,
    } as CardWithComponentIndexed<ChoroplethCard>),
});

const { mapSource } = storeToRefs(useMap());

const availableLayers = computed(() => {
  const indicatorAvailableLayers = areaDataIndicators.find(
    (indicator) => indicator.name === props.modelValue.indicatorName,
  )?.sourceLevels;
  return (
    indicatorAvailableLayers?.filter((layer) => {
      return MapTilesLayersNames[layer] > MapTilesLayersNames[mapSource.value];
    }) || []
  );
});
</script>
