import { LucideBarChart, LucideLineChart, LucidePieChart } from "#components";

export const diagramTypes: DiagramCreationType[] = [
  {
    label: "Stolpediagram",
    diagramType: "bar",
    icon: LucideBarChart,
  },
  {
    label: "Linjediagram",
    diagramType: "line",
    icon: LucideLineChart,
  },
  {
    label: "Kakediagram",
    diagramType: "pie",
    icon: LucidePieChart,
  },
] as const;
