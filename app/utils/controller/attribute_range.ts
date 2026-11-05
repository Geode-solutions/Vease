// Local imports
import type { BackAttribute } from "@vease/utils/controller/targets";
import { ControllerError } from "@vease/utils/controller/errors";

function checkRange(minimum: number | undefined, maximum: number | undefined): void {
  if ((minimum === undefined) !== (maximum === undefined)) {
    throw new ControllerError("Give both minimum and maximum, or neither for the attribute range");
  }
  if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
    throw new ControllerError(
      `minimum (${minimum}) is greater than maximum (${maximum}); swap them or omit both for the attribute range`,
    );
  }
}

function resolveItem(item: number | undefined, attribute: BackAttribute): number {
  const resolved = item ?? 0;
  if (resolved >= attribute.nb_items) {
    throw new ControllerError(
      `item ${resolved} is out of range for "${attribute.attribute_name}" (nb_items ${attribute.nb_items})`,
    );
  }
  return resolved;
}

export { checkRange, resolveItem };
