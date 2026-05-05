export function formatNumberWithSpaces(
  value: number | string,
  fractionDigits = 1,
): string {
  let str = !isNaN(Number(value))
    ? (value as number).toFixed(fractionDigits)
    : (value as string);

  let sign = "";
  if (str.startsWith("-")) {
    sign = "-";
    str = str.slice(1);
  }

  const [intPart, fracPart] = str.split(".");

  const intWithSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    sign +
    (fracPart !== undefined && Number(fracPart) !== 0
      ? `${intWithSpaces},${fracPart}`
      : intWithSpaces)
  );
}

export function toNumberOrNull(value: string | number | null): number | null {
  if (value === null) return null;
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

export function niceValue(v: number, roundMethod: "ceil" | "floor") {
  if (!v) return 0;

  const amountNumbers = Math.floor(Math.log10(v));
  const pow = 10 ** amountNumbers;
  const n = v / pow;
  const base = Math[roundMethod](Number(n.toFixed(2)) * 10) / 10;

  return (Math[roundMethod](base * 2) * pow) / 2;
}
