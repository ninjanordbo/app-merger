<script setup lang="ts">
import { computed, markRaw, nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  ArrowLeft,
  Baby,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  Home,
  Leaf,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-vue-next";

const mapImage = "/map-placeholder-dataexplorer.png";
const rangeringMapImage = "/mockup.png";
const rangeringGraphSvg = "/curve-line.png";

type VisualizationType = "fordeling" | "visning";
type ChartType = "bar" | "line" | "pie" | "grid" | "nokkeltall";
type FordelingSubType = "kart" | "soyle" | "kart_soyle";
type GeoLevel = "hele_landet" | "fylke" | "kommune" | "sone" | "levekaarssone";
type IndicatorMode = "single" | "multi";
type DisplayMode = "antall" | "andel";
type PickerTarget = "primary" | "comparison";

interface SubOption {
  id: string;
  name: string;
}

interface Indicator {
  id: string;
  name: string;
  category: string;
  supportedVisualizations: VisualizationType[];
  description: string;
  subOptions?: SubOption[];
  unit?: string;
  minGeoLevel: GeoLevel;
}

interface Region {
  id: string;
  name: string;
  level: GeoLevel;
  parent?: string;
}

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface CuratedIndicatorSet {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  indicatorIds: string[];
  defaultVisualization: VisualizationType;
  defaultChartType: ChartType;
  defaultGeoLevel: GeoLevel;
  defaultRegions: string[];
}

interface RecentEntry {
  type: "indicator" | "curated_set";
  id: string;
  name: string;
  timestamp: number;
  indicatorIds: string[];
}

const GEO_LEVEL_HIERARCHY: Record<GeoLevel, number> = {
  hele_landet: 0,
  fylke: 1,
  kommune: 2,
  sone: 3,
  levekaarssone: 4,
};

const GEO_LEVEL_LABELS: Record<GeoLevel, string> = {
  hele_landet: "Hele landet",
  fylke: "Fylke",
  kommune: "Kommune",
  sone: "Sone",
  levekaarssone: "Levekårssone",
};

const CHART_COLORS = [
  "#3d5a4a",
  "#89a975",
  "#2d5a1e",
  "#a5bd8f",
  "#c0d1a9",
  "#5e7652",
  "#6b8f5b",
  "#3d6630",
  "#b8cca8",
  "#4a5e40",
];

const PIE_COLORS = [
  "#3d5a4a",
  "#89a975",
  "#a5bd8f",
  "#c0d1a9",
  "#5e7652",
  "#6b8f5b",
  "#2d4a3a",
];
const NOKKELTALL_COLORS = [
  "#3d5a4a",
  "#6E448E",
  "#2D6A8A",
  "#B8860B",
  "#89a975",
  "#59377A",
  "#3A7CA5",
  "#D4A017",
];
const CHOROPLETH_COLORS = [
  "#D5C9DD",
  "#BAA5C9",
  "#A082B7",
  "#885FA6",
  "#6E448E",
  "#59377A",
  "#43285C",
];
const GEO_LEVELS: GeoLevel[] = [
  "hele_landet",
  "fylke",
  "kommune",
  "sone",
  "levekaarssone",
];
const VISUALIZATION_TYPES: VisualizationType[] = ["visning", "fordeling"];
const FORDELING_TYPES: FordelingSubType[] = ["kart", "soyle", "kart_soyle"];
const CHART_TYPES: ChartType[] = ["bar", "line", "pie", "nokkeltall"];
const CATEGORIES = [
  "Befolkning",
  "Oppvekst",
  "Utdanning",
  "Økonomi",
  "Arbeidsliv og stønader",
  "Bolig",
  "Geografi",
];
const FILTER_CATEGORIES = [
  "Befolkning",
  "Økonomi",
  "Arbeidsliv og stønader",
  "Bolig",
  "Geografi",
  "Utdanning",
  "Oppvekst",
];
const RECENT_STORAGE_KEY = "dataexplorer-recent-history";
const MAX_RECENT_ENTRIES = 8;

const regions: Region[] = [
  { id: "norge", name: "Norge", level: "hele_landet" },
  { id: "agder", name: "Agder", level: "fylke" },
  { id: "rogaland", name: "Rogaland", level: "fylke" },
  { id: "vestland", name: "Vestland", level: "fylke" },
  { id: "oslo", name: "Oslo", level: "fylke" },
  { id: "viken", name: "Viken", level: "fylke" },
  {
    id: "kristiansand",
    name: "Kristiansand",
    level: "kommune",
    parent: "agder",
  },
  { id: "arendal", name: "Arendal", level: "kommune", parent: "agder" },
  { id: "grimstad", name: "Grimstad", level: "kommune", parent: "agder" },
  { id: "lillesand", name: "Lillesand", level: "kommune", parent: "agder" },
  { id: "stavanger", name: "Stavanger", level: "kommune", parent: "rogaland" },
  { id: "sandnes", name: "Sandnes", level: "kommune", parent: "rogaland" },
  { id: "bergen", name: "Bergen", level: "kommune", parent: "vestland" },
  {
    id: "sone-kvadraturen",
    name: "Kvadraturen",
    level: "sone",
    parent: "kristiansand",
  },
  {
    id: "sone-vagsbygd",
    name: "Vågsbygd",
    level: "sone",
    parent: "kristiansand",
  },
  {
    id: "sone-randesund",
    name: "Randesund",
    level: "sone",
    parent: "kristiansand",
  },
  { id: "sone-lund", name: "Lund", level: "sone", parent: "kristiansand" },
  { id: "sone-hillevag", name: "Hillevåg", level: "sone", parent: "stavanger" },
  { id: "sone-storhaug", name: "Storhaug", level: "sone", parent: "stavanger" },
  {
    id: "lk-kvadraturen-ost",
    name: "Kvadraturen Øst",
    level: "levekaarssone",
    parent: "sone-kvadraturen",
  },
  {
    id: "lk-kvadraturen-vest",
    name: "Kvadraturen Vest",
    level: "levekaarssone",
    parent: "sone-kvadraturen",
  },
  {
    id: "lk-vagsbygd-nord",
    name: "Vågsbygd Nord",
    level: "levekaarssone",
    parent: "sone-vagsbygd",
  },
  {
    id: "lk-vagsbygd-sor",
    name: "Vågsbygd Sør",
    level: "levekaarssone",
    parent: "sone-vagsbygd",
  },
  {
    id: "lk-hillevag-sentrum",
    name: "Hillevåg Sentrum",
    level: "levekaarssone",
    parent: "sone-hillevag",
  },
];

const indicators: Indicator[] = [
  {
    id: "familietyper",
    name: "Familietyper",
    category: "Befolkning",
    supportedVisualizations: ["visning"],
    description:
      "Data om familietyper er delt inn i ulike grupper, og to måltall er tilgjengelige: Antall personer i hver gruppe og andel (prosent) personer i hver gruppe. Gruppene er Enslige uten barn, enslige med barn 0-17 år, par uten barn, par med barn 0-17 år, enfamiliehusstander med voksne barn, flerfamiliehusholdninger (med eller uten barn).",
    subOptions: [
      { id: "kjonn", name: "Kjønn" },
      { id: "aldersfordeling", name: "Aldersfordeling" },
      { id: "familietyper", name: "Familietyper" },
      { id: "sivilstand", name: "Sivilstand" },
    ],
    unit: "%",
    minGeoLevel: "kommune",
  },
  {
    id: "aldersfordeling",
    name: "Aldersfordeling",
    category: "Befolkning",
    supportedVisualizations: ["fordeling", "visning"],
    description:
      "Data om aldersfordeling viser hvordan befolkningen er fordelt inn i ulike aldersgrupper. Statistikken dekker aldersgrupper fra 0-5 år til 80+ år.",
    subOptions: [
      { id: "0-5", name: "0-5 år" },
      { id: "6-15", name: "6-15 år" },
      { id: "16-24", name: "16-24 år" },
      { id: "25-44", name: "25-44 år" },
      { id: "45-66", name: "45-66 år" },
      { id: "67-79", name: "67-79 år" },
      { id: "80+", name: "80+ år" },
    ],
    unit: "personer",
    minGeoLevel: "levekaarssone",
  },
  {
    id: "alder-gjennomsnitt",
    name: "Alder (gjennomsnitt)",
    category: "Befolkning",
    supportedVisualizations: ["fordeling", "visning"],
    description:
      "Data om alder viser gjennomsnittsalder for befolkningen i et område. Sist publisert: 2024-05-15. Datakilde: Statistisk sentralbyrå. Undersøking av nok tall klarer. Datakilde: SSB. Her vises opplysninger fra statistikk-banken.",
    unit: "år",
    minGeoLevel: "levekaarssone",
  },
  {
    id: "flyttinger",
    name: "Flyttinger",
    category: "Befolkning",
    supportedVisualizations: ["visning"],
    description:
      "Flyttestatistikk viser antall inn- og utflyttinger i et geografisk område. Inkluderer innenlands flytting og inn-/utvandring.",
    unit: "personer",
    minGeoLevel: "kommune",
  },
  {
    id: "aleneboende",
    name: "Aleneboende",
    category: "Befolkning",
    supportedVisualizations: ["fordeling", "visning"],
    description:
      "Statistikk om personer som bor alene i en husholdning. Inkluderer alle aldre og begge kjønn.",
    unit: "personer",
    minGeoLevel: "sone",
  },
  {
    id: "innvandrere",
    name: "Innvandrere",
    category: "Befolkning",
    supportedVisualizations: ["fordeling", "visning"],
    description:
      "Statistikk om innvandrere og norskfødte med innvandrerforeldre. Fordelt etter landbakgrunn og botid.",
    unit: "personer",
    minGeoLevel: "fylke",
  },
  {
    id: "barn",
    name: "Barn",
    category: "Oppvekst",
    supportedVisualizations: ["fordeling", "visning"],
    description:
      "Statistikk om barn i alderen 0-17 år. Inkluderer data om barnehagedekning, skoletilbud og levekår.",
    unit: "personer",
    minGeoLevel: "kommune",
  },
  {
    id: "barn-enslige-foreldre",
    name: "Barn med enslige foreldre",
    category: "Oppvekst",
    supportedVisualizations: ["fordeling", "visning"],
    description:
      "Antall barn som bor med én forelder. Fordelt etter alder og kommune.",
    unit: "personer",
    minGeoLevel: "fylke",
  },
  {
    id: "barneflyttinger",
    name: "Barneflyttinger",
    category: "Oppvekst",
    supportedVisualizations: ["visning"],
    description:
      "Statistikk om flyttinger blant barn under 18 år. Inkluderer både innenlands og utenlands flytting.",
    unit: "personer",
    minGeoLevel: "fylke",
  },
  {
    id: "landareal-ssb-api",
    name: "Landareal - SSB API",
    category: "Geografi",
    supportedVisualizations: ["visning"],
    description:
      "Landareal hentet fra SSB API. Viser totalt areal i kvadratkilometer.",
    unit: "km²",
    minGeoLevel: "levekaarssone",
  },
  {
    id: "utdanningsniva",
    name: "Utdanningsnivå",
    category: "Utdanning",
    supportedVisualizations: ["fordeling", "visning"],
    description:
      "Andel av befolkningen med ulike utdanningsnivåer: grunnskole, videregående og høyere utdanning.",
    subOptions: [
      { id: "grunnskole", name: "Grunnskole" },
      { id: "vgs", name: "Videregående" },
      { id: "hoyere", name: "Høyere utdanning" },
    ],
    unit: "%",
    minGeoLevel: "kommune",
  },
  {
    id: "sysselsetting",
    name: "Sysselsetting",
    category: "Arbeidsliv og stønader",
    supportedVisualizations: ["fordeling", "visning"],
    description: "Sysselsettingsgrad for befolkningen i alderen 15-74 år.",
    unit: "%",
    minGeoLevel: "sone",
  },
  {
    id: "medianinntekt",
    name: "Medianinntekt",
    category: "Økonomi",
    supportedVisualizations: ["fordeling", "visning"],
    description:
      "Medianinntekt etter skatt for husholdninger. Oppgitt i tusen kroner.",
    unit: "tusen kr",
    minGeoLevel: "kommune",
  },
];

const curatedSets: CuratedIndicatorSet[] = [
  {
    id: "levekaar",
    name: "Levekårsindeks",
    description:
      "Samlet oversikt over sentrale levekårsindikatorer: inntekt, sysselsetting, utdanning og boforhold.",
    icon: "Heart",
    color: "#3d5a4a",
    indicatorIds: [
      "medianinntekt",
      "sysselsetting",
      "utdanningsniva",
      "aleneboende",
    ],
    defaultVisualization: "visning",
    defaultChartType: "nokkeltall",
    defaultGeoLevel: "kommune",
    defaultRegions: ["kristiansand"],
  },
  {
    id: "befolkningsutvikling",
    name: "Befolkningsutvikling",
    description:
      "Følg befolkningsutviklingen over tid med aldersfordeling, flyttinger og familiestruktur.",
    icon: "TrendingUp",
    color: "#2D6A8A",
    indicatorIds: ["aldersfordeling", "flyttinger", "familietyper"],
    defaultVisualization: "visning",
    defaultChartType: "line",
    defaultGeoLevel: "fylke",
    defaultRegions: ["agder"],
  },
  {
    id: "oppvekst-barn",
    name: "Oppvekst og barn",
    description:
      "Indikatorer knyttet til barns oppvekstvilkår: antall barn, barneflyttinger og enslige foreldre.",
    icon: "Baby",
    color: "#6E448E",
    indicatorIds: ["barn", "barn-enslige-foreldre", "barneflyttinger"],
    defaultVisualization: "visning",
    defaultChartType: "bar",
    defaultGeoLevel: "fylke",
    defaultRegions: ["agder"],
  },
  {
    id: "arbeid-okonomi",
    name: "Arbeid og økonomi",
    description:
      "Sysselsettingsgrad og medianinntekt for å forstå det økonomiske landskapet i regionen.",
    icon: "Briefcase",
    color: "#B8860B",
    indicatorIds: ["sysselsetting", "medianinntekt"],
    defaultVisualization: "visning",
    defaultChartType: "line",
    defaultGeoLevel: "kommune",
    defaultRegions: ["kristiansand"],
  },
  {
    id: "regional-sammenligning",
    name: "Regional sammenligning",
    description:
      "Sammenlign nøkkeltall på tvers av fylker: alder, innvandrere, sysselsetting og inntekt.",
    icon: "Map",
    color: "#c0392b",
    indicatorIds: [
      "alder-gjennomsnitt",
      "innvandrere",
      "sysselsetting",
      "medianinntekt",
    ],
    defaultVisualization: "fordeling",
    defaultChartType: "bar",
    defaultGeoLevel: "fylke",
    defaultRegions: ["agder", "rogaland", "vestland"],
  },
  {
    id: "utdanning-kompetanse",
    name: "Utdanning og kompetanse",
    description:
      "Utdanningsnivået i befolkningen fordelt på grunnskole, videregående og høyere utdanning.",
    icon: "GraduationCap",
    color: "#1a6b5a",
    indicatorIds: ["utdanningsniva"],
    defaultVisualization: "visning",
    defaultChartType: "pie",
    defaultGeoLevel: "kommune",
    defaultRegions: ["kristiansand"],
  },
];

const regionPositions: Record<string, { top: string; left: string }> = {
  norge: { top: "40%", left: "35%" },
  agder: { top: "72%", left: "35%" },
  rogaland: { top: "62%", left: "22%" },
  vestland: { top: "48%", left: "20%" },
  oslo: { top: "52%", left: "45%" },
  viken: { top: "55%", left: "42%" },
  kristiansand: { top: "75%", left: "32%" },
  arendal: { top: "73%", left: "37%" },
  grimstad: { top: "74%", left: "35%" },
  lillesand: { top: "74%", left: "33%" },
  stavanger: { top: "64%", left: "18%" },
  sandnes: { top: "65%", left: "20%" },
  bergen: { top: "50%", left: "16%" },
  "sone-kvadraturen": { top: "76%", left: "31%" },
  "sone-vagsbygd": { top: "77%", left: "29%" },
  "sone-randesund": { top: "75%", left: "34%" },
  "sone-lund": { top: "74%", left: "30%" },
  "sone-hillevag": { top: "63%", left: "17%" },
  "sone-storhaug": { top: "65%", left: "19%" },
  "lk-kvadraturen-ost": { top: "76%", left: "32%" },
  "lk-kvadraturen-vest": { top: "76%", left: "30%" },
  "lk-vagsbygd-nord": { top: "76%", left: "28%" },
  "lk-vagsbygd-sor": { top: "78%", left: "29%" },
  "lk-hillevag-sentrum": { top: "63%", left: "16%" },
};

const demoRecent: RecentEntry[] = [
  {
    type: "indicator",
    id: "familietyper",
    name: "Familietyper i Agder fylke",
    timestamp: Date.now() - 2 * 3600000,
    indicatorIds: ["familietyper"],
  },
  {
    type: "indicator",
    id: "medianinntekt",
    name: "Boligpriser i Oslo",
    timestamp: Date.now() - 365 * 86400000,
    indicatorIds: ["medianinntekt"],
  },
  {
    type: "indicator",
    id: "barn",
    name: "Barnefattigdom 2023",
    timestamp: Date.now() - 3 * 86400000,
    indicatorIds: ["barn"],
  },
  {
    type: "indicator",
    id: "sysselsetting",
    name: "Sysselsetting Kristiansand",
    timestamp: Date.now() - 7 * 86400000,
    indicatorIds: ["sysselsetting"],
  },
];

const demoRecentTags: Record<string, string[]> = {
  familietyper: ["Befolkning", "Agder"],
  medianinntekt: ["Bolig", "Oslo"],
  barn: ["Økonomi", "Nasjonalt"],
  sysselsetting: ["Arbeid", "Kommune"],
};

const allCategories = [
  { name: "Befolkning", Icon: markRaw(TrendingUp) },
  { name: "Arbeidsliv og stønader", Icon: markRaw(Briefcase) },
  { name: "Bolig", Icon: markRaw(Home) },
  { name: "Utdanning", Icon: markRaw(GraduationCap) },
  { name: "Helse", Icon: markRaw(ShieldCheck) },
  { name: "Klima & Miljø", Icon: markRaw(Leaf) },
  { name: "Økonomi", Icon: markRaw(Briefcase) },
  { name: "Oppvekst", Icon: markRaw(Baby) },
];

const showLandingPage = ref(false);
const visualizationType = ref<VisualizationType>("visning");
const chartType = ref<ChartType>("line");
const fordelingSubType = ref<FordelingSubType>("kart");
const selectedIndicators = ref<string[]>(["familietyper"]);
const selectedRegions = ref<string[]>(["agder", "norge"]);
const geoLevel = ref<GeoLevel>("fylke");
const indicatorMode = ref<IndicatorMode>("single");
const isFullscreen = ref(false);
const displayMode = ref<DisplayMode>("antall");
const menuExpanded = ref(true);
const recentEntries = ref<RecentEntry[]>([]);

const pickerOpen = ref(false);
const pickerTarget = ref<PickerTarget>("primary");
const regionSearchQuery = ref("");
const pickerRef = ref<HTMLElement | null>(null);

const indicatorSearchTerm = ref("");
const expandedCategories = ref<string[]>(["Befolkning"]);
const indicatorFilterCategories = ref<string[]>([]);
const indicatorFilterVisualization = ref<VisualizationType[]>([]);
const indicatorFilterGeoLevels = ref<GeoLevel[]>([]);
const filterModalOpen = ref(false);
const showIndicatorCategoryFilter = ref(true);
const showIndicatorVisualizationFilter = ref(true);
const showIndicatorGeoFilter = ref(false);
const showIndicatorTimeFilter = ref(false);
const expandedDescriptions = ref<Record<string, boolean>>({});

const librarySearchTerm = ref("");
const libraryFilterCategories = ref<string[]>([]);
const libraryFilterVisualization = ref<VisualizationType[]>([]);
const libraryFilterGeoLevels = ref<GeoLevel[]>([]);
const libraryShowCategoryFilter = ref(true);
const libraryShowVisualizationFilter = ref(false);
const libraryShowGeoFilter = ref(false);
const selectedLibraryIndicatorId = ref<string | null>(null);
const selectedLibraryCategory = ref<string | null>(null);

function isGeoLevelAvailable(
  indicatorMinLevel: GeoLevel,
  currentLevel: GeoLevel,
): boolean {
  return (
    GEO_LEVEL_HIERARCHY[currentLevel] <= GEO_LEVEL_HIERARCHY[indicatorMinLevel]
  );
}

function regionById(id: string) {
  return regions.find((region) => region.id === id);
}

function indicatorById(id: string) {
  return indicators.find((indicator) => indicator.id === id);
}

function generateChartData(
  indicatorId: string,
  regionIds: string[],
): ChartDataPoint[] {
  const seed = indicatorId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i: number) =>
    ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
  const labels: Record<string, string[]> = {
    familietyper: [
      "Ugift Mann",
      "Ugift Kvinne",
      "Gift",
      "Enke/enkemann",
      "Separert/skilt",
    ],
    aldersfordeling: [
      "0-5 år",
      "6-15 år",
      "16-24 år",
      "25-44 år",
      "45-66 år",
      "67-79 år",
      "80+ år",
    ],
    "alder-gjennomsnitt": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
    ],
    flyttinger: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    aleneboende: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    innvandrere: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    barn: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    "barn-enslige-foreldre": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
    ],
    barneflyttinger: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    "landareal-ssb-api": ["Agder", "Rogaland", "Vestland", "Oslo", "Viken"],
    utdanningsniva: ["Grunnskole", "Videregående", "Høyere utdanning"],
    sysselsetting: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    medianinntekt: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
  };
  const ranges: Record<string, [number, number]> = {
    familietyper: [5, 35],
    aldersfordeling: [500, 8000],
    "alder-gjennomsnitt": [38, 44],
    flyttinger: [50, 200],
    aleneboende: [100, 400],
    innvandrere: [30, 150],
    barn: [80, 250],
    "barn-enslige-foreldre": [10, 60],
    barneflyttinger: [3, 15],
    "landareal-ssb-api": [400, 16000],
    utdanningsniva: [15, 50],
    sysselsetting: [60, 80],
    medianinntekt: [350, 550],
  };
  const cats = labels[indicatorId] || ["A", "B", "C", "D", "E"];
  const [lo, hi] = ranges[indicatorId] || [10, 100];
  return cats.map((name, i) => {
    const point: ChartDataPoint = { name };
    const activeRegions = regionIds.length > 0 ? regionIds : ["agder"];
    activeRegions.forEach((regionId, ri) => {
      const regionLabel = regionById(regionId)?.name || regionId;
      const val = lo + rng(i * 100 + ri * 17 + seed) * (hi - lo);
      point[regionLabel] = Math.round(val * 10) / 10;
    });
    return point;
  });
}

