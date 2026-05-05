import { LucideLineChart, LucideKey, LucideArrowLeftRight } from "#components";

export const cardTypes: CardCreationType[] = [
  {
    cardType: "chart",
    indicatorType: "singleIndicator",
    icon: LucideLineChart,
    label: "Diagram",
    cardDescription:
      "Datakort er viser en dynamisk framvisning av valgt indikator. Datakort       vises ved default i stoplediagram, men du velger selv en annen framvisning       om du ønsker det.",
  },
  {
    cardType: "infographic",
    indicatorType: "multiIndicator",
    icon: LucideKey,
    label: "Nøkkeltall",
    cardDescription:
      "Infografiske kort gir en visuell og lettfattelig oversikt over nøkkeldata.       Hvert ikon representerer en spesifikk indikator, og verdiene oppdateres       dynamisk basert på valgt område og tidsperiode.",
  },
  {
    cardType: "choropleth",
    indicatorType: "singleIndicator",
    icon: LucideArrowLeftRight,
    label: "Sammenligning",
    cardDescription: "",
  },
  // {
  //   cardType: "text",
  //   indicatorType: "singleIndicator",
  //   icon: LucidePencilLine,
  //   label: "Tekst",
  //   cardDescription: "",
  //   isComing: true,
  // },
  // {
  //   cardType: "image",
  //   indicatorType: "singleIndicator",
  //   icon: LucideImage,
  //   label: "Bilde",
  //   cardDescription: "",
  //   isComing: true,
  // },
] as const;
