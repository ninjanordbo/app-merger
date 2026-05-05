<template>
  <DashboardMapAreaSelector v-if="isMapCard(card)" />
  <DashboardChoroplethAreaSelector
    v-else-if="isChoroplethCard(card)"
    v-model="card"
  />
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: Object as PropType<CardWithComponentIndexed>,
    required: true,
  },
  isExample: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: CardWithComponentIndexed): void;
}>();

const card = computed({
  get: () => props.modelValue,
  set: (value: CardWithComponentIndexed) => {
    emit("update:modelValue", value);
  },
});
</script>
