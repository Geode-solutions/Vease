// Third party imports
import type { ColorRGBA } from "@geode/opengeodeweb-viewer/schema_types";

const RGB_START = 1;
const CHANNEL_LENGTH = 2;
const HEX_RADIX = 16;
const BYTE_MAX = 255;
const RGB_HEX_LENGTH = 7;

function hexChannel(hex: string, index: number): number {
  const start = RGB_START + index * CHANNEL_LENGTH;
  return Number.parseInt(hex.slice(start, start + CHANNEL_LENGTH), HEX_RADIX);
}

function hexToRgba(hex: string): ColorRGBA {
  const alpha = hex.length === RGB_HEX_LENGTH ? 1 : hexChannel(hex, 3) / BYTE_MAX;
  return { red: hexChannel(hex, 0), green: hexChannel(hex, 1), blue: hexChannel(hex, 2), alpha };
}

export { hexToRgba };