function generateKeyFigure(indicatorId: string, regionId: string): number {
  const seed = (indicatorId + regionId)
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = ((seed * 9301 + 49297) % 233280) / 233280;
  const ranges: Record<string, [number, number]> = {
    "alder-gjennomsnitt": [36, 45],
    flyttinger: [40, 200],
    aleneboende: [100, 400],
    innvandrere: [30, 200],
    barn: [80, 300],
    "barn-enslige-foreldre": [10, 80],
    barneflyttinger: [2, 20],
    "landareal-ssb-api": [400, 16000],
    sysselsetting: [60, 82],
    medianinntekt: [350, 600],
  };
  const [lo, hi] = ranges[indicatorId] || [10, 500];
  return Math.round((lo + rng * (hi - lo)) * 10) / 10;
}

function loadRecentHistory(): RecentEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!stored) return [];
    return (JSON.parse(stored) as RecentEntry[])
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_RECENT_ENTRIES);
  } catch {
    return [];
  }
}

function saveToRecentHistory(entry: RecentEntry): void {
  if (typeof localStorage === "undefined") return;
  try {
    const existing = loadRecentHistory();
    const filtered = existing.filter(
      (item) => !(item.type === entry.type && item.id === entry.id),
    );
    localStorage.setItem(
      RECENT_STORAGE_KEY,
      JSON.stringify([entry, ...filtered].slice(0, MAX_RECENT_ENTRIES)),
    );
  } catch {
    // localStorage can be unavailable in privacy contexts.
  }
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const years = Math.floor(diff / (86400000 * 365));
  if (minutes < 2) return "Akkurat nå";
  if (hours < 1) return `${minutes} minutter siden`;
  if (hours < 24) return `${hours} time${hours > 1 ? "r" : ""} siden`;
  if (days < 7) return `${days} dag${days > 1 ? "er" : ""} siden`;
  if (years < 1)
    return `${Math.floor(days / 7)} uke${Math.floor(days / 7) > 1 ? "r" : ""} siden`;
  return `${years} år siden`;
}

const selectedIndicatorObjects = computed(() =>
  indicators.filter((indicator) =>
    selectedIndicators.value.includes(indicator.id),
  ),
);
const activeIndicator = computed(() => selectedIndicatorObjects.value[0]);
const selectedRegionObjects = computed(
  () => selectedRegions.value.map(regionById).filter(Boolean) as Region[],
);
const primaryRegion = computed(() => selectedRegionObjects.value[0]);
const comparisonRegions = computed(() => selectedRegionObjects.value.slice(1));
const chartData = computed(() =>
  activeIndicator.value
    ? generateChartData(activeIndicator.value.id, selectedRegions.value)
    : [],
);
const regionNames = computed(() =>
  selectedRegions.value.map((id) => regionById(id)?.name || id),
);
const geoLevelLabel = computed(() =>
  GEO_LEVEL_LABELS[geoLevel.value].toLowerCase(),
);
const areIndicatorsCompatible = computed(() =>
  selectedIndicatorObjects.value.every((indicator) =>
    indicator.supportedVisualizations.includes(visualizationType.value),
  ),
);
const areIndicatorsGeoCompatible = computed(() =>
  selectedIndicatorObjects.value.every((indicator) =>
    isGeoLevelAvailable(indicator.minGeoLevel, geoLevel.value),
  ),
);
const panelTitle = computed(() => {
  const regionName = selectedRegionObjects.value[0]?.name || "Agder";
  if (chartType.value === "nokkeltall")
    return `Nøkkeltall for ${regionName} ${geoLevelLabel.value}`;
  if (selectedIndicatorObjects.value.length > 0)
    return `${selectedIndicatorObjects.value[0].name} i ${regionName} ${geoLevelLabel.value}`;
  return "Datautforsker";
});

const regionsAtLevel = computed(() =>
  regions.filter((region) => region.level === geoLevel.value),
);
const filteredRegions = computed(() => {
  if (!regionSearchQuery.value.trim()) return regionsAtLevel.value;
  const query = regionSearchQuery.value.toLowerCase();
  return regionsAtLevel.value.filter((region) =>
    region.name.toLowerCase().includes(query),
  );
});

const indicatorActiveFilterTags = computed(() => {
  const tags: { key: string; label: string; onRemove: () => void }[] = [];
  indicatorFilterVisualization.value.forEach((vis) =>
    tags.push({
      key: `vis-${vis}`,
      label: vis === "fordeling" ? "Sammenligning" : "Oversikt",
      onRemove: () => toggleArray(indicatorFilterVisualization, vis),
    }),
  );
  indicatorFilterCategories.value.forEach((cat) =>
    tags.push({
      key: `cat-${cat}`,
      label: cat,
      onRemove: () => toggleArray(indicatorFilterCategories, cat),
    }),
  );
  indicatorFilterGeoLevels.value.forEach((level) =>
    tags.push({
      key: `geo-${level}`,
      label: GEO_LEVEL_LABELS[level],
      onRemove: () => toggleArray(indicatorFilterGeoLevels, level),
    }),
  );
  return tags;
});

const filteredIndicators = computed(() =>
  indicators.filter((indicator) => {
    if (
      indicatorSearchTerm.value &&
      !indicator.name
        .toLowerCase()
        .includes(indicatorSearchTerm.value.toLowerCase())
    )
      return false;
    if (
      indicatorFilterCategories.value.length > 0 &&
      !indicatorFilterCategories.value.includes(indicator.category)
    )
      return false;
    if (
      indicatorFilterVisualization.value.length > 0 &&
      !indicatorFilterVisualization.value.some((vis) =>
        indicator.supportedVisualizations.includes(vis),
      )
    )
      return false;
    if (
      indicatorFilterGeoLevels.value.length > 0 &&
      !indicatorFilterGeoLevels.value.some((level) =>
        isGeoLevelAvailable(indicator.minGeoLevel, level),
      )
    )
      return false;
    return true;
  }),
);

