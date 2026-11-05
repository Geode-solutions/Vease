// Third party imports
import type { RGBAColor } from "@ogw_front/utils/default_styles/constants";

// Local imports
import type { getDataStyleStore } from "@vease/utils/external_stores";

type StyleStore = ReturnType<typeof getDataStyleStore>;

interface AttributeInput {
  name: string;
  item: number;
  minimum: number;
  maximum: number;
  colorMap: string;
  no_data_color?: RGBAColor;
}

export type { AttributeInput, StyleStore };
