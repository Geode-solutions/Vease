// Third party imports
import colormaps from "@geode/opengeodeweb-front/app/assets/colormaps.json";

// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";

interface ColormapNode {
  Name: string;
  RGBPoints?: number[];
  Children?: ColormapNode[];
}

function presetNames(node: ColormapNode): string[] {
  if (node.RGBPoints !== undefined) {
    return [node.Name];
  }
  return (node.Children ?? []).flatMap((child) => presetNames(child));
}

const categories: Record<string, string[]> = Object.fromEntries(
  colormaps.map((category: ColormapNode) => [category.Name, presetNames(category)]),
);

export default defineTypedEventHandler(schemas.api.controller.colormaps, () => ({
  statusCode: 200,
  response: { categories },
}));
