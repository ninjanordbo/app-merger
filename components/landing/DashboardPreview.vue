<template>
  <div
    class="flex w-full flex-col items-center justify-center gap-2 rounded-xl p-5"
  >
    <div
      class="flex h-full w-full items-center justify-between gap-2 rounded-md bg-white px-5 py-3 shadow-sm"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="h-7 w-0.5 bg-primary-500" />
        <div class="mt-1 text-xl font-light">Demo</div>
      </div>

      <div class="flex items-center justify-between gap-2">
        <button
          class="flex items-center justify-center rounded-md border-2 border-primary bg-white py-1.5 pl-2 pr-1 duration-200 hover:-translate-y-1"
          @click="() => openCardEdit('choropleth')"
        >
          <LucidePlus :size="20" class="text-primary" />
          <span class="px-2 text-sm font-medium text-dark-blue">
            Nytt kort
          </span>
        </button>
      </div>
    </div>

    <div
      class="flex h-full min-h-[60vh] w-full flex-col items-stretch justify-center md:flex-row"
    >
      <DashboardCard
        v-for="(card, i) in cards"
        :key="card.id"
        class="h-[50vh] min-h-[50vh] w-full md:h-auto"
        v-bind="card"
      >
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DashboardCardEdit } from "#components";

const {
  clearCurrentProjectData,
  getAreaData,
  reloadCardData,
  buildMapCard,
  upsertCard,
  deleteCard,
  buildChartCard,
} = useDashboard();
const { cards } = storeToRefs(useDashboard());
const { selectedArea, mapSource } = storeToRefs(useMap());
const { handleAreaSelection, setMapSourceLayer, withMapLoaded, waitForIdle } =
  useMap();
const { openCardEdit } = useCreateCard();
const { enableDemo, disableDemo } = useAuth();

const presetIndicatorName = "Familietyper";

onMounted(async () => {
  await enableDemo();
  await clearCurrentProjectData();

  upsertCard(buildMapCard());
  upsertCard(buildChartCard(presetIndicatorName, "pie", "percent"));

  withMapLoaded(async () => {
    setMapSourceLayer("kommuner", { force: true });
    await waitForIdle();
    handleAreaSelection({ id: "3301", name: "Drammen" });
  });
});

onUnmounted(async () => {
  await clearCurrentProjectData();
  await disableDemo();
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

const { isCardEditOpen, selectedCard } = storeToRefs(useCreateCard());

function onCardEditSubmit() {
  isCardEditOpen.value = false;
  deleteOldDataCard();
}

const modalEditMode = computed(() => !!selectedCard.value);

const { openModal, closeModal } = useModal();
const { isOpen } = storeToRefs(useModal());

watch(isCardEditOpen, (newIsCardEditOpen) => {
  if (newIsCardEditOpen) {
    handleOpenEdit();
  } else {
    selectedCard.value = null;
    closeModal();
  }
});

watch(isOpen, (newIsOpen) => {
  isCardEditOpen.value = !!newIsOpen;
});

const { pushNotification } = useNotifications();

function handleOpenEdit() {
  if (isNaN(Number(selectedArea.value?.id))) {
    pushNotification({
      title: "Mangler geografisk nivå!",
      message: "For å legge til nytt kort, må du først velge område i kart.",
      type: "error",
    });
    isCardEditOpen.value = false;
    return;
  }

  openModal(
    DashboardCardEdit,
    { size: "lg", title: "Edit Card" },
    { editMode: modalEditMode, onSubmit: onCardEditSubmit },
  );
}

function deleteOldDataCard() {
  if (cards.value.length <= 2) return;

  const oldCard = cards.value
    .filter((card) => card.cardType !== "map")
    .sort((a, b) => a.id - b.id)[0];

  if (oldCard?.id) {
    deleteCard(oldCard.id);
  }
}
</script>

<style scoped></style>
