// Booth numbers are free-form strings (e.g. "1", "2", "10", "A12"), so a plain string
// sort would order "10" before "2". `numeric: true` makes embedded digit runs compare
// by their numeric value instead of lexicographically.
export function compareBoothNumbers(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}
