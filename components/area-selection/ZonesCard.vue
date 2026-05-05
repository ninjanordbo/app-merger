<template>
  <AreaSelectionCard
    :id="1"
    :card-height="3"
    :card-width="4"
    :draggable="false"
    :no-move="true"
    :no-resize="true"
    :locked="true"
    :deletable="false"
  >
    <div class="flex h-full flex-col gap-y-5 px-10 py-3">
      <AreaSelectionZonesList
        v-if="coloredZones"
        :zones="coloredZones"
        @zone-select="onZoneSelect"
      />
      <div ref="zoneDataElement">
        <AreaSelectionZoneData
          v-if="selectedZone"
          :selected-zone="selectedZone"
          class="mt-10"
        />
      </div>
    </div>
  </AreaSelectionCard>
</template>

<script lang="ts" setup>
const { colorMap, selectedZone, zones } = storeToRefs(useZoneSelection());

const coloredZones = computed(() =>
  zones.value
    ?.map((zone) => ({ ...zone, color: colorMap.value[zone.id] }))
    .sort((a, b) => Number(a.id) - Number(b.id)),
);

const zoneDataElement = ref<HTMLElement | null>(null);
function onZoneSelect() {
  nextTick(() => {
    zoneDataElement.value?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });
}
</script>
