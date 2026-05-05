<template>
  <button
    class="option-button"
    :class="selected && 'selected'"
    @click="() => onDiagramSelect(diagramType)"
  >
    <slot name="icon" />
  </button>
</template>

<script lang="ts" setup>
defineProps({
  diagramType: { type: String as PropType<DiagramType>, required: true },
  selected: { type: Boolean as PropType<boolean>, required: true },
  onDiagramSelect: {
    type: Function as PropType<(diagaramType: DiagramType) => void>,
    required: true,
  },
});
</script>

<style>
.option-button {
  @apply rounded-md bg-gray-100 p-1 duration-200;

  &:hover {
    box-shadow: 0px 0px 0px 1px rgb(243 244 246);
  }

  &.selected {
    @apply bg-primary/50;
    box-shadow: 0px 0px 0px 1px rgb(136 181 107 / 0.5);
  }
}
</style>
