<template>
  <div
    :class="[
      'grid w-full grid-flow-row items-stretch rounded-2xl p-5',
      'grid-cols-1 gap-y-2 sm:gap-x-4 md:grid-cols-2 xl:grid-cols-[2fr,2fr,3fr] xl:grid-rows-[min-content,min-content,1fr]',
      'xl:h-[80vh] 2xl:max-h-[55rem]',
    ]"
  >
    <!-- Card type / Back to card menu -->
    <div
      class="col-span-2 mb-8 mr-8 flex flex-col items-start justify-between gap-y-8"
    >
      <div v-if="!localEditMode" class="flex flex-col gap-1">
        <h2 class="text-2xl font-normal">Korttyper</h2>
        <p class="text-sm font-light">
          Velg hvilken korttype du ønsker å bruke
        </p>
        <div
          class="mt-2 flex w-full auto-cols-fr grid-flow-col flex-wrap justify-items-center gap-2 text-sm sm:grid"
        >
          <DashboardCreateCardType
            v-for="cardType in cardTypes"
            :key="cardType.label"
            :card-type="cardType"
            :is-selected="selectedCardType?.label === cardType.label"
            :select-card-type="selectCardType"
            class="sm:w-full"
          />
        </div>
      </div>
      <div v-else class="flex-grow">
        <button
          class="flex items-center justify-center gap-2 rounded-md border border-primary/50 bg-primary/15 py-1 pl-2 pr-3 duration-200 hover:-translate-y-1"
          @click="onExitEditMode"
        >
          <LucideArrowLeft :size="20" />
          <span class="-mb-0.5 text-base">Tilbake til kortmeny</span>
        </button>
      </div>
    </div>

    <!-- Example card -->
    <div
      class="order-last flex min-h-[70vh] flex-col items-start justify-between gap-y-4 xl:order-none xl:row-span-3 xl:min-h-0"
    >
      <div
        class="flex h-full w-full flex-grow flex-col rounded-xl border bg-white px-4 pt-4"
      >
        <div
          v-if="availableChartModes.length"
          class="flex flex-col gap-x-5 gap-y-2 xs:flex-row md:flex-col lg:flex-row"
        >
          <h2 class="flex-grow text-xl">Forhåndsfremvisning</h2>

          <div class="flex items-center gap-x-5">
            <CommonRadioCheckboxLike
              v-model="selectedChartMode"
              :disabled="!availableChartModes.includes('numeric')"
              class="text-sm"
              value="numeric"
            >
              Antall
            </CommonRadioCheckboxLike>
            <CommonRadioCheckboxLike
              v-model="selectedChartMode"
              :disabled="!availableChartModes.includes('percent')"
              class="text-sm"
              value="percent"
            >
              Prosent
            </CommonRadioCheckboxLike>
          </div>
        </div>

        <div class="h-full min-h-0 overflow-y-auto">
          <DashboardCard v-if="exampleCard" v-bind="exampleCard" class="h-full">
            <template #options>
              <DashboardCardOptionsBar
                v-model="exampleCard"
                :is-example="true"
              />
            </template>

            <template #in-card-options>
              <DashboardMapCardOptionsBar v-model="exampleCard" />
            </template>

            <component :is="exampleCard.component" v-bind="exampleCard" />
          </DashboardCard>
        </div>
      </div>
    </div>

    <!-- Menu description -->
    <div class="col-span-2 flex flex-col gap-1 pl-2 xl:order-none">
      <h2 class="text-2xl">Indikator</h2>
      <div
        class="flex flex-col items-start justify-between gap-y-2 font-light sm:flex-row sm:gap-y-0"
      >
        <div class="text-sm">
          Tilgjengelige indikatorer avhenger av valgt geografisk område.
          <br />
          Du kan se valgt område under mine valg.
        </div>
        <div class="flex h-min w-max flex-grow items-center justify-end gap-2">
          <div class="w-max">Geografisk nivå:</div>
          <span class="capitalize">{{ mapSource }}</span>
          <div class="-mt-0.5 size-4 rounded-full bg-primary" />
        </div>
      </div>
    </div>

    <!-- Indicators selection -->
    <div
      class="col-span-2 flex h-full max-h-[70vh] min-h-0 w-full flex-shrink flex-col gap-1 md:col-span-1 xl:order-none xl:max-h-full"
    >
      <div
        class="flex h-full min-h-0 flex-grow flex-col items-start justify-start gap-3 overflow-y-scroll rounded-xl border bg-white p-3"
      >
        <DashboardCreateIndicatorGroup
          v-for="group in indicatorGroupsFiltered"
          :key="group.groupName"
          :indicator-group="group"
        />
      </div>
    </div>

    <!-- Indicator description -->
    <div
      class="order-last col-span-2 flex h-full max-h-[30rem] min-h-0 w-full flex-shrink flex-col gap-1 xl:col-span-1 xl:max-h-full"
    >
      <div
        class="flex min-h-0 flex-grow flex-col gap-3 overflow-x-auto overflow-y-auto rounded-xl border bg-white p-5 pb-4 text-sm"
      >
        <h2 class="text-lg">Indikatorbeskrivelse</h2>
        <div v-if="selectedIndicator">
          <div class="font-semibold">{{ selectedIndicator.name }}:</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="formattedDescription" />
        </div>
      </div>
    </div>

    <!-- Apply button -->
    <div class="order-last col-span-full flex w-full flex-col rounded-xl p-4">
      <button
        class="w-min self-end rounded-lg bg-primary-500 px-8 py-2 text-center text-white duration-200 hover:-translate-y-1"
        @click="handleCreateCard"
      >
        Bruk
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cardTypes } from "~/data/cardTypes";
import { areaDataIndicators } from "~/data/indicators";
import { keysDenominators } from "~/data/keyDenominators";

