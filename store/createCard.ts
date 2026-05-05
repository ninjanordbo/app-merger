import { cardTypes } from "~/data/cardTypes";
import { areaDataIndicators } from "~/data/indicators";

import type {
  CardWithComponentIndexed,
  ChoroplethCard,
  GeoDataTypeKey,
  IndicatorType,
} from "~/utils/types";

const DEFAULT_CARD_TYPE: CardCreationType = cardTypes[0];
const DEFAULT_CHART_MODE = "numeric";

export const useCreateCard = defineStore("createCard", () => {
  const selectedCardType = ref<CardCreationType>(DEFAULT_CARD_TYPE);

  const selectedIndicators = ref<
    Map<CardType, (GeoDataTypeKey | GeoDataVisualKey)[]>
  >(new Map(cardTypes.map((cardType) => [cardType.cardType, []])));
  const selectedCard = ref<Card | null>(null);
  const selectedChartMode = ref<"numeric" | "percent">(DEFAULT_CHART_MODE);

  const showGrayedOutInfo = ref(true);
  const showCardTypeInfo = ref<Map<string, boolean>>();

  const isCardEditOpen = ref(false);

  function openCardEdit(cardType?: CardType, card?: CardWithComponentIndexed) {
    initializeSelectedIndicators();
    selectedCardType.value =
      cardTypes.find((card) => card.cardType === cardType) ||
      selectedCardType.value;
    selectedCard.value = card ?? null;
    selectedChartMode.value =
      card && (isChartCard(card) || isChoroplethCard(card))
        ? card.chartMode
        : DEFAULT_CHART_MODE;

    isCardEditOpen.value = true;
  }

  function closeCardEdit() {
    selectedChartMode.value = DEFAULT_CHART_MODE;
    selectedCardType.value = DEFAULT_CARD_TYPE;
    selectedCard.value = null;
    isCardEditOpen.value = false;
  }

  function initializeSelectedIndicators() {
    selectedIndicators.value = new Map(
      cardTypes.map((cardType) => [cardType.cardType, []]),
    );

    cardTypes.forEach((cardType) => {
      const indicator = areaDataIndicators.find((indicator) =>
        indicator.cardTypes.includes(cardType.cardType),
      );
      if (!indicator) {
        selectedIndicators.value.set(cardType.cardType, []);
        return;
      }
      selectedIndicators.value.set(cardType.cardType, [indicator]);
    });
  }

  showCardTypeInfo.value = new Map(
    cardTypes.map((cardType) => [cardType.label, true]),
  );

  function selectCardType(cardType: CardCreationType) {
    selectedCardType.value = cardType;
  }

  function toggleIndicator(indicator: GeoDataTypeKey | GeoDataVisualKey) {
    if (!selectedCardType.value) return;

    const currentIndicators =
      selectedIndicators.value.get(selectedCardType.value?.cardType) || [];
    const indicatorIndex = currentIndicators.findIndex(
      (currentIndicator) => currentIndicator.name === indicator.name,
    );

    if (indicatorIndex !== -1) {
      currentIndicators.splice(indicatorIndex, 1);
      return;
    }

    if (selectedCardType.value?.indicatorType === "multiIndicator") {
      currentIndicators.push(indicator);
    } else {
      selectedIndicators.value.set(selectedCardType.value?.cardType, [
        indicator,
      ]);
    }
  }

  // Watch for changes in selectedCard and update selectedIndicators accordingly
  watch(selectedCard, () => {
    if (!selectedCard.value) return;

    const indicatorType = getCardIndicatorType(selectedCard.value.cardType);

    switch (indicatorType) {
      case "singleIndicator": {
        if (
          !isChartCard(selectedCard.value) &&
          !isChoroplethCard(selectedCard.value)
        )
          return;

        const indicator = areaDataIndicators.find(
          (indicator) =>
            indicator.name ===
            (selectedCard.value as ChartCard | ChoroplethCard).indicatorName,
        );

        if (!indicator) return;

        selectedIndicators.value.set(selectedCard.value.cardType, [indicator]);
        break;
      }

      case "multiIndicator": {
        if (!isInfographicCard(selectedCard.value)) return;
        const indicators = areaDataIndicators.filter((indicator) =>
          (selectedCard.value as InfographicCard).indicators.find(
            (selectedIndicator) => selectedIndicator.name === indicator.name,
          ),
        );
        selectedIndicators.value.set(selectedCard.value.cardType, indicators);
        break;
      }
    }
  });

  return {
    selectedCardType,
    selectedIndicators,
    selectedChartMode,
    selectedCard,
    isCardEditOpen,

    showGrayedOutInfo,
    showCardTypeInfo,
    openCardEdit,
    closeCardEdit,

    selectCardType,
    toggleIndicator,
    initializeSelectedIndicators,
  };
});

export function getCardIndicatorType(
  cardType: CardType,
): IndicatorType | undefined {
  return cardTypes.find((type) => type.cardType === cardType)?.indicatorType;
}
