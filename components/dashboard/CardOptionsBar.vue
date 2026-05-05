<template>
  <div v-if="isChartCard(card)" class="flex gap-1 rounded-md bg-gray-100">
    <DashboardCardDiagramOption
      v-for="diagramType in diagramTypes"
      :key="diagramType.diagramType"
      :diagram-type="diagramType.diagramType"
      :selected="selectedDiagramType === diagramType.diagramType"
      @diagram-select="selectDiagramType"
    >
      <template #icon>
        <component :is="diagramType.icon" :size="20" />
      </template>
    </DashboardCardDiagramOption>
  </div>

  <div v-if="!isMapCard(card) && !isExample" class="flex">
    <button @click="handleOpenCardEdit(card)">
      <LucideSettings :size="20" />
    </button>
  </div>

  <div
    v-if="!isMapCard(card) && !isExample && exportCard && exportMethods?.length"
    class="flex"
  >
    <DashboardDownloadHandler
      :handle-export="handleExport"
      :export-methods="exportMethods"
    />
  </div>

  <button
    v-if="card.deletable && !isExample"
    @click="() => deleteCard(card.id)"
  >
    <LucideTrash2 :size="20" />
  </button>
</template>

<script lang="ts" setup>
import { diagramTypes } from "~/data/diagramTypes";
import { getErrorMessage } from "~/helpers/getErrorMessage";

import type { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: Object as PropType<CardWithComponentIndexed>,
    required: true,
  },
  exportCard: {
    type: Function as PropType<
      (format: CardExportMethods, fileName?: string) => void
    >,
  },
  exportMethods: {
    type: Array as PropType<CardExportMethods[]>,
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

const { deleteCard, buildChartCard } = useDashboard();
const { openCardEdit } = useCreateCard();
const { selectedArea } = storeToRefs(useMap());
const { pushNotification } = useNotifications();

function handleOpenCardEdit(card: CardWithComponentIndexed) {
  if (isNaN(Number(selectedArea.value?.id))) {
    pushNotification({
      title: "Mangler geografisk nivå!",
      message: "For å endre kortet, må du først velge område i kart.",
      type: "error",
    });
    return;
  }

  openCardEdit(card.cardType, card);
}

const selectedDiagramType = computed(() => {
  if (!isChartCard(card.value)) return null;
  return getCardDiagramType(card.value);
});

function selectDiagramType(diagramType: DiagramType) {
  if (!isChartCard(card.value)) return;
  const rebuiltCard = buildChartCard(
    card.value.indicatorName,
    diagramType,
    card.value.chartMode,
  );

  card.value = {
    ...rebuiltCard,
    id: card.value.id,
    x: card.value.x,
    y: card.value.y,
    cardWidth: card.value.cardWidth,
    cardHeight: card.value.cardHeight,
  } as CardWithComponentIndexed<ChartCard>;
}

function handleExport(format: CardExportMethods) {
  try {
    props.exportCard?.(format);
  } catch (error) {
    pushNotification({
      type: "error",
      title: "Error while exporting card",
      message: getErrorMessage(error),
    });
  }
}
</script>