const props = defineProps({
  onSubmit: {
    type: Function as PropType<() => void>,
  },
  editMode: { type: Boolean, default: false },
});

const { groupIndicators } = useIndicators();
const {
  selectedCardType,
  selectedIndicators,
  selectedCard,
  selectedChartMode,
} = storeToRefs(useCreateCard());
const { selectCardType, initializeSelectedIndicators } = useCreateCard();

const {
  upsertCard,
  buildChartCard,
  buildInfographicCard,
  buildChoroplethCard,
  getAreaData,
} = useDashboard();
const { selectedArea, mapSource } = storeToRefs(useMap());
const { pushNotification } = useNotifications();

const localEditMode = ref(props.editMode);

function onExitEditMode() {
  localEditMode.value = false;

  // Deselect all the current indicators
  initializeSelectedIndicators();
  handleCardChange();
}

const selectedIndicator = computed(() => {
  if (!selectedCardType.value || !selectedIndicators.value) return null;
  const selectedIndicatorsArray = selectedIndicators.value.get(
    selectedCardType.value.cardType,
  );
  if (!selectedIndicatorsArray?.length) return;
  return selectedIndicatorsArray[selectedIndicatorsArray.length - 1] || null;
});

const availableChartModes = computed<("numeric" | "percent")[]>(() => {
  const result: ("numeric" | "percent")[] = [];
  if (
    !selectedIndicator.value ||
    selectedCardType.value.cardType === "infographic" ||
    selectedIndicator.value.isMedian
  ) {
    return result;
  }
  result.push("numeric");

  const denominatorKeys = keysDenominators.get(
    selectedIndicator.value?.keys[0],
  );

  if (
    denominatorKeys?.length &&
    !(
      selectedCardType.value.cardType === "choropleth" &&
      selectedIndicator.value.indicatorSource === "geoData"
    )
  ) {
    result.push("percent");
  }

  return result;
});

// Watch for chart mode and change it in case it is not permitted
watch(
  availableChartModes,
  () => {
    selectedChartMode.value = getPrioritizedChartMode(
      availableChartModes.value,
    );
  },
  { immediate: true },
);

