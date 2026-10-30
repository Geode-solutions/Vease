// Third party imports
import type { RGBAColor } from "@ogw_front/utils/default_styles/constants";

const RGB_START = 1;
const CHANNEL_LENGTH = 2;
const HEX_RADIX = 16;
const BYTE_MAX = 255;
const RGB_HEX_LENGTH = 7;

function hexChannel(hex: string, index: number): number {
  const start = RGB_START + index * CHANNEL_LENGTH;
  return Number.parseInt(hex.slice(start, start + CHANNEL_LENGTH), HEX_RADIX);
}

// Stepping the hue by the golden ratio keeps any number of consecutive colors far apart
const GOLDEN_RATIO_CONJUGATE = 0.618034;
const SATURATION = 0.65;
const LIGHTNESS = 0.55;
const RED_SHIFT = 0;
const GREEN_SHIFT = 8;
const BLUE_SHIFT = 4;
const HUE_SECTORS = 12;
const SECTOR_OFFSET = 3;
const SECTOR_SPAN = 9;

function hexToRgba(hex: string): RGBAColor {
  const alpha = hex.length === RGB_HEX_LENGTH ? 1 : hexChannel(hex, 3) / BYTE_MAX;
  return { red: hexChannel(hex, 0), green: hexChannel(hex, 1), blue: hexChannel(hex, 2), alpha };
}

// HSL to RGB channel, hue in [0, 1)
function hslChannel(hue: number, shift: number): string {
  const sector = (shift + hue * HUE_SECTORS) % HUE_SECTORS;
  const chroma = SATURATION * Math.min(LIGHTNESS, 1 - LIGHTNESS);
  const value =
    LIGHTNESS - chroma * Math.max(-1, Math.min(sector - SECTOR_OFFSET, SECTOR_SPAN - sector, 1));
  return Math.round(value * BYTE_MAX)
    .toString(HEX_RADIX)
    .padStart(CHANNEL_LENGTH, "0");
}

function distinctHexColors(count: number, startHue: number = Math.random()): string[] {
  return Array.from({ length: count }, (_, index) => {
    const hue = (startHue + index * GOLDEN_RATIO_CONJUGATE) % 1;
    return `#${[RED_SHIFT, GREEN_SHIFT, BLUE_SHIFT].map((shift) => hslChannel(hue, shift)).join("")}`;
  });
}

export { distinctHexColors, hexToRgba };
