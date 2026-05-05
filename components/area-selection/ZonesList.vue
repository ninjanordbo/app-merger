<template>
  <div
    class="flex w-full items-center justify-between rounded-xl border-[0.5px] border-primary-500 bg-primary/20 px-5 py-2"
  >
    <p class="text-lg font-bold">Levekårssoner med innbyggertall</p>
  </div>

  <div
    class="flex h-min max-h-[65vh] max-w-full flex-col flex-wrap gap-x-5 gap-y-2 px-1 py-1"
  >
    <ZoneItem
      v-for="zone in zones"
      :key="zone.id"
      :zone="zone"
      @zone-select="onZoneSelect"
    />
  </div>

  <button
    v-if="canBeEdited && !municipalitySubmitted"
    class="flex w-full items-center justify-center rounded-lg border-[0.5px] border-primary-500 bg-primary py-1.5 text-white duration-200 hover:scale-x-[1.02] hover:scale-y-105"
    @click="addZone"
  >
    <LucidePlusCircle :size="18" />
    <p class="-mb-0.5 pl-2">Legg til ny sone</p>
  </button>
  <div
    v-else-if="!municipalitySubmitted"
    class="flex items-center justify-between rounded-lg border-[0.5px] border-red-500 bg-red-500/30 px-5 py-2 font-medium"
  >
    Du ser nå det opprinnelige soneforslaget. Her er det ikke mulig å gjøre
    endringer. Hvis du ønsker å gjøre endringer må du gå tilbake eller
    tilbakestille soner.
  </div>
  <div
    v-else-if="municipalitySubmitted"
    class="flex items-center justify-between rounded-lg border-[0.5px] border-red-500 bg-red-500/30 px-5 py-2 font-medium"
  >
    Du ser nå soneforslaget som ble sendt inn til Nabolagshelse. Det er ikke
    lenger mulig å endre soneinndelingen. Om du likevel ønsker å redigere soner,
    ta kontakt med post@nabolagshelse.no.
  </div>
</template>

<script lang="ts" setup>
import ZoneItem from "./ZoneItem.vue";

defineProps({
  zones: {
    type: Array as PropType<(Zone & { color: string })[]>,
    required: true,
  },
  onZoneSelect: {
    type: Function as PropType<() => void>,
    required: false,
  },
});

const { addZone } = useZoneSelection();
const { canBeEdited, municipalitySubmitted } = storeToRefs(useZoneSelection());
</script>
