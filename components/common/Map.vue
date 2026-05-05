<template>
  <div class="h-full w-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
    <!-- Placeholder image for the map -->
    <img
      src="https://placehold.co/1200x800/e2e8f0/475569?text=Map+Unavailable+(Prototype)"
      alt="Map Placeholder"
      class="w-full h-full object-cover opacity-50"
    />
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
       <p class="text-slate-500 font-semibold bg-white/80 px-4 py-2 rounded-md shadow-sm">
         Interactive map disabled for prototype
       </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  mapType: {
    type: String as PropType<"default" | "zone">,
    default: "default",
  },
});

/* Mapbox logic disabled for prototype due to missing token
const mapContainer = ref<HTMLElement | null>(null);

const mapStore = props.mapType === "zone" ? useZoneMap : useMap;

const { initMap, destroyMap } = mapStore();
onMounted(async () => {
  await nextTick();

  if (!mapContainer.value) {
    return;
  }
  initMap(mapContainer.value);
});

onBeforeUnmount(destroyMap);
*/
</script>

<style lang="scss">
/* Map styles disabled
#mapbox {
  width: 100%;
  height: 100%;
}
mapboxgl-canvas {
  width: 100%;
}
.mapboxgl-ctrl-bottom-left {
  display: none;
}
.mapboxgl-ctrl-bottom-right {
  display: none;
}
*/
</style>
