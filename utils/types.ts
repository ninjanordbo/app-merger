import type { Feature } from "geojson";

export interface AreaData {
  [key: string]: string | number;
}

export type DiagramType = "line" | "bar" | "pie" | "table";
export type CardType =
  | "chart"
  | "choropleth"
  | "infographic"
  | "map"
  | "text"
  | "image";
export type IndicatorType = "singleIndicator" | "multiIndicator";
export type IndicatorSource = "ssb" | "geoData";

export const indicatorSources: {
  source: IndicatorSource;
  levels: MapTilesLayersNamesKey[];
}[] = [
  {
    source: "ssb",
    levels: ["soner"],
  },
  {
    source: "geoData",
    levels: ["fylker", "kommuner", "grunnkretser"],
  },
];

export interface Card {
  cardHeight: number;
  cardWidth: number;
  cardType: CardType;
  title?: string;
  x?: number;
  y?: number;

  // TODO: Has to be defined for all type of cards
  cardMaxWidth?: number;
  cardMaxHeight?: number;
  cardMinWidth?: number;
  cardMinHeight?: number;
  draggable?: boolean;
  noMove?: boolean;
  noResize?: boolean;
  locked?: boolean;
  deletable?: boolean;
}

export type CardWithComponent<T extends Card = Card> = T & {
  component: Component;
};

export type CardWithComponentIndexed<T extends Card = Card> =
  CardWithComponent<T> & {
    id: number;
  };

export interface MapCard extends Card {
  initialMapZoom?: number;
}

export interface ChoroplethCard extends Card {
  indicatorName: string;
  sourceLayer: MapTilesLayersNamesKey;
  chartMode: "numeric" | "percent";
}

export interface ChartCard extends Card {
  indicatorName: string;
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  categories: string[];
  chartMode: "numeric" | "percent";
}

export interface BarChartCard extends ChartCard {
  displayLine?: boolean;
  horizontal?: boolean;
  valueTitle?: string;
  percentValueTitle?: string;
  categoryTitle?: string;
  lines?: "y" | "x" | "all";
}

export interface PieChartCard extends ChartCard {
  series: ApexNonAxisChartSeries;
}

export interface VisualIndicator {
  name: string;
  value: string | number | null;
  unit: string;
  iconComponent: Component;
  indicationName?: string;
}

export interface InfographicCard extends Card {
  indicators: VisualIndicator[];
  chartMode: "numeric" | "percent";
}

export function isDiagramType(type: string): type is DiagramType {
  return ["line", "bar", "pie", "table"].includes(type);
}

export type AggregationMethod = "sum" | "weighted_average" | "sum_total";

export interface GeoDataTypeKey {
  name: string;
  keys: string[];
  categories: string[];
  cardTypes: CardType[];
  sourceLevels: MapTilesLayersNamesKey[];
  indicatorSource: IndicatorSource;
  cardDescription: string;
  indicatorDescription: string;
  aggregationMethod: AggregationMethod;
  groupName: string;
  categoryTitle?: string;
  valueTitle?: string;
  percentValueTitle?: string;
  isMedian?: boolean;
}

export interface GeoDataVisualKey extends GeoDataTypeKey {
  iconComponent: Component;
  unit: string;
  indicationName?: string;
}

/* Type Guards */
export function isCardIndexed(
  card: Card | CardWithComponentIndexed,
): card is CardWithComponentIndexed {
  return (card as CardWithComponentIndexed).id !== undefined;
}

export function isChartCard(card: Card): card is ChartCard {
  return (card as ChartCard).cardType === "chart";
}

export function isBarChartCard(card: Card): card is BarChartCard {
  return (
    isChartCard(card) &&
    !!(
      (card as BarChartCard).valueTitle || (card as BarChartCard).categoryTitle
    )
  );
}
export function isLineChartCard(card: Card): card is BarChartCard {
  return !!(card as BarChartCard).displayLine;
}
export function isPieChartCard(card: Card): card is PieChartCard {
  return (
    (card as PieChartCard).series !== undefined &&
    typeof (card as PieChartCard).series[0] === "number"
  );
}

export function isInfographicCard(card: Card): card is InfographicCard {
  return (card as InfographicCard).cardType === "infographic";
}

export function isChoroplethCard(card: Card): card is ChoroplethCard {
  return (card as ChoroplethCard).cardType === "choropleth";
}

export function isMapCard(card: Card): card is MapCard {
  return (card as MapCard).cardType === "map";
}

export function isGeoDataVisualKey(
  indicator: GeoDataTypeKey,
): indicator is GeoDataVisualKey {
  return (
    !!(indicator as GeoDataVisualKey).cardTypes?.length &&
    (indicator as GeoDataVisualKey).cardTypes.includes("choropleth")
  );
}

export function getCardDiagramType(card: ChartCard): DiagramType {
  if (isPieChartCard(card)) return "pie";
  return isLineChartCard(card) ? "line" : "bar";
}

export type CardCreationType = {
  cardType: CardType;
  indicatorType: IndicatorType;
  icon: Component;
  label: string;
  cardDescription: string;
  isComing?: boolean;
};

export type DiagramCreationType = {
  icon: Component;
  label: string;
  diagramType: DiagramType;
  isComing?: boolean;
};

export type Zone = {
  id: string;
  displayId: string;
  name: string;
  inhabitantsAmount: number;
  municipalityId: string;
  canBeDeleted?: boolean;
};

export type Circuit = {
  id: string;
  name: string;
  inhabitantsAmount: number;
  zoneId: string;
  initialZoneId: string;
  hovered: boolean;
};

export declare namespace Api {
  namespace Response {
    type General<T> = {
      error: string | null;
      data: T | null;
      token?: string;
    };

    namespace Auth {
      type Login = {
        id: string;
        username: string;
      };

      type Token = {
        id: string;
        username: string;
      };
    }

    namespace AreaData {
      type Circuit = {
        id: string;
        name: string;
        zone_id: string;
        initial_zone_id: string;
      };

      type Zone = {
        id: string;
        name: string;
        municipalityId: string;
      };

      type UserMunicipalities = {
        user_id: string;
        municipality_id: string;
        submitted: boolean;
      }[];

      type Areas = {
        id: string;
        name: string;
      }[];
    }

    namespace GeoData {
      type AreaData<T extends string> = {
        features: (Feature & {
          id: string;
          attributes: { [K in T]: string | number };
        })[];
      };
    }

    namespace Projects {
      type Project = {
        id: string;
        name: string;
        description: string;
        areaType?: MapTilesLayersNamesKey;
        areaId?: string;
        createdAt: Date;
        updatedAt: Date;
      };

      type ProjectItem = {
        indicators: string[];
        cardType: string;
        cardWidth: number;
        cardHeight: number;
        cardXPosition: number;
        cardYPosition: number;
        chartMode?: "numeric" | "percent";
        diagramType?: string;
        sourceLayer?: string;
        zoom?: number;
      };
    }
  }
}

export type Project = {
  id: string;
  name: string;
  description: string;
  areaType?: string;
  areaId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProjectItem = {
  indicators: string[];
  cardType: CardType;
  cardWidth: number;
  cardHeight: number;
  cardXPosition: number;
  cardYPosition: number;
  diagramType?: string;
};

export type ProjectWithItems = Project & { projectItems: ProjectItem[] };

export type CardExportMethods = "png" | "jpeg" | "csv" | "svg";