const categorizedIndicators = computed(() => {
  return filteredIndicators.value.reduce<Record<string, Indicator[]>>(
    (acc, indicator) => {
      acc[indicator.category] ||= [];
      acc[indicator.category].push(indicator);
      return acc;
    },
    {},
  );
});
const visibleIndicatorCategories = computed(() =>
  CATEGORIES.filter((category) => categorizedIndicators.value[category]),
);
const emptyIndicatorCategories = computed(() =>
  CATEGORIES.filter((category) => !categorizedIndicators.value[category]),
);

const selectedDescriptionIndicators = computed(
  () =>
    selectedIndicators.value.map(indicatorById).filter(Boolean) as Indicator[],
);
const geoUnavailableIndicators = computed(() =>
  indicators.filter(
    (indicator) => !isGeoLevelAvailable(indicator.minGeoLevel, geoLevel.value),
  ),
);
const categoryData = computed(() =>
  allCategories.map((category) => ({
    ...category,
    count: indicators.filter(
      (indicator) => indicator.category === category.name,
    ).length,
  })),
);

const libraryHasActiveFilters = computed(
  () =>
    libraryFilterCategories.value.length > 0 ||
    libraryFilterVisualization.value.length > 0 ||
    libraryFilterGeoLevels.value.length > 0 ||
    Boolean(librarySearchTerm.value),
);
const libraryFilteredIndicators = computed(() =>
  indicators.filter((indicator) => {
    const query = librarySearchTerm.value.toLowerCase();
    if (
      query &&
      !indicator.name.toLowerCase().includes(query) &&
      !indicator.description.toLowerCase().includes(query)
    )
      return false;
    if (
      libraryFilterCategories.value.length > 0 &&
      !libraryFilterCategories.value.includes(indicator.category)
    )
      return false;
    if (
      libraryFilterVisualization.value.length > 0 &&
      !libraryFilterVisualization.value.some((vis) =>
        indicator.supportedVisualizations.includes(vis),
      )
    )
      return false;
    if (libraryFilterGeoLevels.value.length > 0) {
      const indLevel = GEO_LEVELS.indexOf(indicator.minGeoLevel);
      if (
        !libraryFilterGeoLevels.value.some(
          (level) => GEO_LEVELS.indexOf(level) >= indLevel,
        )
      )
        return false;
    }
    return true;
  }),
);
const libraryGroupedIndicators = computed(() => {
  return libraryFilteredIndicators.value.reduce<Record<string, Indicator[]>>(
    (acc, indicator) => {
      acc[indicator.category] ||= [];
      acc[indicator.category].push(indicator);
      return acc;
    },
    {},
  );
});
const libraryActiveGroupCategories = computed(() =>
  Object.keys(libraryGroupedIndicators.value),
);
const selectedLibraryIndicator = computed(() =>
  selectedLibraryIndicatorId.value
    ? indicatorById(selectedLibraryIndicatorId.value)
    : null,
);
const displayedRecent = computed(() => {
  const real = recentEntries.value.slice(0, 4);
  if (real.length >= 4) return real;
  const realIds = new Set(real.map((entry) => entry.id));
  return [
    ...real,
    ...demoRecent.filter((entry) => !realIds.has(entry.id)),
  ].slice(0, 4);
});

const chartValueRange = computed(() => {
  const values = chartData.value.flatMap((point) =>
    regionNames.value
      .map((name) => Number(point[name]))
      .filter((value) => Number.isFinite(value)),
  );
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  return { min, max: max === min ? min + 1 : max };
});

