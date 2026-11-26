// Local imports
import { ATTRIBUTE_STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/attribute";
import type { ControllerHandler } from "@vease/utils/controller/index";
import { IMAGE_STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/image";
import { MESH_STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/mesh";
import { MODEL_STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/model";

// Named after their route: style/<image|mesh|model>/<element>/<property>, as the dataStyle store setters
const STYLE_COMMANDS: Record<string, ControllerHandler> = {
  ...IMAGE_STYLE_COMMANDS,
  ...MESH_STYLE_COMMANDS,
  ...MODEL_STYLE_COMMANDS,
  ...ATTRIBUTE_STYLE_COMMANDS,
};

export { STYLE_COMMANDS };
