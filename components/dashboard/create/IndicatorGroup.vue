<template>
  <div
    class="group flex w-full flex-col items-start justify-center gap-2 rounded-lg bg-primary/15 p-3"
  >
    <div class="col-span-2 mb-1 text-xl">
      {{ indicatorGroup.groupName }}
    </div>
    <label
      v-for="indicator in indicatorGroup.indicators"
      :key="indicator.name"
      class="flex w-full items-start justify-between gap-2 text-sm font-light"
      :class="
        !indicator.isComing && indicator.available
          ? 'cursor-pointer text-black'
          : 'cursor-default text-gray-500'
      "
      :title="
        !indicator.available
          ? 'Indikatoren er ikke tilgjengelig for valgt geografisk område.'
          : ''
      "
    >
      <div class="flex gap-2">
        <CommonCheckBox
          :model-value="isIndicatorSelected(indicator.name)"
          :disabled="indicator.isComing || !indicator.available"
          @change="() => toggleIndicator(indicator)"
        />
        <span class="translate-y-0.5">{{ indicator.name }}</span>
      </div>
      <div
        v-if="indicator.available"
        class="size-4 self-center rounded-full bg-primary"
      />
      <div
        v-else
        class="size-4 self-center rounded-full border border-gray-400 bg-gray-100"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  indicatorGroup: {
    type: Object as PropType<{
      groupName: string;
      indicators: Array<
        (GeoDataVisualKey | GeoDataTypeKey) & { available: boolean }
      >;
    }>,
    required: true,
  },
});

const { toggleIndicator } = useCreateCard();
const { selectedIndicators, selectedCardType } = storeToRefs(useCreateCard());

const isIndicatorSelected = (indicatorName: string) => {
  return !!(
    selectedCardType.value?.cardType &&
    selectedIndicators.value
      .get(selectedCardType.value.cardType)
      ?.find((indicator) => indicator.name === indicatorName)
  );
};
</script>