const lineSeries = computed(() =>
  regionNames.value.map((name, regionIndex) => ({
    name,
    color: CHART_COLORS[regionIndex % CHART_COLORS.length],
    path: chartData.value
      .map((point, index) => {
        const x = 60 + (index * 680) / Math.max(chartData.value.length - 1, 1);
        const value = Number(point[name]) || 0;
        const y =
          310 -
          ((value - chartValueRange.value.min) /
            (chartValueRange.value.max - chartValueRange.value.min)) *
            250;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" "),
  })),
);

const pieData = computed(() => {
  const name = regionNames.value[0];
  const raw = chartData.value.map((point, index) => ({
    name: point.name,
    value: Number(point[name]) || 0,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));
  const total = raw.reduce((sum, item) => sum + item.value, 0) || 1;
  let cursor = 0;
  return raw.map((item) => {
    const start = cursor;
    const angle = (item.value / total) * 360;
    cursor += angle;
    return {
      ...item,
      total,
      start,
      angle,
      path: describeArc(
        160,
        150,
        isFullscreen.value ? 118 : 96,
        start,
        start + angle,
      ),
    };
  });
});

const legendRanges = computed(() => {
  if (!activeIndicator.value) return [];
  const rangesMap: Record<string, [number, number]> = {
    familietyper: [5, 35],
    aldersfordeling: [500, 8000],
    "alder-gjennomsnitt": [35, 45],
    flyttinger: [40, 200],
    aleneboende: [100, 400],
    innvandrere: [30, 150],
    barn: [80, 250],
    "barn-enslige-foreldre": [10, 60],
    barneflyttinger: [3, 15],
    "landareal-ssb-api": [400, 16000],
    utdanningsniva: [15, 50],
    sysselsetting: [60, 80],
    medianinntekt: [350, 550],
  };
  const [lo, hi] = rangesMap[activeIndicator.value.id] || [10, 100];
  const stepSize = (hi - lo) / CHOROPLETH_COLORS.length;
  return CHOROPLETH_COLORS.map((color, i) => ({
    color,
    label: `${Math.round(lo + stepSize * i)} - ${Math.round(lo + stepSize * (i + 1))}`,
  }));
});

function toggleArray<T>(target: { value: T[] }, item: T) {
  target.value = target.value.includes(item)
    ? target.value.filter((candidate) => candidate !== item)
    : [...target.value, item];
}

function toggleLibraryFilterCategory(category: string) {
  toggleArray(libraryFilterCategories, category);
}

function toggleLibraryFilterVisualization(type: VisualizationType) {
  toggleArray(libraryFilterVisualization, type);
}

function toggleLibraryFilterGeoLevel(level: GeoLevel) {
  toggleArray(libraryFilterGeoLevels, level);
}

function toggleIndicatorFilterCategory(category: string) {
  toggleArray(indicatorFilterCategories, category);
}

function toggleIndicatorFilterVisualization(type: VisualizationType) {
  toggleArray(indicatorFilterVisualization, type);
}

function toggleIndicatorFilterGeoLevel(level: GeoLevel) {
  toggleArray(indicatorFilterGeoLevels, level);
}

function toggleExpandedCategory(category: string) {
  toggleArray(expandedCategories, category);
}

function clearIndicatorFilters() {
  indicatorFilterCategories.value = [];
  indicatorFilterVisualization.value = [];
  indicatorFilterGeoLevels.value = [];
  indicatorSearchTerm.value = "";
}

function clearLibraryFilters() {
  libraryFilterCategories.value = [];
  libraryFilterVisualization.value = [];
  libraryFilterGeoLevels.value = [];
  librarySearchTerm.value = "";
  selectedLibraryCategory.value = null;
}

function selectVisualization(type: VisualizationType) {
  visualizationType.value = type;
  indicatorMode.value = "single";
  selectedIndicators.value =
    selectedIndicators.value.length > 0
      ? [selectedIndicators.value[0]]
      : ["aldersfordeling"];
}

function selectChartType(type: ChartType) {
  chartType.value = type;
  if (type === "nokkeltall") {
    indicatorMode.value = "multi";
    selectedIndicators.value =
      selectedIndicators.value.length > 0
        ? selectedIndicators.value
        : ["alder-gjennomsnitt"];
  } else {
    indicatorMode.value = "single";
    selectedIndicators.value =
      selectedIndicators.value.length > 0
        ? [selectedIndicators.value[0]]
        : selectedIndicators.value;
  }
}

function toggleIndicator(indicatorId: string) {
  if (indicatorMode.value === "multi") {
    if (selectedIndicators.value.includes(indicatorId)) {
      selectedIndicators.value =
        selectedIndicators.value.length > 1
          ? selectedIndicators.value.filter((id) => id !== indicatorId)
          : selectedIndicators.value;
    } else {
      selectedIndicators.value = [...selectedIndicators.value, indicatorId];
    }
  } else {
    selectedIndicators.value = [indicatorId];
  }
  const indicator = indicatorById(indicatorId);
  if (indicator) {
    saveToRecentHistory({
      type: "indicator",
      id: indicatorId,
      name: indicator.name,
      timestamp: Date.now(),
      indicatorIds: [indicatorId],
    });
    recentEntries.value = loadRecentHistory();
  }
}

function selectIndicatorMode(mode: IndicatorMode) {
  indicatorMode.value = mode;
  if (mode === "single" && selectedIndicators.value.length > 1)
    selectedIndicators.value = [selectedIndicators.value[0]];
}

function changeGeoLevel(level: GeoLevel) {
  geoLevel.value = level;
  const firstRegionAtLevel = regions.find((region) => region.level === level);
  if (firstRegionAtLevel) selectedRegions.value = [firstRegionAtLevel.id];
}

function setPrimaryRegion(regionId: string) {
  const comparisons = selectedRegions.value
    .slice(1)
    .filter((id) => id !== regionId);
  selectedRegions.value = [regionId, ...comparisons];
}

function addComparisonRegion(regionId: string) {
  if (
    selectedRegions.value.includes(regionId) ||
    selectedRegions.value.length >= 6
  )
    return;
  selectedRegions.value = [...selectedRegions.value, regionId];
}

function removeComparisonRegion(regionId: string) {
  if (selectedRegions.value[0] === regionId) return;
  selectedRegions.value = selectedRegions.value.filter((id) => id !== regionId);
}

async function openPicker(target: PickerTarget) {
  pickerTarget.value = target;
  pickerOpen.value = true;
  regionSearchQuery.value = "";
  await nextTick();
}

function selectRegion(regionId: string) {
  if (pickerTarget.value === "primary") {
    setPrimaryRegion(regionId);
    pickerOpen.value = false;
    regionSearchQuery.value = "";
    return;
  }
  if (
    selectedRegions.value.includes(regionId) &&
    selectedRegions.value[0] !== regionId
  )
    removeComparisonRegion(regionId);
  else if (!selectedRegions.value.includes(regionId))
    addComparisonRegion(regionId);
}

function selectCuratedSet(set: CuratedIndicatorSet) {
  indicatorMode.value =
    set.defaultChartType === "nokkeltall" && set.indicatorIds.length > 1
      ? "multi"
      : "single";
  selectedIndicators.value =
    indicatorMode.value === "multi"
      ? set.indicatorIds
      : [set.indicatorIds[0] || "familietyper"];
  visualizationType.value = set.defaultVisualization;
  chartType.value = set.defaultChartType;
  geoLevel.value = set.defaultGeoLevel;
  selectedRegions.value = set.defaultRegions;
  saveToRecentHistory({
    type: "curated_set",
    id: set.id,
    name: set.name,
    timestamp: Date.now(),
    indicatorIds: set.indicatorIds,
  });
  recentEntries.value = loadRecentHistory();
  showLandingPage.value = false;
}

function selectRecentIndicator(entry: RecentEntry) {
  if (entry.type === "curated_set") {
    const set = curatedSets.find((item) => item.id === entry.id);
    if (set) {
      selectCuratedSet(set);
      return;
    }
  }
  selectedIndicators.value = [entry.id];
  visualizationType.value = "visning";
  chartType.value = "line";
  indicatorMode.value = "single";
  saveToRecentHistory({ ...entry, timestamp: Date.now() });
  recentEntries.value = loadRecentHistory();
  showLandingPage.value = false;
}

function selectIndicatorFromLibrary(indicatorId: string) {
  const indicator = indicatorById(indicatorId);
  if (!indicator) return;
  selectedIndicators.value = [indicatorId];
  visualizationType.value = "visning";
  chartType.value = "line";
  indicatorMode.value = "single";
  saveToRecentHistory({
    type: "indicator",
    id: indicatorId,
    name: indicator.name,
    timestamp: Date.now(),
    indicatorIds: [indicatorId],
  });
  recentEntries.value = loadRecentHistory();
  showLandingPage.value = false;
}

function toggleLibraryCategory(category: string) {
  if (selectedLibraryCategory.value === category) {
    selectedLibraryCategory.value = null;
    libraryFilterCategories.value = libraryFilterCategories.value.filter(
      (item) => item !== category,
    );
  } else {
    selectedLibraryCategory.value = category;
    libraryFilterCategories.value = [category];
  }
}

function toggleDescription(id: string) {
  expandedDescriptions.value = {
    ...expandedDescriptions.value,
    [id]: expandedDescriptions.value[id] === false,
  };
}

function trendFor(id: string) {
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const val = ((seed % 120) - 30) / 10;
  return { value: Math.abs(val), positive: val >= 0 };
}

function formatNumber(value: number) {
  return value.toLocaleString("nb-NO");
}

function barHeight(point: ChartDataPoint, regionName: string) {
  const value = Number(point[regionName]) || 0;
  return Math.max(
    2,
    ((value - chartValueRange.value.min) /
      (chartValueRange.value.max - chartValueRange.value.min)) *
      250,
  );
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    cx,
    cy,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

function handleOutsidePicker(event: MouseEvent) {
  if (
    pickerOpen.value &&
    pickerRef.value &&
    !pickerRef.value.contains(event.target as Node)
  ) {
    pickerOpen.value = false;
    regionSearchQuery.value = "";
  }
}

function addCardToDashboard() {
  if (!activeIndicator.value || selectedRegions.value.length === 0) {
    return;
  }

  const dashboard = useDashboard();
  const createCard = useCreateCard();
  const { closeCardEdit } = createCard;

  // Map DataExplorer chartType to DiagramType
  let diagramType: "bar" | "line" | "pie" | "table" = "bar";
  switch (chartType.value) {
    case "line":
      diagramType = "line";
      break;
    case "pie":
      diagramType = "pie";
      break;
    case "bar":
      diagramType = "bar";
      break;
    default:
      diagramType = "bar";
  }

  // Determine chart mode based on displayMode
  const chartMode = displayMode.value === "andel" ? "percent" : "numeric";

  // Build the card with component using dashboard store
  const cardWithComponent = dashboard.buildChartCard(
    activeIndicator.value.name,
    diagramType,
    chartMode,
    4, // width
    3, // height
  );

  // Add the card to dashboard using upsertCard
  dashboard.upsertCard(cardWithComponent);

  // Close the drawer
  closeCardEdit();
}

onMounted(() => {
  recentEntries.value = loadRecentHistory();
  document.addEventListener("mousedown", handleOutsidePicker);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleOutsidePicker);
});
</script>

<template>
  <div class="flex h-full bg-[#f0f0f0] font-['Epilogue',sans-serif]">
    <main
      class="flex-1 flex flex-col gap-[16px] p-[16px] min-w-0 overflow-y-auto"
    >
      <header
        class="bg-white rounded-[12px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-between pl-[24px] pr-[64px] py-[10px] shrink-0"
      >
        <div class="flex items-center gap-[8px]">
          <div class="w-[3px] h-[20px] bg-[#89B56B] rounded-full" />
          <span class="font-medium text-[18px] text-[#2d2d2d]">{{
            showLandingPage ? "Indikatorbibliotek" : "Datautforsker"
          }}</span>
          <!-- <button
            v-if="!showLandingPage"
            class="ml-[8px] flex items-center gap-[4px] px-[12px] py-[5px] text-[13px] text-[#3d5a4a] hover:bg-[#f5f5f5] rounded-[6px] transition-colors"
            @click="showLandingPage = true"
          >
            <ArrowLeft class="w-[14px] h-[14px]" />
            Bibliotek
          </button> -->
        </div>
        <div v-if="!showLandingPage" class="flex items-center gap-[8px]">
          <button
            class="flex items-center gap-[6px] rounded-md border-2 border-[#3d5a4a] bg-white py-1.5 pl-2 pr-3 text-[13px] text-[#3d5a4a] duration-200 hover:-translate-y-1"
            title="Legg til kort i dashboard"
            @click="addCardToDashboard"
          >
            <Plus class="w-[16px] h-[16px]" />
            <span>Bruk</span>
          </button>
          <button
            class="w-[34px] h-[34px] bg-[#3d5a4a] rounded-[6px] hover:bg-[#2d4a3a] transition-colors flex items-center justify-center"
            :title="isFullscreen ? 'Lukk fullskjerm' : 'Fullskjerm'"
            @click="isFullscreen = !isFullscreen"
          >
          <svg
            v-if="isFullscreen"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
        </div>
      </header>

      <section
        v-if="showLandingPage"
        class="flex-1 flex flex-col gap-0 min-h-0 overflow-y-auto bg-[#f7f8f7]"
      >
        <div class="px-[28px] pt-[24px] pb-0">
          <div class="flex items-center gap-[8px] mb-[14px]">
            <div class="w-[3px] h-[16px] bg-[#89B56B] rounded-full" />
            <span class="font-semibold text-[15px] text-[#2d2d2d]"
              >Nylig utforsket</span
            >
          </div>
          <div class="flex gap-[14px]">
            <button
              v-for="(entry, index) in displayedRecent"
              :key="entry.id + index"
              class="flex-1 bg-white rounded-[12px] border border-[#e8e8e8] shadow-[0_1px_4px_rgba(0,0,0,0.05)] px-[18px] py-[16px] text-left hover:border-[#c8d8c8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all group cursor-pointer"
              @click="selectRecentIndicator(entry)"
            >
              <div class="flex items-start gap-[12px]">
                <div
                  class="w-[32px] h-[32px] rounded-[8px] bg-[#f5f5f5] flex items-center justify-center shrink-0 mt-[1px]"
                >
                  <Clock class="w-[14px] h-[14px] text-[#9aaa99]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="font-semibold text-[13px] text-[#2d2d2d] leading-[19px] mb-[3px] group-hover:text-[#3d5a4a] transition-colors"
                  >
                    {{ entry.name }}
                  </div>
                  <div class="text-[11px] text-[#a0a0a0] mb-[10px]">
                    Sist åpnet: {{ formatRelativeTime(entry.timestamp) }}
                  </div>
                  <div class="flex gap-[5px] flex-wrap">
                    <span
                      v-for="tag in demoRecentTags[entry.id] || [
                        entry.indicatorIds[0],
                      ]"
                      :key="tag"
                      class="px-[8px] py-[2px] bg-[#f2f4f2] rounded-[5px] text-[10px] font-medium text-[#6a7a6a]"
                      >{{ tag }}</span
                    >
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="px-[28px] pt-[24px] pb-0">
          <div class="flex items-center justify-between mb-[14px]">
            <div class="flex items-center gap-[8px]">
              <div class="w-[3px] h-[16px] bg-[#89B56B] rounded-full" />
              <span class="font-semibold text-[15px] text-[#2d2d2d]"
                >Velg kategori</span
              >
            </div>
            <button
              class="text-[12px] text-[#3d5a4a] font-medium hover:underline"
            >
              Se alle kategorier
            </button>
          </div>
          <div class="grid grid-cols-8 gap-[10px]">
            <button
              v-for="category in categoryData.slice(0, 8)"
              :key="category.name"
              class="rounded-[12px] border px-[10px] py-[16px] flex flex-col items-center gap-[8px] transition-all cursor-pointer"
              :class="
                selectedLibraryCategory === category.name
                  ? 'bg-[#3d5a4a] border-[#3d5a4a] shadow-[0_2px_8px_rgba(61,90,74,0.25)]'
                  : 'bg-white border-[#e8e8e8] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#c8d8c8] hover:shadow-[0_2px_6px_rgba(0,0,0,0.07)]'
              "
              @click="toggleLibraryCategory(category.name)"
            >
              <div
                class="w-[36px] h-[36px] rounded-full flex items-center justify-center"
                :class="
                  selectedLibraryCategory === category.name
                    ? 'bg-white/20'
                    : 'bg-[#eef4e8]'
                "
              >
                <component
                  :is="category.Icon"
                  class="w-[16px] h-[16px]"
                  :class="
                    selectedLibraryCategory === category.name
                      ? 'text-white'
                      : 'text-[#89B56B]'
                  "
                />
              </div>
              <div
                class="font-semibold text-[11px] text-center leading-tight"
                :class="
                  selectedLibraryCategory === category.name
                    ? 'text-white'
                    : 'text-[#2d2d2d]'
                "
              >
                {{ category.name }}
              </div>
              <div
                class="text-[10px] text-center"
                :class="
                  selectedLibraryCategory === category.name
                    ? 'text-white/70'
                    : 'text-[#a0a0a0]'
                "
              >
                {{ category.count }} indikatorsett
              </div>
            </button>
          </div>
        </div>

        <div class="px-[28px] pt-[24px] pb-[28px] flex-1 flex flex-col min-h-0">
          <div class="flex items-center gap-[8px] mb-[14px]">
            <div class="w-[3px] h-[16px] bg-[#89B56B] rounded-full" />
            <span class="font-semibold text-[15px] text-[#2d2d2d]"
              >Indikatormeny</span
            >
          </div>
          <div
            class="flex-1 bg-white rounded-[14px] border border-[#e8e8e8] shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex overflow-hidden min-h-[380px]"
          >
            <div
              class="w-[190px] shrink-0 border-r border-[#efefef] overflow-y-auto bg-[#fafafa] px-[16px] py-[16px]"
            >
              <div class="flex items-center justify-between mb-[14px]">
                <span
                  class="font-semibold text-[11px] text-[#999] tracking-[0.07em] uppercase"
                  >Filtervalg</span
                >
                <button
                  v-if="libraryHasActiveFilters"
                  class="text-[10px] text-[#3d5a4a] hover:underline font-medium"
                  @click="clearLibraryFilters"
                >
                  Nullstill
                </button>
              </div>
              <div class="mb-[4px]">
                <button
                  class="flex items-center justify-between w-full text-[12px] text-[#3a3a3a] font-semibold py-[5px]"
                  @click="
                    libraryShowCategoryFilter = !libraryShowCategoryFilter
                  "
                >
                  <span>Kategori</span
                  ><ChevronUp
                    v-if="libraryShowCategoryFilter"
                    class="w-[13px] h-[13px] text-[#aaa]"
                  /><ChevronDown v-else class="w-[13px] h-[13px] text-[#aaa]" />
                </button>
                <div
                  v-if="libraryShowCategoryFilter"
                  class="mt-[4px] space-y-[5px]"
                >
                  <label
                    v-for="category in FILTER_CATEGORIES"
                    :key="category"
                    class="flex items-center gap-[7px] text-[12px] text-[#606060] cursor-pointer py-[1px] hover:text-[#2d2d2d] transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="libraryFilterCategories.includes(category)"
                      class="w-[14px] h-[14px] rounded-[3px] border-[#d0d0d0] accent-[#3d5a4a] shrink-0"
                      @change="toggleLibraryFilterCategory(category)"
                    />
                    <span class="flex-1">{{ category }}</span>
                  </label>
                </div>
              </div>
              <div class="h-[1px] bg-[#ebebeb] my-[10px]" />
              <div class="mb-[4px]">
                <button
                  class="flex items-center justify-between w-full text-[12px] text-[#3a3a3a] font-semibold py-[5px]"
                  @click="
                    libraryShowVisualizationFilter =
                      !libraryShowVisualizationFilter
                  "
                >
                  <span>Visualisering</span
                  ><ChevronUp
                    v-if="libraryShowVisualizationFilter"
                    class="w-[13px] h-[13px] text-[#aaa]"
                  /><ChevronDown v-else class="w-[13px] h-[13px] text-[#aaa]" />
                </button>
                <div
                  v-if="libraryShowVisualizationFilter"
                  class="mt-[4px] space-y-[5px]"
                >
                  <label
                    v-for="vis in VISUALIZATION_TYPES"
                    :key="vis"
                    class="flex items-center gap-[7px] text-[12px] text-[#606060] cursor-pointer py-[1px] hover:text-[#2d2d2d] transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="libraryFilterVisualization.includes(vis)"
                      class="w-[14px] h-[14px] rounded-[3px] border-[#d0d0d0] accent-[#3d5a4a]"
                      @change="toggleLibraryFilterVisualization(vis)"
                    />
                    <span>{{
                      vis === "fordeling" ? "Sammenligning" : "Oversikt"
                    }}</span>
                  </label>
                </div>
              </div>
              <div class="h-[1px] bg-[#ebebeb] my-[10px]" />
              <div class="mb-[4px]">
                <button
                  class="flex items-center justify-between w-full text-[12px] text-[#3a3a3a] font-semibold py-[5px]"
                  @click="libraryShowGeoFilter = !libraryShowGeoFilter"
                >
                  <span>Geografisk nivå</span
                  ><ChevronUp
                    v-if="libraryShowGeoFilter"
                    class="w-[13px] h-[13px] text-[#aaa]"
                  /><ChevronDown v-else class="w-[13px] h-[13px] text-[#aaa]" />
                </button>
                <div v-if="libraryShowGeoFilter" class="mt-[4px] space-y-[5px]">
                  <label
                    v-for="level in GEO_LEVELS"
                    :key="level"
                    class="flex items-center gap-[7px] text-[12px] text-[#606060] cursor-pointer py-[1px] hover:text-[#2d2d2d] transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="libraryFilterGeoLevels.includes(level)"
                      class="w-[14px] h-[14px] rounded-[3px] border-[#d0d0d0] accent-[#3d5a4a]"
                      @change="toggleLibraryFilterGeoLevel(level)"
                    />
                    <span>{{ GEO_LEVEL_LABELS[level] }}</span>
                  </label>
                </div>
              </div>
              <div class="h-[1px] bg-[#ebebeb] my-[10px]" />
              <button
                class="flex items-center justify-between w-full text-[12px] text-[#3a3a3a] font-semibold py-[5px]"
              >
                <span>Tidsperiode</span
                ><ChevronDown class="w-[13px] h-[13px] text-[#aaa]" />
              </button>
            </div>
            <div class="flex-1 flex flex-col min-w-0 border-r border-[#efefef]">
              <div
                class="px-[14px] pt-[14px] pb-[10px] shrink-0 border-b border-[#f0f0f0]"
              >
                <div class="relative">
                  <Search
                    class="absolute left-[10px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#b8b8b8]"
                  />
                  <input
                    v-model="librarySearchTerm"
                    type="text"
                    placeholder="Søk indikator"
                    class="w-full pl-[32px] pr-[30px] py-[7px] border border-[#e0e0e0] rounded-[8px] text-[12px] text-[#2d2d2d] bg-white focus:outline-none focus:border-[#3d5a4a] focus:ring-1 focus:ring-[#3d5a4a]/20 transition-all placeholder:text-[#c0c0c0]"
                  />
                  <button
                    v-if="librarySearchTerm"
                    class="absolute right-[9px] top-1/2 -translate-y-1/2"
                    @click="librarySearchTerm = ''"
                  >
                    <X
                      class="w-[12px] h-[12px] text-[#b0b0b0] hover:text-[#606060]"
                    />
                  </button>
                </div>
                <div class="mt-[8px] flex items-center justify-between">
                  <div class="flex items-center gap-[5px] flex-wrap">
                    <div
                      v-if="libraryFilterCategories.length > 0"
                      class="text-[10px] text-[#888]"
                    >
                      Aktive filtre:
                    </div>
                    <span
                      v-for="category in libraryFilterCategories"
                      :key="category"
                      class="flex items-center gap-[3px] bg-[#e8f0e8] text-[#3d5a4a] text-[10px] font-medium px-[7px] py-[2px] rounded-[5px]"
                    >
                      {{ category }}
                      <button
                        @click="toggleLibraryFilterCategory(category)"
                      >
                        <X class="w-[9px] h-[9px]" />
                      </button>
                    </span>
                  </div>
                  <div
                    class="text-[10px] text-[#aaa] whitespace-nowrap shrink-0 font-normal"
                  >
                    Viser {{ libraryFilteredIndicators.length }} av
                    {{ indicators.length }} indikatorer
                    <button
                      v-if="libraryHasActiveFilters"
                      class="ml-[6px] text-[10px] font-medium text-[#3d5a4a] hover:underline normal-case"
                      @click="clearLibraryFilters"
                    >
                      Nullstill alle
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex-1 overflow-y-auto">
                <div
                  v-if="libraryActiveGroupCategories.length === 0"
                  class="px-[14px] py-[40px] text-center"
                >
                  <Search
                    class="w-[20px] h-[20px] text-[#ddd] mx-auto mb-[8px]"
                  />
                  <div class="text-[12px] text-[#999]">Ingen treff</div>
                  <button
                    class="mt-[4px] text-[11px] text-[#3d5a4a] hover:underline font-medium"
                    @click="clearLibraryFilters"
                  >
                    Nullstill filtre
                  </button>
                </div>
                <div
                  v-for="category in libraryActiveGroupCategories"
                  v-else
                  :key="category"
                >
                  <div
                    class="px-[14px] py-[7px] bg-[#fafafa] border-b border-[#f0f0f0] flex items-center justify-between sticky top-0 z-10"
                  >
                    <span
                      class="font-semibold text-[11px] text-[#888] tracking-[0.04em]"
                      >{{ category }}</span
                    ><ChevronDown class="w-[12px] h-[12px] text-[#ccc]" />
                  </div>
                  <button
                    v-for="indicator in libraryGroupedIndicators[category]"
                    :key="indicator.id"
                    class="w-full text-left px-[14px] py-[10px] border-b border-[#f5f5f5] transition-colors"
                    :class="
                      selectedLibraryIndicatorId === indicator.id
                        ? 'bg-[#f0f5f1]'
                        : 'hover:bg-[#fafbfa]'
                    "
                    @click="selectedLibraryIndicatorId = indicator.id"
                  >
                    <div class="flex items-center gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] rounded-full shrink-0 border-2 transition-colors"
                        :class="
                          selectedLibraryIndicatorId === indicator.id
                            ? 'bg-[#3d5a4a] border-[#3d5a4a]'
                            : 'bg-transparent border-[#d0d0d0]'
                        "
                      />
                      <span
                        class="font-medium text-[12px] leading-tight flex-1"
                        :class="
                          selectedLibraryIndicatorId === indicator.id
                            ? 'text-[#3d5a4a]'
                            : 'text-[#3a3a3a]'
                        "
                        >{{ indicator.name }}</span
                      >
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div class="w-[380px] shrink-0 overflow-y-auto">
              <div v-if="selectedLibraryIndicator" class="p-[18px]">
                <div class="flex items-start justify-between mb-[14px]">
                  <div>
                    <div
                      class="text-[11px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-[4px]"
                    >
                      Indikatorbeskrivelse
                    </div>
                    <div class="font-bold text-[14px] text-[#2d2d2d]">
                      {{ selectedLibraryIndicator.name }}
                    </div>
                  </div>
                  <button
                    class="shrink-0 ml-[10px] px-[12px] py-[6px] bg-[#3d5a4a] text-white text-[11px] font-semibold rounded-[8px] hover:bg-[#2d4a3a] transition-colors whitespace-nowrap"
                    @click="
                      selectIndicatorFromLibrary(selectedLibraryIndicator.id)
                    "
                  >
                    Velg denne
                  </button>
                </div>
                <p class="text-[12px] text-[#606060] leading-[19px] mb-[16px]">
                  {{ selectedLibraryIndicator.description }}
                </p>
                <div
                  class="bg-[#f8f9f8] rounded-[8px] border border-[#eaeaea] px-[12px] py-[10px] mb-[14px]"
                >
                  <div
                    class="text-[9px] font-semibold text-[#aaa] tracking-[0.08em] uppercase mb-[5px]"
                  >
                    Datakilde
                  </div>
                  <div class="flex items-center gap-[6px]">
                    <div
                      class="w-[14px] h-[14px] bg-[#e0e7e0] rounded-[3px] flex items-center justify-center shrink-0"
                    >
                      <span class="text-[7px] font-bold text-[#3d5a4a]">≡</span>
                    </div>
                    <span class="text-[11px] text-[#555]"
                      >Statistisk Sentralbyrå (SSB) - Tabell 12345</span
                    >
                  </div>
                </div>
                <div
                  v-if="selectedLibraryIndicator.unit"
                  class="flex items-center gap-[6px] mb-[8px]"
                >
                  <span class="text-[10px] text-[#aaa]">Enhet:</span
                  ><span class="text-[11px] font-medium text-[#555]">{{
                    selectedLibraryIndicator.unit
                  }}</span>
                </div>
                <div class="flex items-center gap-[6px] mb-[8px]">
                  <span class="text-[10px] text-[#aaa]">Geografisk nivå:</span
                  ><span class="text-[11px] font-medium text-[#555]">{{
                    GEO_LEVEL_LABELS[selectedLibraryIndicator.minGeoLevel]
                  }}</span>
                </div>
                <div
                  v-if="selectedLibraryIndicator.subOptions?.length"
                  class="mt-[12px]"
                >
                  <div class="text-[10px] text-[#aaa] mb-[6px]">
                    Underkategorier:
                  </div>
                  <div class="flex flex-wrap gap-[5px]">
                    <span
                      v-for="opt in selectedLibraryIndicator.subOptions"
                      :key="opt.id"
                      class="px-[7px] py-[2px] bg-[#f2f4f2] border border-[#e4e8e4] rounded-[5px] text-[10px] text-[#606060]"
                      >{{ opt.name }}</span
                    >
                  </div>
                </div>
                <p class="mt-[14px] text-[11px] text-[#8a8a8a] leading-[17px]">
                  Statistikken omfatter personer som ifølge folkeregisteret er
                  bosatt i Norge per 1. januar. Enslige defineres som personer
                  som bor alene eller med barn, men ikke med ektefelle,
                  registrert partner eller samboer.
                </p>
                <p
                  v-if="selectedLibraryIndicator.subOptions"
                  class="mt-[8px] text-[11px] text-[#8a8a8a] leading-[17px]"
                >
                  Barn regnes som personer som bor med minst én forelder.
                </p>
              </div>
              <div
                v-else
                class="p-[18px] h-full flex flex-col items-center justify-center text-center"
              >
                <div
                  class="w-[40px] h-[40px] rounded-full bg-[#f2f4f2] flex items-center justify-center mb-[10px]"
                >
                  <Search class="w-[16px] h-[16px] text-[#c0c8c0]" />
                </div>
                <div class="text-[12px] font-medium text-[#999] mb-[4px]">
                  Indikatorbeskrivelse
                </div>
                <div class="text-[11px] text-[#bbb] leading-[16px]">
                  Velg en indikator fra listen for å se beskrivelse og detaljer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <template v-else>
        <section
          :class="
            isFullscreen
              ? 'fixed inset-0 z-50 bg-white flex flex-col'
              : 'bg-white rounded-[12px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-[480px] shrink-0'
          "
        >
          <div
            v-if="isFullscreen"
            class="flex items-center justify-between px-[32px] py-[12px] border-b border-[#e8e8e8] shrink-0"
          >
            <div class="flex items-center gap-[8px]">
              <div class="w-[3px] h-[20px] bg-[#89B56B] rounded-full" />
              <span class="font-medium text-[18px] text-[#303030]"
                >Datautforsker</span
              >
            </div>
            <button
              class="w-[34px] h-[34px] bg-[#3d5a4a] rounded-[6px] hover:bg-[#2d4a3a] transition-colors flex items-center justify-center"
              title="Lukk fullskjerm"
              @click="isFullscreen = false"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>
          <div
            class="flex items-center justify-between px-[24px] py-[10px] border-b border-[#e8e8e8]"
          >
            <div class="flex items-center gap-[8px] shrink-0">
              <div class="w-[3px] h-[16px] bg-[#89B56B] rounded-full" />
              <span class="font-normal text-[15px] text-[#303030]">{{
                panelTitle
              }}</span>
            </div>
            <div v-if="!isFullscreen" class="flex items-center gap-[6px]">
              <button
                v-for="type in VISUALIZATION_TYPES"
                :key="type"
                class="px-[12px] py-[6px] rounded-[6px] text-[13px] font-medium transition-all"
                :class="
                  visualizationType === type
                    ? 'bg-[#3d5a4a] text-white shadow-sm'
                    : 'bg-transparent text-[#5a5a5a] hover:text-[#3d5a4a]'
                "
                @click="selectVisualization(type)"
              >
                {{ type === "fordeling" ? "Sammenligning" : "Oversikt" }}
              </button>
              <div class="w-[1px] h-[20px] bg-[#d8d8d8] mx-[2px]" />
              <div class="w-[200px] flex items-center gap-[6px]">
                <template v-if="visualizationType === 'fordeling'">
                  <button
                    v-for="type in FORDELING_TYPES"
                    :key="type"
                    class="p-[6px] rounded-[6px] transition-all"
                    :class="
                      fordelingSubType === type
                        ? 'text-[#3d5a4a] bg-[#3d5a4a]/10'
                        : 'text-[#999] hover:text-[#3d5a4a]'
                    "
                    @click="fordelingSubType = type"
                  >
                    <svg
                      v-if="type === 'kart'"
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M1 4L5.5 2L10.5 4L15 2V12L10.5 14L5.5 12L1 14V4Z"
                        stroke="currentColor"
                        stroke-width="1.2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.5 2V12"
                        stroke="currentColor"
                        stroke-width="1.2"
                      />
                      <path
                        d="M10.5 4V14"
                        stroke="currentColor"
                        stroke-width="1.2"
                      />
                    </svg>
                    <svg
                      v-else-if="type === 'soyle'"
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <rect
                        x="2"
                        y="10"
                        width="3"
                        height="4"
                        rx="0.5"
                        fill="currentColor"
                      />
                      <rect
                        x="6.5"
                        y="6"
                        width="3"
                        height="8"
                        rx="0.5"
                        fill="currentColor"
                      />
                      <rect
                        x="11"
                        y="2"
                        width="3"
                        height="12"
                        rx="0.5"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      v-else
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M1 3L4 2L7 3L10 2V9L7 10L4 9L1 10V3Z"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linejoin="round"
                      />
                      <path d="M4 2V9" stroke="currentColor" stroke-width="1" />
                      <path
                        d="M7 3V10"
                        stroke="currentColor"
                        stroke-width="1"
                      />
                      <rect
                        x="11"
                        y="10"
                        width="1.5"
                        height="4"
                        rx="0.3"
                        fill="currentColor"
                      />
                      <rect
                        x="13"
                        y="7"
                        width="1.5"
                        height="7"
                        rx="0.3"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </template>
                <template v-else>
                  <button
                    v-for="type in CHART_TYPES"
                    :key="type"
                    class="p-[6px] rounded-[6px] transition-all"
                    :class="
                      chartType === type
                        ? 'text-[#3d5a4a] bg-[#3d5a4a]/10'
                        : 'text-[#999] hover:text-[#3d5a4a]'
                    "
                    @click="selectChartType(type)"
                  >
                    <svg
                      v-if="type === 'bar'"
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <rect
                        x="2"
                        y="10"
                        width="3"
                        height="4"
                        rx="0.5"
                        fill="currentColor"
                      />
                      <rect
                        x="6.5"
                        y="6"
                        width="3"
                        height="8"
                        rx="0.5"
                        fill="currentColor"
                      />
                      <rect
                        x="11"
                        y="2"
                        width="3"
                        height="12"
                        rx="0.5"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      v-else-if="type === 'line'"
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M2 12L6 8L9 11L14 4"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <svg
                      v-else-if="type === 'pie'"
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <path
                        d="M8 8L8 2"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <path
                        d="M8 8L14 8"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                    </svg>
                    <svg
                      v-else
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="5"
                        height="5"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="9"
                        y="2"
                        width="5"
                        height="5"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="2"
                        y="9"
                        width="5"
                        height="5"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="9"
                        y="9"
                        width="5"
                        height="5"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </template>
              </div>
              <div class="w-[1px] h-[20px] bg-[#d8d8d8] mx-[2px]" />
              <div class="flex items-center bg-[#f0f0f0] rounded-full p-[2px]">
                <button
                  class="px-[12px] py-[4px] rounded-full text-[12px] font-medium transition-all"
                  :class="
                    displayMode === 'antall'
                      ? 'bg-white text-[#303030] shadow-sm'
                      : 'text-[#5a5a5a] hover:text-[#303030]'
                  "
                  @click="displayMode = 'antall'"
                >
                  Antall
                </button>
                <button
                  class="px-[12px] py-[4px] rounded-full text-[12px] font-medium transition-all"
                  :class="
                    displayMode === 'andel'
                      ? 'bg-white text-[#303030] shadow-sm'
                      : 'text-[#5a5a5a] hover:text-[#303030]'
                  "
                  @click="displayMode = 'andel'"
                >
                  Prosent
                </button>
              </div>
              <div class="w-[1px] h-[20px] bg-[#d8d8d8] mx-[2px]" />
              <button
                class="w-[34px] h-[34px] bg-[#3d5a4a] rounded-[6px] hover:bg-[#2d4a3a] transition-colors flex items-center justify-center"
                title="Last ned"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button
                class="w-[34px] h-[34px] bg-[#3d5a4a] rounded-[6px] hover:bg-[#2d4a3a] transition-colors flex items-center justify-center"
                title="Lagre"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                  />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              </button>
            </div>
          </div>
          <div
            class="p-[32px] pb-[40px] overflow-y-auto"
            :class="isFullscreen ? 'flex-1' : 'h-[420px]'"
          >
            <div
              v-if="!areIndicatorsCompatible"
              class="flex items-center justify-center h-full"
            >
              <div class="text-center max-w-[500px]">
                <div
                  class="w-[64px] h-[64px] bg-[#ffeaea] rounded-full flex items-center justify-center mx-auto mb-[16px]"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d14343"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div class="text-[18px] font-medium text-[#303030] mb-[12px]">
                  {{
                    visualizationType === "fordeling"
                      ? `«${activeIndicator?.name || "Indikatoren"}» støtter ikke Sammenligning`
                      : `«${activeIndicator?.name || "Indikatoren"}» støtter ikke denne visningen`
                  }}
                </div>
                <div class="text-[14px] text-[#5a5a5a] leading-[21px]">
                  {{
                    visualizationType === "fordeling"
                      ? "Denne indikatoren er ikke tilgjengelig for Sammenligning. Velg en annen indikator i indikatormenyen, eller bytt til Oversikt."
                      : "Velg en annen indikator i indikatormenyen, eller bytt visualiseringstype."
                  }}
                </div>
              </div>
            </div>
            <div
              v-else-if="!areIndicatorsGeoCompatible"
              class="flex items-center justify-center h-full"
            >
              <div class="text-center max-w-[500px]">
                <div
                  class="w-[64px] h-[64px] bg-[#fff3e0] rounded-full flex items-center justify-center mx-auto mb-[16px]"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e67e22"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div class="text-[18px] font-medium text-[#303030] mb-[12px]">
                  For detaljert geografisk nivå
                </div>
                <div class="text-[14px] text-[#5a5a5a] leading-[21px]">
                  «{{ activeIndicator?.name || "Indikatoren" }}» er ikke
                  tilgjengelig på
                  {{ GEO_LEVEL_LABELS[geoLevel].toLowerCase() }}-nivå. Velg et
                  høyere geografisk nivå i kartpanelet (f.eks. kommune eller
                  fylke).
                </div>
              </div>
            </div>
            <div
              v-else
              :class="
                (chartType === 'nokkeltall' || chartType === 'grid') &&
                visualizationType === 'visning'
                  ? ''
                  : 'h-full'
              "
            >
              <div v-if="visualizationType === 'fordeling'" class="h-full">
                <div v-if="fordelingSubType === 'kart'" class="h-full flex">
                  <div
                    class="flex-1 relative rounded-[12px] overflow-hidden border border-[#e8e8e8] bg-[#f8f8f8]"
                  >
                    <img
                      :src="rangeringMapImage"
                      alt="Fordeling kart"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute top-[16px] right-[16px] bg-white/95 backdrop-blur-sm rounded-[10px] shadow-lg p-[16px] z-20 min-w-[150px]"
                    >
                      <div
                        class="text-[12px] font-medium text-[#303030] mb-[2px] leading-[16px]"
                      >
                        {{ activeIndicator?.name
                        }}<span
                          v-if="activeIndicator?.unit"
                          class="block text-[11px] text-[#5a5a5a] font-normal"
                          >({{ activeIndicator.unit }})</span
                        >
                      </div>
                      <div
                        class="flex items-center gap-[6px] mt-[8px] mb-[10px]"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <rect width="14" height="14" rx="2" fill="#e8e8e8" />
                          <line
                            x1="2"
                            y1="12"
                            x2="12"
                            y2="2"
                            stroke="#999"
                            stroke-width="1"
                          />
                          <line
                            x1="5"
                            y1="12"
                            x2="12"
                            y2="5"
                            stroke="#999"
                            stroke-width="1"
                          />
                          <line
                            x1="8"
                            y1="12"
                            x2="12"
                            y2="8"
                            stroke="#999"
                            stroke-width="1"
                          /></svg
                        ><span class="text-[11px] text-[#5a5a5a]"
                          >Mangler data</span
                        >
                      </div>
                      <div class="space-y-[3px]">
                        <div
                          v-for="range in legendRanges"
                          :key="range.label"
                          class="flex items-center gap-[8px]"
                        >
                          <div
                            class="w-[18px] h-[12px] rounded-[2px]"
                            :style="{ backgroundColor: range.color }"
                          />
                          <span class="text-[11px] text-[#5a5a5a]">{{
                            range.label
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      v-for="(region, index) in selectedRegionObjects"
                      :key="region.id"
                      class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                      :style="
                        regionPositions[region.id] || {
                          top: '50%',
                          left: '50%',
                        }
                      "
                    >
                      <div
                        class="bg-white/90 backdrop-blur-sm rounded-[8px] shadow-md px-[10px] py-[5px] whitespace-nowrap border border-[#e0e0e0]"
                      >
                        <div class="text-[13px] font-medium text-[#303030]">
                          {{
                            formatNumber(
                              generateKeyFigure(activeIndicator?.id || "", region.id),
                            )
                          }}
                          {{ activeIndicator?.unit || "" }}
                        </div>
                        <div class="text-[11px] text-[#5a5a5a]">
                          {{ region.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="!menuExpanded"
                    class="w-[260px] shrink-0 border-l border-[#e8e8e8] p-[24px] flex flex-col gap-[12px]"
                  >
                    <div class="text-[14px] font-medium text-[#303030]">
                      {{ activeIndicator?.name }}
                    </div>
                    <div
                      v-for="(region, index) in selectedRegionObjects"
                      :key="region.id"
                      class="flex items-center gap-[10px] py-[8px] border-b border-[#f0f0f0]"
                    >
                      <div
                        class="w-[10px] h-[10px] rounded-full shrink-0"
                        :style="{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }"
                      />
                      <div>
                        <div class="text-[14px] font-medium text-[#303030]">
                          {{ region.name }}
                        </div>
                        <div class="text-[13px] text-[#5a5a5a]">
                          {{
                            formatNumber(
                              generateKeyFigure(activeIndicator?.id || "", region.id),
                            )
                          }}
                          {{ activeIndicator?.unit || "" }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="selectedRegions.length < 2"
                      class="text-[13px] text-[#999] leading-[20px] mt-[4px]"
                    >
                      Legg til flere områder for å sammenligne regioner på
                      kartet
                    </div>
                  </div>
                </div>
                <div
                  v-else-if="fordelingSubType === 'kart_soyle'"
                  class="h-full flex gap-[16px]"
                >
                  <div
                    class="flex-1 relative rounded-[12px] overflow-hidden border border-[#e8e8e8] bg-[#f8f8f8]"
                  >
                    <img
                      :src="rangeringMapImage"
                      alt="Fordeling kart"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-for="(region, index) in selectedRegionObjects"
                      :key="region.id"
                      class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                      :style="
                        regionPositions[region.id] || {
                          top: '50%',
                          left: '50%',
                        }
                      "
                    >
                      <div
                        class="bg-white/90 backdrop-blur-sm rounded-[8px] shadow-md px-[10px] py-[5px] whitespace-nowrap border border-[#e0e0e0]"
                        :style="{
                          borderLeft: `3px solid ${CHART_COLORS[index % CHART_COLORS.length]}`,
                        }"
                      >
                        <div class="text-[13px] font-medium text-[#303030]">
                          {{
                            formatNumber(
                              generateKeyFigure(activeIndicator?.id || "", region.id),
                            )
                          }}
                          {{ activeIndicator?.unit || "" }}
                        </div>
                        <div class="text-[11px] text-[#5a5a5a]">
                          {{ region.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex-1 flex items-center justify-center">
                    <img
                      :src="rangeringGraphSvg"
                      alt="Fordeling søylediagram"
                      class="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div v-else class="h-full flex items-center">
                  <img
                    :src="rangeringGraphSvg"
                    alt="Fordeling søylediagram"
                    class="w-full"
                  />
                </div>
              </div>

              <div
                v-else-if="chartType === 'nokkeltall'"
                class="grid grid-cols-4 gap-[16px]"
              >
                <div
                  v-for="(indicator, index) in selectedIndicatorObjects"
                  :key="indicator.id"
                  class="bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-default flex"
                >
                  <div
                    class="w-[5px] shrink-0"
                    :style="{
                      backgroundColor:
                        NOKKELTALL_COLORS[index % NOKKELTALL_COLORS.length],
                    }"
                  />
                  <div
                    class="flex-1 p-[20px] flex flex-col justify-between gap-[8px]"
                  >
                    <div class="text-[13px] text-[#5a5a5a] leading-[18px]">
                      {{ indicator.name
                      }}<span v-if="indicator.unit" class="text-[#999]">
                        ({{ indicator.unit }})</span
                      >
                    </div>
                    <div
                      class="text-[32px] font-semibold text-[#303030] leading-[38px]"
                    >
                      {{
                        formatNumber(
                          generateKeyFigure(
                            indicator.id,
                            selectedRegions[0] || "agder",
                          ),
                        )
                      }}
                    </div>
                    <div
                      class="flex items-center gap-[4px] text-[12px]"
                      :class="
                        trendFor(indicator.id).positive
                          ? 'text-[#3d5a4a]'
                          : 'text-[#c0392b]'
                      "
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          v-if="trendFor(indicator.id).positive"
                          d="M6 2L10 7H2L6 2Z"
                          fill="currentColor"
                        />
                        <path
                          v-else
                          d="M6 10L2 5H10L6 10Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>{{ trendFor(indicator.id).value.toFixed(1) }}%</span
                      ><span class="text-[#999] ml-[4px]">siste år</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else-if="chartType === 'pie'"
                class="h-full flex gap-[24px] items-center justify-center"
              >
                <svg
                  viewBox="0 0 320 300"
                  class="h-full max-h-[330px] w-[360px]"
                >
                  <path
                    v-for="slice in pieData"
                    :key="slice.name"
                    :d="slice.path"
                    :fill="slice.color"
                    stroke="white"
                    stroke-width="2"
                  />
                  <circle
                    cx="160"
                    cy="150"
                    :r="isFullscreen ? 54 : 38"
                    fill="white"
                  />
                </svg>
                <div class="grid gap-[8px] min-w-[180px]">
                  <div
                    v-for="slice in pieData"
                    :key="slice.name"
                    class="flex items-center gap-[8px] text-[12px] text-[#5a5a5a]"
                  >
                    <div
                      class="w-[10px] h-[10px] rounded-full"
                      :style="{ backgroundColor: slice.color }"
                    />
                    <span
                      >{{ slice.name }} -
                      {{
                        ((slice.value / slice.total) * 100).toFixed(1)
                      }}%</span
                    >
                  </div>
                </div>
              </div>

              <div v-else-if="chartType === 'bar'" class="h-full">
                <svg viewBox="0 0 800 360" class="w-full h-full">
                  <line x1="55" y1="310" x2="760" y2="310" stroke="#e8e8e8" />
                  <line x1="55" y1="40" x2="55" y2="310" stroke="#e8e8e8" />
                  <g v-for="(point, pointIndex) in chartData" :key="point.name">
                    <text
                      :x="
                        80 + pointIndex * (680 / Math.max(chartData.length, 1))
                      "
                      y="340"
                      text-anchor="middle"
                      fill="#5a5a5a"
                      font-size="12"
                    >
                      {{ point.name }}
                    </text>
                    <rect
                      v-for="(regionName, regionIndex) in regionNames"
                      :key="regionName"
                      :x="
                        60 +
                        pointIndex * (680 / Math.max(chartData.length, 1)) +
                        regionIndex * 16
                      "
                      :y="310 - barHeight(point, regionName)"
                      width="14"
                      :height="barHeight(point, regionName)"
                      :fill="CHART_COLORS[regionIndex % CHART_COLORS.length]"
                      rx="4"
                    />
                  </g>
                </svg>
              </div>

              <div v-else class="h-full">
                <svg viewBox="0 0 800 360" class="w-full h-full">
                  <line x1="55" y1="310" x2="760" y2="310" stroke="#e8e8e8" />
                  <line x1="55" y1="40" x2="55" y2="310" stroke="#e8e8e8" />
                  <line
                    v-for="y in [60, 110, 160, 210, 260]"
                    :key="y"
                    x1="55"
                    :y1="y"
                    x2="760"
                    :y2="y"
                    stroke="#e8e8e8"
                    stroke-dasharray="3 3"
                  />
                  <text
                    v-for="(point, index) in chartData"
                    :key="point.name"
                    :x="60 + index * (680 / Math.max(chartData.length - 1, 1))"
                    y="340"
                    text-anchor="middle"
                    fill="#5a5a5a"
                    font-size="12"
                  >
                    {{ point.name }}
                  </text>
                  <path
                    v-for="series in lineSeries"
                    :key="series.name"
                    :d="series.path"
                    fill="none"
                    :stroke="series.color"
                    stroke-width="2"
                  />
                  <g
                    v-if="regionNames.length > 1"
                    transform="translate(590 20)"
                  >
                    <g
                      v-for="(name, index) in regionNames"
                      :key="name"
                      :transform="`translate(0 ${index * 18})`"
                    >
                      <rect
                        width="10"
                        height="10"
                        rx="2"
                        :fill="CHART_COLORS[index % CHART_COLORS.length]"
                      />
                      <text x="16" y="10" fill="#5a5a5a" font-size="12">
                        {{ name }}
                      </text>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <div
          v-if="menuExpanded && !isFullscreen"
          class="flex gap-[16px] h-[600px] shrink-0"
        >
          <section
            class="bg-white rounded-[12px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] flex-[2] flex flex-col min-w-[320px] max-w-[480px] overflow-hidden"
          >
            <div
              class="px-[24px] border-b border-[#e8e8e8] flex items-center justify-between shrink-0 h-[50px]"
            >
              <div class="font-normal text-[14px] text-[#5a5a5a]">Kart</div>
            </div>
            <div class="p-[16px] flex-1 flex flex-col min-h-0 overflow-y-auto">
              <div
                class="relative rounded-[8px] overflow-hidden border border-[#e8e8e8] min-h-[200px] shrink-0 h-[240px]"
              >
                <img
                  :src="mapImage"
                  alt="Kart over Norge"
                  class="w-full h-full object-cover"
                />
                <div
                  v-for="(region, index) in selectedRegionObjects"
                  :key="region.id"
                  class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  :style="
                    regionPositions[region.id] || { top: '50%', left: '50%' }
                  "
                >
                  <div
                    class="w-[24px] h-[24px] rounded-full border-[2px] border-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    :style="{
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }"
                    :title="region.name"
                  >
                    <MapPin class="w-[12px] h-[12px] text-white" />
                  </div>
                </div>
                <div
                  class="absolute top-[12px] right-[12px] flex flex-col gap-[4px]"
                >
                  <button
                    class="w-[32px] h-[32px] bg-white border border-[#c8c8c8] rounded-[6px] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors shadow-md"
                  >
                    <Plus class="w-[16px] h-[16px] text-[#303030]" />
                  </button>
                  <button
                    class="w-[32px] h-[32px] bg-white border border-[#c8c8c8] rounded-[6px] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors shadow-md"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8H12"
                        stroke="#303030"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div ref="pickerRef" class="mt-[16px]">
                <div class="text-[12px] text-[#5a5a5a] mb-[6px] font-medium">
                  Oversikt
                </div>
                <button
                  class="flex items-center gap-[8px] px-[10px] py-[8px] rounded-[8px] border w-full transition-colors"
                  :class="
                    pickerOpen && pickerTarget === 'primary'
                      ? 'border-[#3d5a4a] bg-[#f5f8f3]'
                      : 'border-[#e8e8e8] bg-[#fafafa] hover:border-[#c0c0c0]'
                  "
                  @click="openPicker('primary')"
                >
                  <template v-if="primaryRegion"
                    ><div
                      class="w-[10px] h-[10px] rounded-full shrink-0"
                      :style="{ backgroundColor: CHART_COLORS[0] }"
                    />
                    <Search
                      class="w-[13px] h-[13px] text-[#999] shrink-0"
                    /><span
                      class="text-[13px] text-[#303030] flex-1 text-left truncate"
                      >{{ primaryRegion.name }}</span
                    ><span class="text-[11px] text-[#bbb] shrink-0">{{
                      GEO_LEVEL_LABELS[primaryRegion.level]
                    }}</span></template
                  >
                  <ChevronDown
                    class="w-[13px] h-[13px] shrink-0 text-[#999] transition-transform"
                    :class="
                      pickerOpen && pickerTarget === 'primary'
                        ? 'rotate-180'
                        : ''
                    "
                  />
                </button>
                <div
                  v-if="pickerOpen && pickerTarget === 'primary'"
                  class="mt-[4px] bg-white border border-[#c8c8c8] rounded-[8px] shadow-lg overflow-hidden"
                >
                  <div class="px-[10px] py-[8px] border-b border-[#f0f0f0]">
                    <div
                      class="flex items-center gap-[6px] px-[8px] py-[5px] rounded-[6px] border border-[#e8e8e8] bg-[#fafafa]"
                    >
                      <Search
                        class="w-[13px] h-[13px] text-[#999] shrink-0"
                      /><input
                        v-model="regionSearchQuery"
                        type="text"
                        placeholder="Søk område"
                        class="flex-1 text-[13px] text-[#303030] bg-transparent outline-none placeholder:text-[#bbb]"
                        autofocus
                      />
                    </div>
                  </div>
                  <div
                    class="px-[10px] py-[8px] border-b border-[#f0f0f0] flex flex-wrap gap-[4px]"
                  >
                    <button
                      v-for="level in GEO_LEVELS"
                      :key="level"
                      class="px-[8px] py-[3px] rounded-full text-[11px] font-medium transition-colors"
                      :class="
                        geoLevel === level
                          ? 'bg-[#3d5a4a] text-white'
                          : 'bg-[#f0f0f0] text-[#5a5a5a] hover:bg-[#e4e4e4]'
                      "
                      @click="changeGeoLevel(level)"
                    >
                      {{ GEO_LEVEL_LABELS[level] }}
                    </button>
                  </div>
                  <div class="max-h-[200px] overflow-y-auto">
                    <button
                      v-for="region in filteredRegions"
                      :key="region.id"
                      class="w-full px-[14px] py-[8px] text-left text-[13px] flex items-center gap-[8px] transition-colors"
                      :class="
                        selectedRegions.includes(region.id)
                          ? 'bg-[#f5f8f3]'
                          : 'hover:bg-[#fafafa]'
                      "
                      @click="selectRegion(region.id)"
                    >
                      <div
                        class="w-[6px] h-[6px] shrink-0 rounded-full"
                        :class="
                          selectedRegions.includes(region.id)
                            ? 'bg-[#3d5a4a]'
                            : ''
                        "
                      />
                      <span
                        class="flex-1"
                        :class="
                          selectedRegions.includes(region.id)
                            ? 'text-[#3d5a4a] font-medium'
                            : 'text-[#303030]'
                        "
                        >{{ region.name }}</span
                      ><span
                        v-if="region.parent"
                        class="text-[11px] text-[#bbb]"
                        >{{ regionById(region.parent)?.name }}</span
                      >
                    </button>
                  </div>
                </div>
                <div class="mt-[16px] pt-[16px] border-t border-[#e8e8e8]">
                  <div class="text-[12px] text-[#5a5a5a] mb-[6px] font-medium">
                    Referanseområde
                  </div>
                  <div class="flex flex-col gap-[6px]">
                    <div
                      v-for="(region, index) in comparisonRegions"
                      :key="region.id"
                      class="flex items-center gap-[8px] px-[10px] py-[7px] rounded-[6px] border border-[#e8e8e8] bg-[#fafafa]"
                    >
                      <div
                        class="w-[10px] h-[10px] rounded-full shrink-0"
                        :style="{
                          backgroundColor:
                            CHART_COLORS[(index + 1) % CHART_COLORS.length],
                        }"
                      />
                      <span
                        class="text-[13px] text-[#303030] flex-1 truncate"
                        >{{ region.name }}</span
                      ><span class="text-[11px] text-[#bbb] shrink-0">{{
                        GEO_LEVEL_LABELS[region.level]
                      }}</span>
                      <button
                        class="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[#999] hover:text-[#303030] hover:bg-[#eee] transition-colors shrink-0"
                        title="Fjern"
                        @click="removeComparisonRegion(region.id)"
                      >
                        <X class="w-[12px] h-[12px]" />
                      </button>
                    </div>
                    <button
                      v-if="comparisonRegions.length < 5"
                      class="flex items-center gap-[6px] px-[10px] py-[7px] rounded-[6px] border text-[13px] transition-colors w-full"
                      :class="
                        pickerOpen && pickerTarget === 'comparison'
                          ? 'border-[#3d5a4a] text-[#3d5a4a] bg-[#f5f8f3]'
                          : 'border-dashed border-[#c8c8c8] text-[#5a5a5a] hover:border-[#3d5a4a] hover:text-[#3d5a4a] bg-white'
                      "
                      @click="openPicker('comparison')"
                    >
                      <Plus class="w-[14px] h-[14px] shrink-0" /><span
                        >Legg til referanseområde</span
                      ><ChevronDown
                        class="w-[13px] h-[13px] shrink-0 ml-auto text-[#5a5a5a] transition-transform"
                        :class="
                          pickerOpen && pickerTarget === 'comparison'
                            ? 'rotate-180'
                            : ''
                        "
                      />
                    </button>
                    <div
                      v-else
                      class="text-[11px] text-[#999] px-[10px] py-[4px]"
                    >
                      Maks 5 referanseområder
                    </div>
                  </div>
                  <div
                    v-if="pickerOpen && pickerTarget === 'comparison'"
                    class="mt-[4px] bg-white border border-[#c8c8c8] rounded-[8px] shadow-lg overflow-hidden"
                  >
                    <div class="px-[10px] py-[8px] border-b border-[#f0f0f0]">
                      <div
                        class="flex items-center gap-[6px] px-[8px] py-[5px] rounded-[6px] border border-[#e8e8e8] bg-[#fafafa]"
                      >
                        <Search
                          class="w-[13px] h-[13px] text-[#999] shrink-0"
                        /><input
                          v-model="regionSearchQuery"
                          type="text"
                          placeholder="Søk område"
                          class="flex-1 text-[13px] text-[#303030] bg-transparent outline-none placeholder:text-[#bbb]"
                          autofocus
                        />
                      </div>
                    </div>
                    <div
                      class="px-[10px] py-[8px] border-b border-[#f0f0f0] flex flex-wrap gap-[4px]"
                    >
                      <button
                        v-for="level in GEO_LEVELS"
                        :key="level"
                        class="px-[8px] py-[3px] rounded-full text-[11px] font-medium transition-colors"
                        :class="
                          geoLevel === level
                            ? 'bg-[#3d5a4a] text-white'
                            : 'bg-[#f0f0f0] text-[#5a5a5a] hover:bg-[#e4e4e4]'
                        "
                        @click="changeGeoLevel(level)"
                      >
                        {{ GEO_LEVEL_LABELS[level] }}
                      </button>
                    </div>
                    <div class="max-h-[200px] overflow-y-auto">
                      <button
                        v-for="region in filteredRegions"
                        :key="region.id"
                        class="w-full px-[14px] py-[8px] text-left text-[13px] flex items-center gap-[8px] transition-colors"
                        :class="[
                          selectedRegions.includes(region.id)
                            ? 'bg-[#f5f8f3]'
                            : 'hover:bg-[#fafafa]',
                          selectedRegions[0] === region.id
                            ? 'opacity-40 cursor-not-allowed'
                            : '',
                        ]"
                        :disabled="selectedRegions[0] === region.id"
                        @click="selectRegion(region.id)"
                      >
                        <div
                          class="w-[14px] h-[14px] rounded-[3px] border-[2px] flex items-center justify-center shrink-0 transition-colors"
                          :class="
                            selectedRegions.includes(region.id)
                              ? 'border-[#3d5a4a] bg-[#3d5a4a]'
                              : 'border-[#c8c8c8]'
                          "
                        >
                          <svg
                            v-if="selectedRegions.includes(region.id)"
                            width="8"
                            height="6"
                            viewBox="0 0 8 6"
                            fill="none"
                          >
                            <path
                              d="M1 3L3 5L7 1"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <span
                          class="flex-1"
                          :class="
                            selectedRegions.includes(region.id)
                              ? 'text-[#3d5a4a] font-medium'
                              : 'text-[#303030]'
                          "
                          >{{ region.name }}</span
                        ><span
                          v-if="region.parent"
                          class="text-[11px] text-[#bbb]"
                          >{{ regionById(region.parent)?.name }}</span
                        >
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            class="bg-white rounded-[12px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden flex-[3] min-w-[400px] flex flex-col"
          >
            <div
              class="px-[24px] border-b border-[#e8e8e8] flex items-center justify-between shrink-0 h-[50px]"
            >
              <div
                class="font-normal text-[14px] text-[#5a5a5a] flex items-center gap-[4px]"
              >
                <span class="text-[#c8c8c8]">|</span> Indikatormeny
              </div>
              <div class="flex gap-[4px]">
                <button
                  class="px-[12px] py-[6px] rounded-[6px] text-[13px] font-medium transition-all"
                  :class="
                    indicatorMode === 'single'
                      ? 'bg-[#3d5a4a] text-white shadow-sm'
                      : 'bg-transparent text-[#5a5a5a] hover:text-[#3d5a4a]'
                  "
                  @click="selectIndicatorMode('single')"
                >
                  En indikator</button
                ><button
                  class="px-[12px] py-[6px] rounded-[6px] text-[13px] font-medium transition-all"
                  :class="
                    indicatorMode === 'multi'
                      ? 'bg-[#3d5a4a] text-white shadow-sm'
                      : 'bg-transparent text-[#5a5a5a] hover:text-[#3d5a4a]'
                  "
                  @click="selectIndicatorMode('multi')"
                >
                  Flere indikatorer
                </button>
              </div>
            </div>
            <div
              v-if="filterModalOpen"
              class="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div
                class="absolute inset-0 backdrop-blur-[2px] bg-white/30"
                @click="filterModalOpen = false"
              />
              <div
                class="relative bg-white rounded-[14px] shadow-[0px_8px_32px_rgba(0,0,0,0.12)] w-[340px] max-h-[480px] flex flex-col overflow-hidden"
              >
                <div
                  class="flex items-center justify-between px-[20px] py-[14px] border-b border-[#e8e8e8]"
                >
                  <div class="flex items-center gap-[8px]">
                    <SlidersHorizontal
                      class="w-[14px] h-[14px] text-[#3d5a4a]"
                    /><span class="font-medium text-[14px] text-[#2d2d2d]"
                      >Filtrer indikatorer</span
                    >
                  </div>
                  <button
                    class="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] hover:bg-[#f0f0f0] transition-colors"
                    @click="filterModalOpen = false"
                  >
                    <X class="w-[16px] h-[16px] text-[#999]" />
                  </button>
                </div>
                <div class="flex-1 overflow-y-auto px-[20px] py-[16px]">
                  <div class="mb-[10px]">
                    <button
                      class="flex items-center justify-between w-full text-[13px] text-[#3d5a4a] font-medium py-[6px]"
                      @click="
                        showIndicatorCategoryFilter =
                          !showIndicatorCategoryFilter
                      "
                    >
                      <span>Kategori</span
                      ><ChevronUp
                        v-if="showIndicatorCategoryFilter"
                        class="w-[14px] h-[14px] text-[#5a7a64]"
                      /><ChevronDown
                        v-else
                        class="w-[14px] h-[14px] text-[#5a7a64]"
                      />
                    </button>
                    <div
                      v-if="showIndicatorCategoryFilter"
                      class="mt-[4px] space-y-[6px] ml-[2px]"
                    >
                      <label
                        v-for="category in CATEGORIES"
                        :key="category"
                        class="flex items-center gap-[8px] text-[13px] text-[#4a4a4a] cursor-pointer py-[2px]"
                        ><input
                          type="checkbox"
                          :checked="
                            indicatorFilterCategories.includes(category)
                          "
                          class="w-[15px] h-[15px] rounded border-[#a8c0ab] accent-[#3d5a4a]"
                          @change="
                            toggleIndicatorFilterCategory(category)
                          "
                        /><span>{{ category }}</span></label
                      >
                    </div>
                  </div>
                  <div class="mb-[10px]">
                    <button
                      class="flex items-center justify-between w-full text-[13px] text-[#3d5a4a] font-medium py-[6px]"
                      @click="
                        showIndicatorVisualizationFilter =
                          !showIndicatorVisualizationFilter
                      "
                    >
                      <span>Visualisering</span
                      ><ChevronUp
                        v-if="showIndicatorVisualizationFilter"
                        class="w-[14px] h-[14px] text-[#5a7a64]"
                      /><ChevronDown
                        v-else
                        class="w-[14px] h-[14px] text-[#5a7a64]"
                      />
                    </button>
                    <div
                      v-if="showIndicatorVisualizationFilter"
                      class="mt-[4px] space-y-[6px] ml-[2px]"
                    >
                      <label
                        v-for="vis in VISUALIZATION_TYPES"
                        :key="vis"
                        class="flex items-center gap-[8px] text-[13px] text-[#4a4a4a] cursor-pointer py-[2px]"
                        ><input
                          type="checkbox"
                          :checked="indicatorFilterVisualization.includes(vis)"
                          class="w-[15px] h-[15px] rounded border-[#a8c0ab] accent-[#3d5a4a]"
                          @change="
                            toggleIndicatorFilterVisualization(vis)
                          "
                        /><span>{{
                          vis === "fordeling" ? "Sammenligning" : "Oversikt"
                        }}</span></label
                      >
                    </div>
                  </div>
                  <div class="mb-[10px]">
                    <button
                      class="flex items-center justify-between w-full text-[13px] text-[#3d5a4a] font-medium py-[6px]"
                      @click="showIndicatorGeoFilter = !showIndicatorGeoFilter"
                    >
                      <span>Geografisk nivå</span
                      ><ChevronUp
                        v-if="showIndicatorGeoFilter"
                        class="w-[14px] h-[14px] text-[#5a7a64]"
                      /><ChevronDown
                        v-else
                        class="w-[14px] h-[14px] text-[#5a7a64]"
                      />
                    </button>
                    <div
                      v-if="showIndicatorGeoFilter"
                      class="mt-[4px] space-y-[6px] ml-[2px]"
                    >
                      <label
                        v-for="level in GEO_LEVELS"
                        :key="level"
                        class="flex items-center gap-[8px] text-[13px] text-[#4a4a4a] cursor-pointer py-[2px]"
                        ><input
                          type="checkbox"
                          :checked="indicatorFilterGeoLevels.includes(level)"
                          class="w-[15px] h-[15px] rounded border-[#a8c0ab] accent-[#3d5a4a]"
                          @change="toggleIndicatorFilterGeoLevel(level)"
                        /><span>{{ GEO_LEVEL_LABELS[level] }}</span></label
                      >
                    </div>
                  </div>
                  <div class="mb-[6px]">
                    <button
                      class="flex items-center justify-between w-full text-[13px] text-[#3d5a4a] font-medium py-[6px]"
                      @click="
                        showIndicatorTimeFilter = !showIndicatorTimeFilter
                      "
                    >
                      <span>Tidsperiode</span
                      ><ChevronUp
                        v-if="showIndicatorTimeFilter"
                        class="w-[14px] h-[14px] text-[#5a7a64]"
                      /><ChevronDown
                        v-else
                        class="w-[14px] h-[14px] text-[#5a7a64]"
                      />
                    </button>
                  </div>
                </div>
                <div
                  class="px-[20px] py-[12px] border-t border-[#e8e8e8] flex items-center justify-between"
                >
                  <button
                    v-if="indicatorActiveFilterTags.length > 0"
                    class="text-[12px] text-[#3d5a4a] hover:underline transition-colors"
                    @click="clearIndicatorFilters"
                  >
                    Nullstill
                    {{ indicatorActiveFilterTags.length }} filter</button
                  ><span v-else class="text-[12px] text-[#999]"
                    >Ingen filtre valgt</span
                  ><button
                    class="px-[16px] py-[7px] bg-[#3d5a4a] hover:bg-[#2d4a3a] text-white text-[13px] font-medium rounded-[8px] transition-colors"
                    @click="filterModalOpen = false"
                  >
                    Bruk filter
                  </button>
                </div>
              </div>
            </div>
            <div class="flex flex-1 min-h-0">
              <div
                class="flex-[2] flex flex-col min-w-0 border-r border-[#e8e8e8]"
              >
                <div class="px-[16px] pt-[14px] pb-[10px] shrink-0">
                  <div class="flex gap-[8px] mb-[10px]">
                    <div class="relative flex-1">
                      <Search
                        class="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#5a5a5a]"
                      /><input
                        v-model="indicatorSearchTerm"
                        type="text"
                        placeholder="Søk indikator"
                        class="w-full pl-[36px] pr-[12px] py-[8px] border border-[#c8c8c8] rounded-[6px] text-[13px] text-[#303030] bg-white focus:outline-none focus:border-[#3d5a4a] focus:ring-1 focus:ring-[#3d5a4a]/20 transition-all"
                      /><button
                        v-if="indicatorSearchTerm"
                        class="absolute right-[12px] top-1/2 -translate-y-1/2"
                        @click="indicatorSearchTerm = ''"
                      >
                        <X
                          class="w-[14px] h-[14px] text-[#999] hover:text-[#303030]"
                        />
                      </button>
                    </div>
                    <button
                      class="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[6px] border transition-colors shrink-0"
                      :class="
                        indicatorActiveFilterTags.length > 0
                          ? 'bg-[#eef3eb] border-[#3d5a4a]/30 text-[#3d5a4a]'
                          : 'bg-white border-[#c8c8c8] text-[#5a5a5a] hover:border-[#3d5a4a] hover:text-[#3d5a4a]'
                      "
                      @click="filterModalOpen = true"
                    >
                      <SlidersHorizontal class="w-[14px] h-[14px]" /><span
                        class="text-[13px] font-medium"
                        >Filter</span
                      ><span
                        v-if="indicatorActiveFilterTags.length > 0"
                        class="w-[18px] h-[18px] rounded-full bg-[#3d5a4a] text-white text-[10px] font-bold flex items-center justify-center"
                        >{{ indicatorActiveFilterTags.length }}</span
                      >
                    </button>
                  </div>
                  <div class="flex items-center gap-[6px] flex-wrap">
                    <template v-if="indicatorActiveFilterTags.length > 0"
                      ><span class="text-[12px] text-[#5a5a5a]"
                        >Aktive filtre:</span
                      >
                      <div
                        v-for="tag in indicatorActiveFilterTags"
                        :key="tag.key"
                        class="bg-[#dce9d3] px-[10px] py-[3px] rounded-[8px] flex items-center gap-[6px]"
                      >
                        <span class="text-[12px] text-[#303030]">{{
                          tag.label
                        }}</span
                        ><button
                          class="text-[#303030] hover:text-[#3d5a4a] transition-colors"
                          @click="tag.onRemove()"
                        >
                          <X class="w-[12px] h-[12px]" />
                        </button>
                      </div>
                      <button
                        class="text-[12px] text-[#3d5a4a] hover:underline ml-[4px]"
                        @click="clearIndicatorFilters"
                      >
                        Nullstill alle
                      </button></template
                    >
                  </div>
                  <div class="text-[12px] text-[#5a5a5a] mt-[6px]">
                    Viser {{ filteredIndicators.length }} av
                    {{ indicators.length }} indikatorer
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto min-h-0">
                  <div
                    v-for="category in visibleIndicatorCategories"
                    :key="category"
                    class="border-b border-[#e8e8e8]"
                  >
                    <button
                      class="w-full px-[16px] py-[10px] flex items-center justify-between hover:bg-[#fafafa] transition-colors"
                      @click="toggleExpandedCategory(category)"
                    >
                      <div class="text-[13px] font-medium text-[#303030]">
                        {{ category }}
                      </div>
                      <ChevronUp
                        v-if="expandedCategories.includes(category)"
                        class="w-[16px] h-[16px] text-[#5a5a5a]"
                      /><ChevronDown
                        v-else
                        class="w-[16px] h-[16px] text-[#5a5a5a]"
                      />
                    </button>
                    <div
                      v-if="expandedCategories.includes(category)"
                      class="px-[16px] pb-[12px] space-y-[4px]"
                    >
                      <label
                        v-for="indicator in categorizedIndicators[category]"
                        :key="indicator.id"
                        class="flex items-center gap-[10px] cursor-pointer rounded-[6px] px-[8px] py-[6px] transition-all"
                        :class="
                          selectedIndicators.includes(indicator.id)
                            ? 'bg-[#f5f8f3]'
                            : 'hover:bg-[#fafafa]'
                        "
                      >
                        <input
                          :type="
                            indicatorMode === 'multi' ? 'checkbox' : 'radio'
                          "
                          :name="
                            indicatorMode === 'multi' ? undefined : 'indicator'
                          "
                          :checked="selectedIndicators.includes(indicator.id)"
                          class="w-[16px] h-[16px] rounded border-[#c8c8c8] accent-[#3d5a4a] shrink-0"
                          @change="toggleIndicator(indicator.id)"
                        />
                        <span
                          class="text-[13px] flex-1"
                          :class="
                            selectedIndicators.includes(indicator.id)
                              ? 'text-[#303030] font-medium'
                              : 'text-[#303030]'
                          "
                          >{{ indicator.name }}</span
                        >
                        <span
                          v-if="
                            !isGeoLevelAvailable(
                              indicator.minGeoLevel,
                              geoLevel,
                            )
                          "
                          class="shrink-0"
                          ><span
                            class="block w-[8px] h-[8px] rounded-full bg-[#d32f2f]"
                        /></span>
                      </label>
                    </div>
                  </div>
                  <div
                    v-for="category in emptyIndicatorCategories"
                    :key="category"
                    class="border-b border-[#e8e8e8]"
                  >
                    <button
                      class="w-full px-[16px] py-[10px] flex items-center justify-between hover:bg-[#fafafa] transition-colors"
                    >
                      <div class="text-[13px] font-medium text-[#999]">
                        {{ category }}
                      </div>
                      <ChevronDown class="w-[16px] h-[16px] text-[#c8c8c8]" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex-[3] overflow-y-auto">
                <div class="px-[18px] py-[14px]">
                  <div
                    class="text-[11px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-[10px]"
                  >
                    Indikatorbeskrivelse
                  </div>
                  <div
                    v-if="selectedDescriptionIndicators.length > 0"
                    class="space-y-[8px]"
                  >
                    <div
                      v-for="indicator in selectedDescriptionIndicators"
                      :key="indicator.id"
                      class="border border-[#e4e8e4] rounded-[8px] overflow-hidden"
                    >
                      <button
                        class="w-full px-[14px] py-[10px] flex items-center justify-between bg-[#f8f9f8] hover:bg-[#f0f2f0] transition-colors"
                        @click="toggleDescription(indicator.id)"
                      >
                        <div class="font-bold text-[13px] text-[#2d2d2d]">
                          {{ indicator.name }}
                        </div>
                        <ChevronDown
                          class="w-[14px] h-[14px] text-[#999] transition-transform"
                          :class="
                            expandedDescriptions[indicator.id] === false
                              ? '-rotate-90'
                              : ''
                          "
                        />
                      </button>
                      <div
                        v-if="expandedDescriptions[indicator.id] !== false"
                        class="px-[14px] py-[12px] border-t border-[#e4e8e4]"
                      >
                        <p
                          class="text-[12px] text-[#606060] leading-[19px] mb-[14px]"
                        >
                          {{ indicator.description }}
                        </p>
                        <div
                          class="bg-[#f8f9f8] rounded-[6px] border border-[#eaeaea] px-[10px] py-[8px] mb-[12px]"
                        >
                          <div
                            class="text-[9px] font-semibold text-[#aaa] tracking-[0.08em] uppercase mb-[4px]"
                          >
                            Datakilde
                          </div>
                          <div class="flex items-center gap-[6px]">
                            <div
                              class="w-[14px] h-[14px] bg-[#e0e7e0] rounded-[3px] flex items-center justify-center shrink-0"
                            >
                              <span class="text-[7px] font-bold text-[#3d5a4a]"
                                >≡</span
                              >
                            </div>
                            <span class="text-[11px] text-[#555]"
                              >Statistisk Sentralbyrå (SSB)</span
                            >
                          </div>
                        </div>
                        <div class="space-y-[6px] mb-[12px]">
                          <div class="flex items-center gap-[6px]">
                            <span class="text-[10px] text-[#aaa]">Dato:</span
                            ><span class="text-[11px] font-medium text-[#555]"
                              >31.12.2023</span
                            >
                          </div>
                          <div
                            v-if="indicator.unit"
                            class="flex items-center gap-[6px]"
                          >
                            <span class="text-[10px] text-[#aaa]">Enhet:</span
                            ><span
                              class="text-[11px] font-medium text-[#555]"
                              >{{ indicator.unit }}</span
                            >
                          </div>
                          <div class="flex items-center gap-[6px]">
                            <span class="text-[10px] text-[#aaa]"
                              >Geografisk nivå:</span
                            ><span
                              class="text-[11px] font-medium text-[#555]"
                              >{{
                                GEO_LEVEL_LABELS[indicator.minGeoLevel]
                              }}</span
                            >
                          </div>
                          <div class="flex items-center gap-[6px]">
                            <span class="text-[10px] text-[#aaa]"
                              >Dataleverandør:</span
                            ><span class="text-[11px] font-medium text-[#555]"
                              >Geodata AS</span
                            >
                          </div>
                          <div class="flex items-center gap-[6px]">
                            <span class="text-[10px] text-[#aaa]"
                              >Undertrykking:</span
                            ><span class="text-[11px] font-medium text-[#555]"
                              >Ukjent</span
                            >
                          </div>
                        </div>
                        <div
                          v-if="indicator.subOptions?.length"
                          class="mb-[12px]"
                        >
                          <div class="text-[10px] text-[#aaa] mb-[6px]">
                            Underkategorier:
                          </div>
                          <div class="flex flex-wrap gap-[5px]">
                            <span
                              v-for="opt in indicator.subOptions"
                              :key="opt.id"
                              class="px-[7px] py-[2px] bg-[#f2f4f2] border border-[#e4e8e4] rounded-[5px] text-[10px] text-[#606060]"
                              >{{ opt.name }}</span
                            >
                          </div>
                        </div>
                        <div
                          class="text-[11px] text-[#3d5a4a] hover:underline cursor-pointer"
                        >
                          Mer opplysninger om statistikken →
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="h-full flex flex-col items-center justify-center text-center py-[40px]"
                  >
                    <div
                      class="w-[40px] h-[40px] rounded-full bg-[#f2f4f2] flex items-center justify-center mb-[10px]"
                    >
                      <Search class="w-[16px] h-[16px] text-[#c0c8c0]" />
                    </div>
                    <div class="text-[12px] font-medium text-[#999] mb-[4px]">
                      Indikatorbeskrivelse
                    </div>
                    <div class="text-[11px] text-[#bbb] leading-[16px]">
                      Velg en indikator fra listen for å se beskrivelse og
                      detaljer
                    </div>
                  </div>
                  <div
                    v-if="geoUnavailableIndicators.length > 0"
                    class="mt-[16px] pt-[12px] border-t border-[#e8e8e8]"
                  >
                    <div
                      class="text-[11px] text-[#5a5a5a] leading-[18px] space-y-[4px]"
                    >
                      <div
                        v-for="indicator in geoUnavailableIndicators"
                        :key="indicator.id"
                        class="flex items-center gap-[8px]"
                      >
                        <span
                          class="w-[8px] h-[8px] rounded-full bg-[#d32f2f] shrink-0"
                        /><span
                          >{{ indicator.name }} — ikke tilgjengelig for valgt
                          geografisk nivå</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>
    </main>
  </div>
</template>