function getPrioritizedChartMode(chartModes: ("numeric" | "percent")[]) {
  return chartModes.find((mode) => mode === "percent") ? "percent" : "numeric";
}

const formattedDescription = computed(() => {
  const text = selectedIndicator.value?.indicatorDescription || "";

  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const linkified = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    (url) =>
      `<a class="text-primary underline" href="${url}" target="_blank" rel="noopener">lenke.</a>`,
  );

  return linkified.replace(/\r?\n/g, "<br/>");
});

const defaultChoroplethSourceLayer: MapTilesLayersNamesKey = "soner";
const choroplethSourceLayer = computed((): MapTilesLayersNamesKey => {
  let result: MapTilesLayersNamesKey = defaultChoroplethSourceLayer;
  if (
    exampleCard.value &&
    isChoroplethCard(exampleCard.value) &&
    exampleCard.value.sourceLayer
  ) {
    result = exampleCard.value.sourceLayer;
  }
  if (MapTilesLayersNames[mapSource.value] >= MapTilesLayersNames[result]) {
    return MapTilesLayersNames[
      MapTilesLayersNames[mapSource.value] + 1
    ] as MapTilesLayersNamesKey;
  }
  return result;
});

const indicatorGroupsFiltered = computed(() => {
  const cardType = selectedCardType.value?.cardType;
  if (!cardType) return [];

  const sourceLevelToMatch =
    cardType === "choropleth" ? choroplethSourceLayer.value : mapSource.value;

  const cardTypeIndicators = areaDataIndicators.filter((indicators) =>
    indicators.cardTypes.includes(cardType),
  );
  const groupedIndicators = groupIndicators(cardTypeIndicators);

  return groupedIndicators.map((group) => ({
    ...group,
    indicators: group.indicators.map((indicator) => ({
      ...indicator,
      available: !!indicator.sourceLevels.includes(sourceLevelToMatch),
    })),
  }));
});

const selectedDiagramType = computed(() => {
  if (!exampleCard.value || !isChartCard(exampleCard.value)) return "bar";
  return getCardDiagramType(exampleCard.value);
});

function handleCreateCard() {
  const card = handleBuildCard({ warnings: true });

  if (!card) return;

  if (selectedCard.value) {
    const cardId =
      selectedCard.value && isCardIndexed(selectedCard.value)
        ? selectedCard.value.id
        : undefined;

    upsertCard({
      ...card,
      id: cardId,
      x: selectedCard.value.x,
      y: selectedCard.value.y,
      cardWidth: selectedCard.value.cardWidth,
      cardHeight: selectedCard.value.cardHeight,
      cardMinHeight: selectedCard.value.cardMinHeight,
      cardMinWidth: selectedCard.value.cardMinWidth,
    });
    props.onSubmit?.();
    return;
  }

  upsertCard(card);
  props.onSubmit?.();
}

