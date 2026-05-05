export const projectTemplates: ProjectWithItems[] = [
  {
    id: "1",
    name: "Nytt prosjekt",
    description:
      "Start med et tomt prosjekt og legg til visninger og indikatorer etter behov.",
    projectItems: [
      {
        indicators: [],
        cardType: "map",
        displayType: "map",
        cardWidth: 2,
        cardHeight: 2,
        cardXPosition: 0,
        cardYPosition: 0,
      },
    ],
  },
] as const;
