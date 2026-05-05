<template>
  <div
    :class="[
      'grid grid-cols-[repeat(4,1fr)_min-content] items-center gap-x-2 rounded-xl border px-5 pb-1 pt-1.5 text-gray-700 hover:border-red-500 hover:bg-red-500/30',
      circuit.hovered ? 'border-red-500 bg-red-500/30' : 'bg-white',
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="max-w-[100px] break-words">{{ circuit.name }}</div>
    <div>{{ circuit.id }}</div>
    <div>{{ circuit.inhabitantsAmount }}</div>

    <div v-if="!isEditing">{{ selectedZoneIndex }}</div>
    <div v-else>
      <CommonDropdown
        v-if="zonesIndexes"
        v-model="selectedZoneIndex"
        class="w-min"
        :items="zonesIndexes"
      />
    </div>

    <div v-if="canBeEdited" class="-mt-0.5 flex items-center justify-end gap-2">
      <button v-if="!isEditing" @click="isEditing = true">
        <LucidePencil
          :class="[circuit.hovered ? 'text-red-500' : 'text-primary']"
          :size="16"
        />
      </button>
      <button v-else @click="submitCircuitEditing">
        <LucideSave class="text-red-500" :size="20" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  circuit: { type: Object as PropType<Circuit>, required: true },
});

const isEditing = ref(false);

const { setAreaZone: setAreaZoneFeatureState, selectZone } = useZoneSelection();
const { zones, selectedZone, canBeEdited } = storeToRefs(useZoneSelection());
const zonesIndexes = computed(() => zones.value?.map((zone) => zone.displayId));
const selectedZoneIndex = ref(
  zones.value?.find((zone) => zone.id === props.circuit.zoneId)?.displayId ||
    "0",
);

function submitCircuitEditing() {
  if (!zones.value) return;

  const selectedZoneId = zones.value.find(
    (zone) => zone.displayId === selectedZoneIndex.value,
  )?.id;

  if (!selectedZoneId) return;

  setAreaZoneFeatureState(props.circuit.id, selectedZoneId);
  selectedZone.value?.id && selectZone(selectedZone.value?.id);
  isEditing.value = false;
}

const { hoverMapArea } = useZoneMap();

function handleMouseEnter() {
  hoverMapArea(props.circuit.id);
}

function handleMouseLeave() {
  hoverMapArea("0");
}
</script>