function handleBuildCard(options?: {
  warnings?: boolean;
  isEdit?: boolean;
  isInitial?: boolean;
}) {
  const warn = options?.warnings ? pushNotification : () => {};

  if (!selectedCardType.value) {
    return null;
  }

  const indicatorType = getCardIndicatorType(selectedCardType.value.cardType);

  // If it's the first time loading edit menu
  // then try to get chart mode from card which is being edited
  selectedChartMode.value =
    options?.isEdit &&
    options?.isInitial &&
    selectedCard.value &&
    (isChartCard(selectedCard.value) || isChoroplethCard(selectedCard.value))
      ? selectedCard.value.chartMode
      : selectedChartMode.value;

  switch (indicatorType) {
    case "singleIndicator": {
      const cardIndicator =
        selectedIndicators.value.get(selectedCardType.value.cardType)?.[0]
          ?.name || null;

      if (!cardIndicator) {
        warn({
          type: "warning",
          title: "Mangler egenskap",
          message: "Du må velge en egenskap for å lage et diagram",
        });
        return null;
      }
      if (!selectedDiagramType.value) {
        warn({
          type: "warning",
          title: "Mangler framstillingsvalg",
          message: "Du må velge en framstillingsvalg for å lage et diagram",
        });
        return null;
      }

      switch (selectedCardType.value.cardType) {
        case "chart": {
          const diagramType =
            options?.isInitial &&
            options?.isEdit &&
            selectedCard.value &&
            isChartCard(selectedCard.value)
              ? getCardDiagramType(selectedCard.value)
              : selectedDiagramType.value;

          return buildChartCard(
            cardIndicator,
            diagramType,
            selectedChartMode.value,
          );
        }

        case "choropleth": {
          const sourceLayer =
            options?.isInitial &&
            options?.isEdit &&
            selectedCard.value &&
            isChoroplethCard(selectedCard.value)
              ? selectedCard.value.sourceLayer
              : choroplethSourceLayer.value;

          return buildChoroplethCard(
            cardIndicator,
            sourceLayer,
            selectedChartMode.value,
          );
        }

        default:
          return null;
      }
    }

    case "multiIndicator": {
      const cardIndicators =
        selectedIndicators.value
          .get(selectedCardType.value.cardType)
          ?.filter(isGeoDataVisualKey) || [];

      if (!cardIndicators) {
        warn({
          type: "warning",
          title: "Mangler egenskap",
          message:
            "Du må velge en eller flere egenskaper for å lage et infografisk kort",
        });
        return null;
      }

      return buildInfographicCard(cardIndicators, selectedChartMode.value);
    }

    default:
      return null;
  }
}

const exampleCard = ref<CardWithComponentIndexed | null>(null);

async function handleCardChange(options?: { isInitial?: boolean }) {
  if (
    !selectedCardType.value ||
    !selectedIndicators.value ||
    !selectedIndicators.value.values()
  ) {
    exampleCard.value = null;
    return;
  }

  const cardIndicators = selectedIndicators.value
    .get(selectedCardType.value.cardType)
    ?.reduce(
      (acc, indicator) => {
        acc.push(
          ...indicator.keys.map((key) => ({
            name: key,
            indicatorSource: indicator.indicatorSource,
            aggregationMethod: indicator.aggregationMethod || "sum",
            sourceLevels: indicator.sourceLevels,
          })),
        );

        return acc;
      },
      [] as {
        name: string;
        indicatorSource: IndicatorSource;
        aggregationMethod: AggregationMethod;
        sourceLevels: MapTilesLayersNamesKey[];
      }[],
    );

  if (selectedCardType.value.cardType !== "choropleth") {
    await getAreaData(
      mapSource.value,
      selectedArea.value?.id.toString() || "",
      cardIndicators,
    );
  }

  const cardData = handleBuildCard({
    isEdit: true,
    isInitial: options?.isInitial,
  });
  if (
    cardData &&
    isChartCard(cardData) &&
    typeof cardData.series[0] === "object"
  ) {
    cardData.series = markRaw(cardData.series);
  }
  exampleCard.value = cardData ? markRaw({ ...cardData, id: 9999 }) : null;
}

onMounted(async () => {
  await handleCardChange({ isInitial: true });

  if (
    exampleCard.value &&
    (isChoroplethCard(exampleCard.value) || isChartCard(exampleCard.value))
  ) {
    selectedChartMode.value = exampleCard.value.chartMode;
  }
});

watch(
  [selectedCardType, selectedIndicators],
  () => {
    handleCardChange();
  },
  { deep: true },
);
watch(selectedChartMode, () => {
  if (
    !selectedCardType.value ||
    !selectedIndicators.value ||
    !selectedIndicators.value.values()
  ) {
    exampleCard.value = null;
    return;
  }

  const cardData = handleBuildCard({
    isEdit: true,
  });

  if (
    cardData &&
    isChartCard(cardData) &&
    typeof cardData.series[0] === "object"
  ) {
    cardData.series = markRaw(cardData.series);
  }
  exampleCard.value = cardData ? markRaw({ ...cardData, id: 9999 }) : null;
});
</script>
