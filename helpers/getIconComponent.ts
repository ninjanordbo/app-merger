import {
  LucideHardDriveUpload,
  LucideBrainCircuit,
  LucideImage,
  LucidePencilLine,
  LucideWand,
  LucideMap,
  LucideFileText,
  LucideBarChart,
  LucideLineChart,
  LucidePieChart,
  LucideTable,
  LucideHandCoins,
  LucideUser,
  LucideCalendar,
  LucideBanknote,
  LucideHome,
  LucideRuler,
  LucideHistory,
  LucideLandmark,
  LucideHousePlus,
  LucideUser2,
  LucideUsers,
} from "#components";

const iconMap = {
  LucideHardDriveUpload,
  LucideBrainCircuit,
  LucideImage,
  LucidePencilLine,
  LucideWand,
  LucideMap,
  LucideFileText,
  LucideBarChart,
  LucideLineChart,
  LucidePieChart,
  LucideTable,
  LucideHandCoins,
  LucideUser,
  LucideCalendar,
  LucideBanknote,
  LucideHome,
  LucideRuler,
  LucideHistory,
  LucideLandmark,
  LucideHousePlus,
  LucideUser2,
  LucideUsers,
} as const;

function isValidIconName(iconName: string): iconName is keyof typeof iconMap {
  return iconName in iconMap;
}

export function getIconComponent(iconName: string) {
  if (isValidIconName(iconName)) {
    return iconMap[iconName];
  }
  return iconMap.LucideFileText;
}
