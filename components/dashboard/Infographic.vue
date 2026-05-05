<template>
  <div
    ref="rootEl"
    class="grid h-full w-full grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] items-stretch justify-center gap-5 bg-white p-2"
  >
    <div
      v-for="indicator in indicators"
      :key="indicator.name"
      :title="indicator.name"
      class="grid grid-rows-subgrid justify-center justify-items-center gap-1 rounded-2xl bg-gray-100 px-7 py-3"
      style="grid-row: span 2"
    >
      <component
        :is="indicator.iconComponent"
        v-if="
          isIndicatorValueValid(indicator.value) ||
          isIndicatorAvailableForLayer(indicator.name)
        "
        size="2.5rem"
        class="mb-2 self-end text-primary"
      />
      <div v-else class="flex items-end justify-center text-center text-sm">
        <b class="h-10">{{ indicator.name }}</b>
      </div>

      <div
        v-if="
          isIndicatorValueValid(indicator.value) ||
          isIndicatorAvailableForLayer(indicator.name)
        "
        class="w-full text-center text-xs 2xl:text-sm"
      >
        <span>
          {{ indicator.indicationName }}
          <b>{{ (indicator.value ?? "X") + " " + indicator.unit }}</b>
        </span>
        <br />
        <span>
          {{ indicator.name }}
        </span>
      </div>
      <div v-else class="flex items-start justify-center text-center text-sm">
        <b>Indikator ikke tilgjengelig for dette geografisk nivå!</b>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { areaDataIndicators } from "~/data/indicators";

defineProps({
  indicators: {
    type: Array as PropType<VisualIndicator[]>,
  },
});

const { mapSource } = storeToRefs(useMap());
function isIndicatorAvailableForLayer(indicatorName: string) {
  const indicatorSourceLevels = areaDataIndicators.find(
    (indicator) => indicator.name === indicatorName,
  )?.sourceLevels;
  return !!indicatorSourceLevels?.includes(mapSource.value);
}

function isIndicatorValueValid(value: string | number | null | undefined) {
  return !!value || (typeof value === "number" && !value);
}

const rootEl = ref<HTMLElement>();
const exportMethods: CardExportMethods[] = ["png", "jpeg"];

defineExpose({
  exportCard: (format: CardExportMethods, fileName?: string) => {
    if (!exportMethods.find((method) => method === format)) {
      throw new Error("Invalid export method");
    }
    if (!rootEl.value) {
      throw new Error("Could not get card element");
    }
    exportHtml(rootEl.value, format, fileName);
  },
  exportMethods,
});
</script>
