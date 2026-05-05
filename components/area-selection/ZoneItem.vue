<template>
  <button
    :class="[
      'flex items-center justify-between rounded-lg border-[0.5px]',
      selectedZone?.id === zone.id
        ? 'border-red-500 bg-red-500/30'
        : 'border-primary-500 hover:bg-primary/10',
    ]"
    @click="() => handleZoneSelect(zone.id)"
  >
    <div
      class="flex items-center justify-center rounded-md px-5 py-1.5"
      :style="{
        backgroundColor:
          selectedZone?.id === zone.id ? '#ef4444' : zone.color || '#0000',
        boxShadow: `0px 0px 0px 1.5px ${selectedZone?.id === zone.id ? '#ef4444' : zone.color || '#0000'}`,
      }"
    >
      <p :style="{ color: getTextColor(zone.color) }" class="text-sm">
        {{ zone.displayId }}
      </p>
    </div>
    <div
      class="flex h-full w-full items-center justify-between gap-2 pl-5 pr-3"
    >
      <div
        class="flex items-center justify-center gap-2 text-clip text-sm font-semibold"
      >
        <p class="-mb-0.5">{{ zone.inhabitantsAmount }}</p>
        <LucideUsers class="text-primary-800" :size="16" />
      </div>
      <button v-if="zone.canBeDeleted" @click.stop="() => deleteZone(zone)">
        <LucideTrash2 v-if="canBeEdited" class="text-red-500" :size="16" />
      </button>
      <button v-else>
        <LucidePencil
          v-if="canBeEdited"
          :class="
            selectedZone?.id === zone.id ? 'text-red-500' : 'text-primary'
          "
          :size="16"
        />
      </button>
    </div>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  zone: {
    type: Object as PropType<Zone & { color: string }>,
    required: true,
  },
  onZoneSelect: {
    type: Function as PropType<() => void>,
    required: false,
  },
});

const { selectZone, deleteZone } = useZoneSelection();
const { selectedZone, canBeEdited } = storeToRefs(useZoneSelection());

function handleZoneSelect(zoneId: string) {
  selectZone(zoneId);
  props.onZoneSelect?.();
}

function isColorDark(color: string): boolean {
  if (!color) return false;

  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

function getTextColor(color: string) {
  return isColorDark(color) ? "#fff" : "#000";
}
</script>
