// Local imports
import { checkImage, styleCommand } from "@vease/utils/controller/handlers/style/common";
import type { ControllerHandler } from "@vease/utils/controller/index";
import { setDataVisibility } from "@vease/utils/data_actions";

// An image shows its own colors: only its visibility and its opacity are styled
const IMAGE_STYLE_COMMANDS: Record<string, ControllerHandler> = {
  // The image visibility also shows or hides it in the data tree
  "style/image/visibility": styleCommand(
    async (_store, item, { visibility }: { visibility: boolean }) => {
      checkImage(item);
      await setDataVisibility(item.data_id, visibility);
    },
  ),
  "style/image/opacity": styleCommand(async (store, item, { opacity }: { opacity: number }) => {
    checkImage(item);
    await store.setImageOpacity(item.data_id, opacity);
  }),
};

export { IMAGE_STYLE_COMMANDS };
