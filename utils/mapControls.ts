import { capitalize } from "vue";

import { areaDataIndicators } from "~/data/indicators";

import type { IControl, Map as MapBox } from "mapbox-gl";

export class LegendControl implements IControl {
  private container!: HTMLElement;
  private grades: () => number[];
  private colors: string[];
  private fieldName: string;
  private chartMode: "numeric" | "percent";

  constructor(
    grades: () => number[],
    colors: string[],
    fieldName: string,
    chartMode: "numeric" | "percent",
  ) {
    this.grades = grades;
    this.colors = colors;
    this.fieldName = fieldName;
    this.chartMode = chartMode;
  }

  onAdd(_map: MapBox): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl legend-ctrl";
    this.render();
    return this.container;
  }

  onRemove(): void {
    this.container.parentNode?.removeChild(this.container);
  }

  updateLegendData(
    gradesFn: () => number[],
    chartMode: "numeric" | "percent",
    colors?: string[],
    fieldName?: string,
  ): void {
    this.grades = gradesFn;
    if (colors) this.colors = colors;
    if (fieldName) this.fieldName = fieldName;
    this.chartMode = chartMode;
    this.render();
  }

  getLegendMarkup(
    grades: number[],
    indicatorName: string,
    isMedian: boolean,
  ): string {
    const indicationCountText = isMedian
      ? ""
      : this.chartMode === "percent"
        ? "%"
        : "antall";
    return `
      <div style="background:#fff; padding:8px; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.2); display:flex; flex-direction:column; gap:8px;">
        <div style="width: min-content; text-wrap: wrap; font-weight: 600; line-height: 14px;">${indicatorName} ${indicationCountText}</div>
        <ul style="list-style:none; padding:0; margin:0;">
        <li style="display:flex; align-items:center; margin:2px 0;">
              <div 
                style="
                  width:16px; height:16px; 
                  background:${this.colors[0]}; 
                  display:inline-block; margin-right:8px;
                  border:1px solid #999;"
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 10 10" 
                    width="100%" height="100%" 
                    preserveAspectRatio="none">
                  <rect width="10" height="10" fill="none"/>
                  <path d="M0,10 L10,0 
                          M-3,7 L7,-3 
                          M3,13 L13,3" 
                        stroke="black" 
                        stroke-width="1"/>
                </svg>
              </div>
              <span>Mangler data</span>
            </li>
          ${grades
            .map((grade, index) => {
              const digitsAfterComma = grade.toString().split(",").length;
              const delimiter = Math.pow(10, -digitsAfterComma - 1);
              return `
            <li style="display:flex; align-items:center; margin:2px 0;">
              <span 
                style="
                  width:16px; height:16px; 
                  background:${this.colors[index]}; 
                  display:inline-block; margin-right:8px;
                  border:1px solid #999;"
              ></span>
              <span>${formatNumberWithSpaces(Number(grade.toFixed(1)))}${
                index + 1 >= grades.length
                  ? "+"
                  : " - " +
                    formatNumberWithSpaces(
                      Number((grades[index + 1] - delimiter).toFixed(1)),
                    )
              }</span>
            </li>`;
            })
            .join("")}
        </ul>
      </div>
    `;
  }

  render(): void {
    const grades = this.grades();

    const indicatorName = findIndicatorName(this.fieldName) || this.fieldName;
    const isMedian = isIndicatorMedian(this.fieldName);

    this.container.innerHTML = indicatorName
      ? this.getLegendMarkup(grades, indicatorName, isMedian)
      : "";
  }
}

export class HoverInfoControl implements IControl {
  private container!: HTMLElement;
  private getSourceKey: () => MapTilesLayersNamesKey | null;
  private getFieldKey: () => string;
  private getChartMode: () => "numeric" | "percent";

  constructor(
    getSourceKey: () => MapTilesLayersNamesKey | null,
    getFieldKey: () => string,
    getChartMode: () => "numeric" | "percent",
  ) {
    this.getSourceKey = getSourceKey;
    this.getFieldKey = getFieldKey;
    this.getChartMode = getChartMode;
  }

  onAdd(map: MapBox): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl hover-ctrl";
    this.container.innerHTML = "";

    map.on("mousemove", "area-fill", (e) => {
      if (!e.features?.length) return;
      const f = e.features[0];
      const id = f.properties?.id;
      const name =
        f.properties?.name === f.properties?.id
          ? `Sone ${Number(f.properties?.id.slice(-4))}`
          : f.properties?.name;
      const field = this.getFieldKey();

      const sourceKey = this.getSourceKey();
      if (sourceKey === null || !id || !field) {
        this.container.innerHTML = "";
        return;
      }

      const state = map.getFeatureState({
        source: sourceKey,
        sourceLayer: sourceKey,
        id,
      });

      const value: number | null = state[field];
      const indicatorName = findIndicatorName(field);

      const chartMode = this.getChartMode();

      this.container.innerHTML = `
        <div style="background:#fff; padding:8px; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.2);">
          <strong><p style="font-size: 1rem;">${name}</p> ${getSourceLayerLabel(sourceKey)}: ${id}</strong><br/>
          ${indicatorName || field}: ${(value && formatNumberWithSpaces(value).concat(chartMode === "percent" ? "%" : "")) ?? "Mangler data"}
        </div>
      `;
    });

    map.on("mouseleave", "area-fill", () => {
      this.container.innerHTML = "";
    });

    return this.container;
  }

  onRemove(): void {
    this.container.parentNode?.removeChild(this.container);
  }
}

function getSourceLayerLabel(layerName: MapTilesLayersNamesKey) {
  switch (layerName) {
    case "fylker":
      return capitalize(layerName) + " nr.";
    case "kommuner":
      return "Kommunenr.";
    case "soner":
      return "Sonenr.";
    case "grunnkretser":
      return capitalize(layerName) + " nr.";

    default:
      return "";
  }
}

function getIndicatorByKey(keyName: string) {
  return areaDataIndicators.find((indicator) =>
    indicator.keys.includes(keyName),
  );
}

function findIndicatorName(fieldName: string): string {
  const indicator = getIndicatorByKey(fieldName);
  return indicator ? indicator.name : fieldName;
}

function isIndicatorMedian(fieldName: string): boolean {
  const indicator = getIndicatorByKey(fieldName);
  return !!indicator?.isMedian;
}
