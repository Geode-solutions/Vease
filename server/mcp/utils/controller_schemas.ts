// Third party imports
import { z } from "zod";

const HEX_COLOR = /^#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?$/u;
const DATA_ID_LENGTH = 32;

const dataId = z.string().length(DATA_ID_LENGTH);
const hexColor = z.string().regex(HEX_COLOR);
const styleTarget = z.enum([
  "points",
  "edges",
  "cells",
  "polygons",
  "polyhedra",
  "corners",
  "lines",
  "surfaces",
  "blocks",
]);
const componentIds = z.array(z.string()).min(1);

export { componentIds, dataId, hexColor, styleTarget };
