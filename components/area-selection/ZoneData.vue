<template>
  <div class="flex flex-col items-center justify-center gap-5 pb-20">
    <div
      class="flex w-full items-center justify-between rounded-xl border-[0.5px] border-primary-500 bg-primary/20 px-5 py-2"
    >
      <p class="-mb-0.5 text-lg font-bold">
        Grunnkretser i sone {{ selectedZone.displayId }}
      </p>
      <div class="flex items-center justify-center gap-2 font-semibold">
        <p class="mt-1">Totalbefolkning {{ selectedZone.inhabitantsAmount }}</p>
        <button
          v-if="selectedZone.canBeDeleted"
          class="rounded-md border border-red-500 bg-white p-1 duration-200 hover:scale-110 hover:bg-red-100"
          @click.prevent="() => deleteZone(selectedZone)"
        >
          <LucideTrash2 class="text-red-500" :size="16" />
        </button>
      </div>
    </div>

    <AreaSelectionCircuitsTable v-if="zoneCircuits?.length">
      <AreaSelectionCircuitTableRow
        v-for="circuit in zoneCircuits"
        :key="circuit.id"
        :circuit="circuit"
      />
    </AreaSelectionCircuitsTable>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  selectedZone: { type: Object as PropType<Zone>, required: true },
});

const { circuits } = storeToRefs(useZoneSelection());
const { deleteZone } = useZoneSelection();

const reactiveCircuits = reactive(circuits);

const zoneCircuits = computed(() => {
  return reactiveCircuits.value?.filter(
    (circuit) => circuit.zoneId === props.selectedZone.id,
  );
});
</script>
