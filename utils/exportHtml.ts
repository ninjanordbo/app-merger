import { toJpeg, toPng } from "html-to-image";

import type { Options } from "html-to-image/lib/types";

export async function exportHtml(
  el: HTMLElement,
  format: CardExportMethods,
  fileName: string = "exported_item " + new Date(),
  options?: Options,
) {
  if (!el) return;

  let formatFunction: Function;
  switch (format) {
    case "png":
      formatFunction = toPng;
      break;

    case "jpeg":
      formatFunction = toJpeg;
      break;

    default:
      formatFunction = toPng;
      break;
  }

  const imageUrl = await formatFunction(el, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#fff",
    ...options,
  });
  downloadImageByUrl(imageUrl, fileName);
}
