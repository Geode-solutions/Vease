import type { Coordinate } from "@ogw_front/types/geometry";
// A coordinate as the user types it: a number, or a string not parsed yet
type EditableCoordinate = number | string;

interface Point {
  x: EditableCoordinate;
  y: EditableCoordinate;
  z: EditableCoordinate;
}

interface FormattedPoint {
  x: Coordinate;
  y: Coordinate;
  z: Coordinate;
}

function createEmptyPoint(): Point {
  return { x: "", y: "", z: "" };
}

const COORDINATE_FIELDS: (keyof Point)[] = ["x", "y", "z"];

function fillEmptyCoordinatesWithZero(point: Point, filledField: keyof Point): void {
  for (const coordinate of COORDINATE_FIELDS) {
    if (coordinate !== filledField && point[coordinate] === "") {
      point[coordinate] = "0";
    }
  }
}

function formatPoints(pts: Point[]): FormattedPoint[] {
  return pts.map((point) => ({
    x: Number(String(point.x).replaceAll(",", ".")),
    y: Number(String(point.y).replaceAll(",", ".")),
    z: Number(String(point.z).replaceAll(",", ".")),
  }));
}

function sanitizePointInput(point: Point, value: unknown, field: keyof Point): void {
  const val = String(value)
    .replaceAll(",", ".")
    .replaceAll(/[^0-9eE+\-.]/gu, "");
  const parts = val.split(/[eE]/u);
  point[field] = parts.length > 2 ? `${parts[0]}e${parts[1]}` : val;
  if (point[field] !== "") {
    fillEmptyCoordinatesWithZero(point, field);
  }
}

function applyPastedCoordinates(point: Point, field: keyof Point, coords: string[]): void {
  if (coords.length >= 2) {
    point.x = coords[0] ?? "";
    point.y = coords[1] ?? "";
    point.z = coords[2] ?? "0";
  } else {
    point[field] = coords[0] ?? "";
    if (point[field] !== "") {
      fillEmptyCoordinatesWithZero(point, field);
    }
  }
}

export type { FormattedPoint, Point };
export { applyPastedCoordinates, createEmptyPoint, formatPoints, sanitizePointInput };
