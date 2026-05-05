import {
  ChartsBar,
  ChartsLine,
  ChartsPie,
  DashboardChoropleth,
  DashboardInfographic,
  CommonMap,
} from "#components";
import { areaDataIndicators } from "~/data/indicators";
import { getErrorMessage } from "~/helpers/getErrorMessage";
import { getChartData, getInfographicsData } from "~/utils/geoData/getCardData";
import { fetchAreaDataById } from "~/utils/geoData/getGeodata";
import {
  mapTilesLayers,
  type MapTilesLayersNamesKey,
} from "~/utils/mapTilesUtils";

import type { GridItemHTMLElement, GridStackElement } from "gridstack";
import type { WatchStopHandle } from "vue";
import type {
  AggregationMethod,
  Api,
  CardType,
  CardWithComponent,
  ChartCard,
  ChoroplethCard,
  DiagramType,
  GeoDataVisualKey,
  IndicatorSource,
  InfographicCard,
} from "~/utils/types";

export const useDashboard = defineStore("dashboard", () => {
  const currentId = ref(0);
  const cards = ref<CardWithComponentIndexed[]>([]);

  const areaData = ref<AreaData>({});

  const projectId = ref<string | null>(null);
  const projectName = ref("Prosjektnavn");
  const projectDescription = ref("");

  const selectedIndicators = ref<
    {
      name: string;
      indicatorSource: IndicatorSource;
      aggregationMethod?: AggregationMethod;
      sourceLevels: MapTilesLayersNamesKey[];
    }[]
  >([]);

  const { pushNotification } = useNotifications();

  function addIndicatorFromCard(card: CardWithComponent) {
    if (isChartCard(card)) {
      const indicator = areaDataIndicators.find(
        (i) => i.name === card.indicatorName,
      );

      if (!indicator) return;

      selectedIndicators.value.push(
        ...indicator.keys.map((key) => ({
          name: key,
          indicatorSource: indicator.indicatorSource,
          aggregationMethod: indicator.aggregationMethod,
          sourceLevels: indicator.sourceLevels,
        })),
      );
    } else if (isInfographicCard(card)) {
      const indicators = card.indicators
        .map((i) =>
          areaDataIndicators.find((indicator) => indicator.name === i.name),
        )
        .filter((i): i is GeoDataVisualKey => !!i);

      indicators.forEach((indicator) => {
        if (!indicator) return;

        selectedIndicators.value.push(
          ...indicator.keys.map((key) => ({
            name: key,
            indicatorSource: indicator.indicatorSource,
            aggregationMethod: indicator.aggregationMethod,
            sourceLevels: indicator.sourceLevels,
          })),
        );
      });
    }
  }

  function deleteIndicatorFromCard(card: CardWithComponent) {
    if (isChartCard(card)) {
      const indicator = areaDataIndicators.find(
        (i) => i.name === card.indicatorName,
      );

      if (!indicator) return;

      const deleteIndex = selectedIndicators.value.findIndex(
        (value) =>
          value.aggregationMethod === indicator.aggregationMethod &&
          value.indicatorSource === indicator.indicatorSource &&
          value.name === indicator.name,
      );

      selectedIndicators.value.splice(deleteIndex, 1);
    } else if (isInfographicCard(card)) {
      const indicators = card.indicators
        .map((i) =>
          areaDataIndicators.find((indicator) => indicator.name === i.name),
        )
        .filter((i): i is GeoDataVisualKey => !!i);

      indicators.forEach((indicator) => {
        if (!indicator) return;

        const deleteIndex = selectedIndicators.value.findIndex(
          (value) =>
            value.aggregationMethod === indicator.aggregationMethod &&
            value.indicatorSource === indicator.indicatorSource &&
            value.name === indicator.name,
        );

        selectedIndicators.value.splice(deleteIndex, 1);
      });
    }
  }

  function addCard(card: CardWithComponent) {
    const newCard = { ...card, id: currentId.value++ };
    cards.value.push(newCard);

    nextTick(() => {
      const newWidget = document.querySelector(
        `[data-card-id="${newCard.id}"]`,
      ) as GridStackElement;
      if (newWidget && getGrid()) {
        getGrid().makeWidget(newWidget);
      }
    });
  }

  function upsertCard(card: CardWithComponent | CardWithComponentIndexed) {
    addIndicatorFromCard(card);

    if (isCardIndexed(card)) {
      const cardIndex = cards.value.findIndex((c) => c.id === (card as any).id);
      cards.value.splice(cardIndex, 1, card as CardWithComponentIndexed);

      nextTick(() => {
        const newWidget = document.querySelector(
          `[data-card-id="${card.id}"]`,
        ) as GridStackElement;
        if (newWidget && getGrid()) {
          getGrid().makeWidget(newWidget);
        }
      });

      return;
    }

    addCard(card);
  }

  function buildMapCard(
    width?: number,
    height?: number,
    x?: number,
    y?: number,
    zoom?: number,
  ): CardWithComponent<MapCard> {
    return {
      title: "Kart",
      cardWidth: width ?? 2,
      cardHeight: height ?? 2,
      x: x ?? 0,
      y: y ?? 0,
      component: markRaw(CommonMap),
      cardMinHeight: 2,
      cardMinWidth: 2,
      draggable: false,
      noMove: true,
      noResize: false,
      locked: true,
      deletable: false,
      cardType: "map",
      initialMapZoom: zoom,
    };
  }

  function buildChartCard(
    indicator: string,
    diagramType: DiagramType,
    chartMode: "numeric" | "percent",
    width?: number,
    height?: number,
    x?: number,
    y?: number,
  ): CardWithComponent<ChartCard> {
    const valueFormat = diagramType === "pie" ? "raw" : "series";

    const chartData = getChartData(
      areaData.value,
      areaDataIndicators,
      indicator,
      valueFormat,
      chartMode,
    );

    let card: Omit<ChartCard, "id"> = {
      cardType: "chart",
      ...chartData,
      chartMode,
      title: indicator,
      indicatorName: indicator,
      cardWidth: width ?? 2,
      cardHeight: height ?? 2,
      cardMinWidth: 2,
      cardMinHeight: 2,
      deletable: true,
      x,
      y,
    };

    if (valueFormat === "series") {
      card = {
        ...card,
        lines: "x",
        displayLine: diagramType === "line",
        valueTitle: chartData.valueTitle,
        percentValueTitle: chartData.percentValueTitle,
        categoryTitle: chartData.categoryTitle,
      } as BarChartCard;
    }

    let component: Component | undefined;
    switch (diagramType) {
      case "bar":
        component = ChartsBar;
        break;
      case "line":
        component = ChartsLine;
        break;
      case "pie":
        component = ChartsPie;
        break;
      default:
        component = ChartsBar;
        break;
    }

    return { ...card, component: markRaw(component) };
  }

  function buildInfographicCard(
    GeoDataVisualKeys: GeoDataVisualKey[],
    chartMode: "numeric" | "percent",
    width?: number,
    height?: number,
    x?: number,
    y?: number,
  ): CardWithComponent<InfographicCard> {
    const indicators = getInfographicsIndicators(GeoDataVisualKeys);

    const cardToAdd: Omit<InfographicCard, "id"> = {
      cardType: "infographic",
      title: "Nøkkeltall",
      chartMode,
      cardHeight: height ?? 2,
      cardWidth: width ?? 2,
      cardMinWidth: 1,
      cardMinHeight: 1,
      indicators,
      deletable: true,
      x,
      y,
    };

    return {
      ...cardToAdd,
      component: markRaw(DashboardInfographic),
    };
  }

  function buildChoroplethCard(
    indicator: string,
    sourceLayer: MapTilesLayersNamesKey,
    chartMode: "numeric" | "percent",
    width?: number,
    height?: number,
    x?: number,
    y?: number,
  ): CardWithComponent<ChoroplethCard> {
    const geoDataIndicator = areaDataIndicators.find(
      (i) => i.name === indicator,
    )?.name;

    const card: Omit<ChoroplethCard, "id"> = {
      cardType: "choropleth",
      title: indicator,
      indicatorName: geoDataIndicator || "",
      chartMode,
      sourceLayer,
      cardWidth: width ?? 2,
      cardHeight: height ?? 2,
      cardMinWidth: 2,
      cardMinHeight: 2,
      deletable: true,
      x,
      y,
    };

    return {
      ...card,
      component: markRaw(DashboardChoropleth),
    };
  }

  function deleteCard(cardId: number) {
    const index = cards.value.findIndex((card) => card.id === cardId);
    const grid = getGrid();
    if (index !== -1) {
      deleteIndicatorFromCard(cards.value[index]);

      const widgetEl = document.querySelector<HTMLElement>(
        `[gs-id="${cardId}"]`,
      );
      if (grid && widgetEl) {
        grid.removeWidget(widgetEl); // removes widget from grid
      }

      cards.value.splice(index, 1);
    }

    grid?.compact();
  }

  function getInfographicsIndicators(
    keys: GeoDataVisualKey[],
  ): VisualIndicator[] {
    return keys.map((item): VisualIndicator => {
      const indicatorValue = getInfographicsData(areaData.value, item.keys);
      return {
        ...item,
        name: item.name,
        value: indicatorValue,
      };
    });
  }

  async function getAreaData(
    areaLayer: MapTilesLayersNamesKey,
    areaId: string,
    extraIndicators?: {
      name: string;
      indicatorSource: IndicatorSource;
      aggregationMethod?: AggregationMethod;
      sourceLevels: MapTilesLayersNamesKey[];
    }[],
  ) {
    const fieldsToFetch = [
      ...selectedIndicators.value
        .concat(...(extraIndicators || []))
        .filter((indicator) => indicator.sourceLevels.includes(areaLayer)),
    ];

    const areaGeoData = await fetchAreaDataById(
      areaLayer,
      [areaId],
      fieldsToFetch,
    );

    areaData.value = areaGeoData.features[0].attributes;
  }

  function eraseAreaData() {
    areaData.value = {};
    reloadCardData();
  }

  function deleteCards() {
    cards.value = [];
  }

  function reloadCardData() {
    isReloading.value = true;

    cards.value = cards.value.map((card) => {
      let cardData: CardWithComponent | undefined;
      if (isChartCard(card)) {
        cardData = buildChartCard(
          card.indicatorName as string,
          getCardDiagramType(card),
          card.chartMode,
          card.cardWidth,
          card.cardHeight,
          card.x,
          card.y,
        );
      } else if (isInfographicCard(card)) {
        const infographicIndicators = card.indicators
          .map((indicator) => {
            return areaDataIndicators.find((i) => i.name === indicator.name);
          })
          .filter((indicator) => indicator) as GeoDataVisualKey[];

        cardData = buildInfographicCard(
          infographicIndicators,
          card.chartMode,
          card.cardWidth,
          card.cardHeight,
          card.x,
          card.y,
        );
      } else if (isChoroplethCard(card)) {
        cardData = buildChoroplethCard(
          card.indicatorName,
          card.sourceLayer,
          card.chartMode,
          card.cardWidth,
          card.cardHeight,
          card.x,
          card.y,
        );
      } else if (isMapCard(card)) {
        cardData = card;
      }
      return { ...cardData, id: card.id } as CardWithComponentIndexed;
    });

    nextTick(() => {
      isReloading.value = false;
    });
  }

  function syncCardsPosition() {
    const grid = getGrid();
    const gridWidgets = grid.save(false);

    if (!Array.isArray(gridWidgets)) {
      throw new TypeError("Could not save grid widgets");
    }

    cards.value.forEach((card) => {
      const widget = gridWidgets.find((w) => w.id === card.id.toString());
      if (!widget) return;
      card.x = widget.x;
      card.y = widget.y;
      widget.w && (card.cardWidth = widget.w);
      widget.h && (card.cardHeight = widget.h);
    });
  }

  async function createProject(project: ProjectWithItems) {
    const { mapSource, selectedArea } = storeToRefs(useMap());
    const { fetchUserMunicipalities } = useAuth();

    const userMunicipalities = await fetchUserMunicipalities();

    if (!userMunicipalities?.length) {
      throw new Error("User has no areas assigned");
    }

    const areaId =
      selectedArea.value?.id.toString() ??
      userMunicipalities[0].municipality_id;

    const { data: insertedProjectId } = await $apiRequest<string>("/projects", {
      method: "POST",
      body: { ...project, areaId, areaType: mapSource.value },
      headers: await useAuth().getAuthorizationHeaders(),
    });

    projectName.value = project.name;
    projectDescription.value = project.description;
    projectId.value = insertedProjectId;
    return insertedProjectId;
  }

  async function deleteProject(id: string) {
    try {
      await $apiRequest(`/projects/${id}`, {
        method: "DELETE",
        headers: await useAuth().getAuthorizationHeaders(),
      });
    } catch (error) {
      pushNotification({
        title: "Error while deleting project",
        type: "error",
        message: getErrorMessage(error),
      });
    }
  }

  async function duplicateProject(id: string) {
    try {
      await $apiRequest("/projects/duplicate", {
        method: "POST",
        body: {
          projectId: id,
        },
        headers: await useAuth().getAuthorizationHeaders(),
      });
    } catch (error) {
      pushNotification({
        title: "Error while deleting project",
        type: "error",
        message: getErrorMessage(error),
      });
    }
  }

  async function saveProject() {
    syncCardsPosition();
    const projectItems = getProjectItems();
    try {
      const { mapSource, selectedArea } = storeToRefs(useMap());
      const { fetchUserMunicipalities } = useAuth();

      const userMunicipalities = await fetchUserMunicipalities();

      if (!userMunicipalities?.length) {
        throw new Error("User has no areas assigned");
      }

      const areaId =
        selectedArea.value?.id.toString() ??
        userMunicipalities[0].municipality_id;

      const requestBody = {
        name: projectName.value,
        description: projectDescription.value,
        areaType: mapSource.value,
        areaId,
        projectItems,
      };

      // Update project if it exists, otherwise create a new one
      if (projectId.value) {
        await $apiRequest(`/projects/${projectId.value}`, {
          method: "PUT",
          body: requestBody,
          headers: await useAuth().getAuthorizationHeaders(),
        });
      } else {
        const { data: id } = await $apiRequest<string>("/projects", {
          method: "POST",
          body: requestBody,
          headers: await useAuth().getAuthorizationHeaders(),
        });
        projectId.value = id;
      }

      isProjectSaved.value = true;
    } catch (error) {
      pushNotification({
        title: "Error while saving project",
        type: "error",
        message: getErrorMessage(error),
      });
    }
  }

  async function fetchProject(id: string) {
    // Mock project for prototype/demo — no backend needed
    if (id === "demo") {
      projectId.value = "demo";
      projectName.value = "Nytt prosjekt";
      projectDescription.value = "";
      deleteCards();
      isReloading.value = false;
      return;
    }

    try {
      isReloading.value = true;
      const { data: project } = await $apiRequest<
        Api.Response.Projects.Project & {
          projectItems: Api.Response.Projects.ProjectItem[];
        }
      >(`/projects/${id}`, {
        method: "GET",
        headers: await useAuth().getAuthorizationHeaders(),
      });

      if (!project) {
        throw new Error("Could not load project");
      }

      projectId.value = project.id;
      projectName.value = project.name;
      projectDescription.value = project.description;

      deleteCards();

      project.projectItems.forEach((projectItem) => {
        const cardType = projectItem.cardType;
        let card: CardWithComponent | undefined;

        switch (cardType) {
          case "chart":
            card = buildChartCard(
              projectItem.indicators[0],
              (projectItem.diagramType || "bar") as DiagramType,
              projectItem.chartMode || "numeric",
              projectItem.cardWidth,
              projectItem.cardHeight,
              projectItem.cardXPosition,
              projectItem.cardYPosition,
            );
            break;

          case "choropleth":
            card = buildChoroplethCard(
              projectItem.indicators[0],
              (projectItem.sourceLayer || "soner") as MapTilesLayersNamesKey,
              projectItem.chartMode || "numeric",
              projectItem.cardWidth,
              projectItem.cardHeight,
              projectItem.cardXPosition,
              projectItem.cardYPosition,
            );
            break;

          case "infographic":
            {
              const infographicIndicators = projectItem.indicators
                .map((indicator) => {
                  return areaDataIndicators.find((i) => i.name === indicator);
                })
                .filter((indicator) => indicator) as GeoDataVisualKey[];

              card = buildInfographicCard(
                infographicIndicators,
                projectItem.chartMode || "numeric",
                projectItem.cardWidth,
                projectItem.cardHeight,
                projectItem.cardXPosition,
                projectItem.cardYPosition,
              );
            }
            break;

          case "map":
            card = buildMapCard(
              projectItem.cardWidth,
              projectItem.cardHeight,
              projectItem.cardXPosition,
              projectItem.cardYPosition,
              projectItem.zoom,
            );
            break;
          default:
            break;
        }
        if (!card) return;

        upsertCard(card);
      });

      // Select area on main map after project load
      if (project.areaType && project.areaId) {
        const areaLayer = mapTilesLayers.find(
          (layer) => layer === project.areaType,
        );
        if (!areaLayer) throw new Error("Could not load area layer");
        const areaId = project.areaId;

        const {
          handleAreaSelection,
          setMapSourceLayer,
          withMapLoaded,
          waitForIdle,
        } = useMap();
        const mapCard = cards.value.find((card) => isMapCard(card)) as
          | MapCard
          | undefined;

        if (!mapCard) return;

        withMapLoaded(async () => {
          setMapSourceLayer(areaLayer, { force: true });
          await waitForIdle();
          handleAreaSelection(
            { id: areaId, name: "" },
            { zoom: mapCard.initialMapZoom },
          );
        });
      }

      isProjectSaved.value = true;
      savedState.watchSave();
      isReloading.value = false;
    } catch (error) {
      pushNotification({
        title: "Error while loading project",
        type: "error",
        message: getErrorMessage(error),
      });
    }
  }

  async function fetchUserProjects() {
    try {
      const { data: projects } = await $apiRequest<
        Api.Response.Projects.Project[]
      >("/projects/user", {
        method: "GET",
        headers: await useAuth().getAuthorizationHeaders(),
      });

      if (!projects) {
        throw new Error("Could not load projects");
      }

      return projects.map((project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }));
    } catch (error) {
      pushNotification({
        title: "Error while loading projects",
        type: "error",
        message: getErrorMessage(error),
      });
    }
  }

  function getProjectItems() {
    const { map } = storeToRefs(useMap());
    return cards.value.reduce(
      (acc, card) => {
        const indicatorType = getCardIndicatorType(card.cardType);

        const newCard: {
          indicators: string[];
          cardType: CardType;
          cardWidth: number;
          cardHeight: number;
          cardXPosition: number;
          cardYPosition: number;
          diagramType?: DiagramType;
          chartMode?: "numeric" | "percent";
          sourceLayer?: MapTilesLayersNamesKey;
          zoom?: number;
        } = {
          indicators: [],
          cardType: card.cardType,
          cardWidth: card.cardWidth,
          cardHeight: card.cardHeight,
          cardXPosition: card.x || 0,
          cardYPosition: card.y || 0,
        };

        switch (indicatorType) {
          case "singleIndicator":
            if (isChoroplethCard(card)) {
              newCard.indicators = [card.indicatorName];
              newCard.sourceLayer = card.sourceLayer;
              newCard.chartMode = card.chartMode;
            } else if (isChartCard(card)) {
              newCard.indicators = [card.indicatorName];
              newCard.diagramType = getCardDiagramType(card);
              newCard.chartMode = card.chartMode;
            }
            break;

          case "multiIndicator":
            if (isInfographicCard(card)) {
              newCard.indicators = card.indicators.map(
                (indicator) => indicator.name,
              );
            }
            break;

          default:
            if (isMapCard(card)) {
              newCard.zoom = map.value?.getZoom();
            }
            break;
        }

        acc.push(newCard);
        return acc;
      },
      [] as {
        indicators: string[];
        cardType: CardType;
        cardWidth: number;
        cardHeight: number;
        cardXPosition: number;
        cardYPosition: number;
        diagramType?: DiagramType;
        zoom?: number;
      }[],
    );
  }

  function clearCurrentProjectData() {
    return new Promise((resolve, _reject) => {
      projectId.value = null;
      projectName.value = "Prosjektnavn";
      projectDescription.value = "";
      deleteCards();
      eraseAreaData();
      savedState.unwatch();
      resolve(true);
    });
  }

  function syncCardElement(el: GridItemHTMLElement) {
    const card = cards.value.find(
      (card) => card.id === parseInt(el.getAttribute("gs-id") || ""),
    );
    if (!card) return;

    card.cardHeight = parseInt(el.getAttribute("gs-h") || "0");
    card.cardWidth = parseInt(el.getAttribute("gs-w") || "0");
    card.x = parseInt(el.getAttribute("gs-x") || "0");
    card.y = parseInt(el.getAttribute("gs-y") || "0");
  }

  const isReloading = ref(false);
  const isProjectSaved = ref(true);
  function getSavedState() {
    const { selectedArea } = storeToRefs(useMap());
    let unwatch: WatchStopHandle | null = null;
    return {
      watchSave: () => {
        if (unwatch !== null) return;
        unwatch = watch(
          [cards, selectedArea],
          ([_newCards, _newArea], [_prevCards, prevArea]) => {
            if (isReloading.value || !prevArea) return;
            isProjectSaved.value = false;
          },
          { deep: true },
        );
      },
      unwatch: () => {
        unwatch?.();
        unwatch = null;
      },
    };
  }
  const savedState = getSavedState();

  return {
    projectId,
    projectName,
    projectDescription,
    saveProject,
    fetchProject,
    fetchUserProjects,
    createProject,
    deleteProject,
    clearCurrentProjectData,

    currentId,
    cards,
    isProjectSaved,
    upsertCard,
    deleteCard,
    duplicateProject,
    buildChartCard,
    buildInfographicCard,
    buildMapCard,
    buildChoroplethCard,

    getAreaData,
    eraseAreaData,
    reloadCardData,

    syncCardElement,
  };
});
