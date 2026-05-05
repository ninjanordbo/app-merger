import type { Map } from "mapbox-gl";

export const PATTERN_SVG = `
  <svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='10' height='10' fill-opacity='0' /><path d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='black' stroke-width='1'/></svg>
`.trim();

function ensureSvgSize(svg: string, size: number) {
  const hasSize = /<svg[^>]*(width|height)=/i.test(svg);
  if (hasSize) {
    return svg
      .replace(/width="[^"]*"/i, `width="${size}"`)
      .replace(/height="[^"]*"/i, `height="${size}"`);
  }
  return svg.replace(/<svg/i, `<svg width="${size}" height="${size}"`);
}

export function rasterize(svgString: string, size = 32): Promise<string> {
  return new Promise((resolve, reject) => {
    const svg = ensureSvgSize(svgString, size);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    const b64 = btoa(unescape(encodeURIComponent(svg)));
    img.src = `data:image/svg+xml;base64,${b64}`;
  });
}

function loadImageAsync(map: Map, url: string) {
  return new Promise<Exclude<Parameters<Map["addImage"]>[1], string>>(
    (resolve, reject) => {
      map.loadImage(url, (err, image) => (err ? reject(err) : resolve(image!)));
    },
  );
}

export async function registerPatternFromSvg(
  map: Map,
  imageId: string,
  svg: string,
  tileSize: 8 | 16 | 32 | 64 = 32,
  pixelRatio: 1 | 2 | 4 = 1,
) {
  const url = await rasterize(svg, tileSize);
  const img = await loadImageAsync(map, url);
  if (map.hasImage(imageId)) map.removeImage(imageId);
  map.addImage(imageId, img, { pixelRatio });
}
