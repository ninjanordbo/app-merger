<template>
  <div class="flex h-full w-full flex-col rounded-2xl bg-gray-100 p-5">
    <div
      class="flex h-full w-full items-center justify-between gap-2 rounded-xl bg-white px-5 py-3"
    >
      <CommonEditableLine
        v-model="projectDescription"
        placeholder="Beskrivelse"
        size="lg"
      />
    </div>

    <DashboardGrid>
      <DashboardCard v-for="(card, i) in cards" :key="card.id" v-bind="card">
        <template #options>
          <DashboardCardOptionsBar
            :model-value="card"
            :export-card="cardComponentRefs[i]?.exportCard"
            :export-methods="cardComponentRefs[i]?.exportMethods"
            @update:model-value="cards[i] = $event"
          />
        </template>

        <template #in-card-options>
          <DashboardMapCardOptionsBar v-model="cards[i]" />
        </template>

        <component
          :is="card.component"
          :ref="
            (el: ComponentPublicInstance) =>
              (cardComponentRefs[i] =
                el as ComponentPublicInstance<Exposed> | null)
          "
          v-bind="card"
        />
      </DashboardCard>
    </DashboardGrid>

    <button
      class="flex aspect-square size-20 items-center justify-center self-end rounded-full bg-gray-200 text-gray-500 duration-200 hover:scale-105"
      @click="openCardEdit()"
    >
      <LucidePlus :size="40" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { GridItemHTMLElement } from "gridstack";

const { cards, projectDescription } = storeToRefs(useDashboard());
const {
  syncCardElement,
  clearCurrentProjectData,
  getAreaData,
  reloadCardData,
} = useDashboard();
const { syncMapCard } = useMap();
const { selectedArea, mapSource } = storeToRefs(useMap());
const { openCardEdit } = useCreateCard();

onMounted(() => {
  pushGridEventCallback("resizestop", (el: GridItemHTMLElement) => {
    syncCardElement(el);
    syncMapCard();
  });

  pushGridEventCallback("dragstop", (el: GridItemHTMLElement) =>
    syncCardElement(el),
  );

  pushGridEventCallback("resizecontent", syncMapCard);
});

onUnmounted(() => {
  handleDestroyGrid();
  clearCurrentProjectData();
});

watch(selectedArea, async () => {
  if (!selectedArea.value) {
    throw new Error("Area not selected");
  }
  await getAreaData(mapSource.value, selectedArea.value?.id.toString());
  reloadCardData();
});

type Exposed = {
  exportCard?: (format: string) => void;
  exportMethods: CardExportMethods[];
};
const cardComponentRefs = ref<Array<ComponentPublicInstance<Exposed> | null>>(
  [],
);
</script>
