import {
  GridStack,
  type GridItemHTMLElement,
  type GridStackElement,
} from "gridstack";

let grid: GridStack | null = null;

const gridColumns = ref(6);

export function getGrid() {
  if (!grid) {
    grid = GridStack.init({
      float: false,
      margin: 0,
      draggable: {
        handle: ".card-handle",
        cancel: ".no-drag",
      },
      column: gridColumns.value,
    });
  }

  return grid;
}
getGrid();

export function setGridColumns(columns: number) {
  gridColumns.value = columns;
  getGrid()?.column(columns);
  getGrid()?.compact();
}

export function addGridCardWidget(cardId: number) {
  const newWidget = document.querySelector(
    `[data-card-id="${cardId}"]`,
  ) as GridStackElement;
  if (newWidget && grid) {
    grid.makeWidget(newWidget);
  }
}

const eventCallbacks = new Map<string, Function[]>();
export function pushGridEventCallback(eventName: string, callback: Function) {
  if (eventCallbacks.get(eventName)) {
    eventCallbacks.get(eventName)?.push(callback);
  } else {
    eventCallbacks.set(eventName, [callback]);
  }

  getGrid()?.on(eventName, (_event: Event, el: GridItemHTMLElement) =>
    eventCallbacks
      .get(eventName)
      ?.forEach((eventCallback) => eventCallback(el)),
  );
}

export function handleDestroyGrid() {
  getGrid().destroy();
  grid = null;
  eventCallbacks.clear();
}
