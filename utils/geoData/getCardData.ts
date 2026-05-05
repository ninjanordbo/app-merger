import { keysDenominators } from "~/data/keyDenominators";

function round(value: number, decimals: number) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function calculateNumericData(data: AreaData, keys: string[]) {
  return keys.map((key) => round(Number(data[key]), 2) || 0);
}

function calculatePercentageData(
  data: AreaData,
  keys: string[],
  totalKeys: string[],
) {
  const totalNumber = totalKeys.reduce(
    (acc, key) => (acc += Number(data[key])),
    0,
  );

  return keys.map((key) => {
    const result = (Number(data[key]) * 100) / totalNumber;
    return round(result, 2) || 0;
  });
}

function formatAreaData(valueFormat: "series" | "raw", data: number[]) {
  switch (valueFormat) {
    case "series": {
      return [{ data }];
    }
    case "raw":
      return data;
  }
}

export function getCalculationFunction(chartMode: "percent" | "numeric") {
  switch (chartMode) {
    case "numeric":
      return calculateNumericData;
    case "percent":
      return calculatePercentageData;
  }
}

export function getChartData(
  data: AreaData,
  indicators: GeoDataTypeKey[],
  indicatorName: string,
  valueFormat: "series" | "raw",
  chartMode: "percent" | "numeric",
) {
  const indicator = indicators.find(
    (indicator) => indicator.name === indicatorName,
  );
  const calculateFunction = getCalculationFunction(chartMode);
  if (!indicator || !calculateFunction) {
    throw new Error("Invalid data type or diagram type");
  }

  const denominatorKeys = getDenominatorKeys(indicator.keys);

  let series = formatAreaData(
    valueFormat,
    calculateFunction(data, indicator.keys, denominatorKeys),
  );

  if (series.length && series.every((data) => typeof data === "object")) {
    series = series.map((data) => ({
      ...data,
      name: indicator.valueTitle,
    }));
  }

  return {
    series,
    categories: indicator.categories,
    categoryTitle: indicator.categoryTitle,
    valueTitle: indicator.valueTitle,
    percentValueTitle: indicator.percentValueTitle,
  };
}

export function getInfographicsData(
  data: AreaData,
  keys: string[],
): string | null {
  // Since it is an infographics, we expect only one key
  if (!keys || keys.length > 1) {
    throw new Error("Invalid data type");
  }

  const result = data[keys[0]];

  // Return "X" if no data
  return typeof result === "number" ? formatNumberWithSpaces(result) : result;
}

export function getDenominatorKeys(keys: string[]) {
  const denominatorKeys: string[] = [];
  for (const key of keys) {
    denominatorKeys.push(...(keysDenominators.get(key) ?? []));
  }
  return Array.from(new Set(denominatorKeys));
}
