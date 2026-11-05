// Local imports
import type { AttributeBinding } from "@vease/utils/controller/attribute_setters";
import type { BackAttribute } from "@vease/utils/controller/targets";
import { ControllerError } from "@vease/utils/controller/errors";

// The store keeps a step as an index into time_steps, while the tool speaks in time values
function requestedTimeStepIndex(
  timeStep: number | undefined,
  attribute: BackAttribute,
): number | undefined {
  if (timeStep === undefined) {
    return undefined;
  }
  const timeSteps = attribute.time_steps ?? [];
  const index = timeSteps.indexOf(timeStep);
  if (index === -1) {
    throw new ControllerError(
      `Time step ${timeStep} does not exist for "${attribute.attribute_name}"; available: ${
        timeSteps.join(", ") || "none"
      }`,
    );
  }
  return index;
}

// Like the attribute selector: a series keeps its stored step when valid, otherwise shows the first one
function seriesTimeStepIndex(
  requested: number | undefined,
  attribute: BackAttribute,
  binding: AttributeBinding,
): number | undefined {
  const stepCount = attribute.time_steps?.length ?? 0;
  if (requested !== undefined || stepCount === 0) {
    return requested;
  }
  const stored = binding.storedTimeStep();
  return stored !== undefined && stored >= 0 && stored < stepCount ? stored : 0;
}

export { requestedTimeStepIndex, seriesTimeStepIndex };
