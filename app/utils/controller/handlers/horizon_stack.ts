// Third party imports
import type { LegacyDataId } from "@ogw_front/utils/legacy_data_id";
import type { NewDataItem } from "@ogw_front/stores/data";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { importItem } from "@ogw_front/utils/import_workflow";

// Local imports
import { ControllerError } from "@vease/utils/controller/errors";
import { getBackStore } from "@vease/utils/external_stores";

interface CreateHorizonStackParams {
  name: string;
  horizons: string[];
  unit_names?: string[];
}

interface NamedComponent {
  id: string;
  name: string;
}

interface HorizonStackInfo {
  horizons: NamedComponent[];
  units: NamedComponent[];
}

interface ColumnRow extends NamedComponent {
  kind: "horizon" | "unit";
}

const schemas = back_schemas.opengeodeweb_back;

async function createHorizonStack(params: unknown): Promise<{ id: string; name: string }> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const { name, horizons, unit_names: unitNames = [] } = params as CreateHorizonStackParams;
  if (unitNames.length > 0 && unitNames.length !== horizons.length + 1) {
    throw new ControllerError(
      `${horizons.length} horizons need ${horizons.length + 1} unit names, got ${unitNames.length}`,
    );
  }
  const item = await getBackStore().request({
    schema: schemas.create.horizon_stack,
    params: { name, horizons, unit_names: unitNames },
  });
  // oxlint-disable-next-line no-unsafe-type-assertion -- trusted API boundary; response shape matches NewDataItem, except for its legacy id.
  const created = item as LegacyDataId<NewDataItem>;
  await importItem(created);
  return { id: created.id, name: created.name ?? name };
}

async function horizonStackInfo(params: unknown): Promise<HorizonStackInfo> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const { id } = params as { id: string };
  const info = await getBackStore().request({ schema: schemas.horizon_stack_info, params: { id } });
  return info;
}

// Units and horizons interleaved top to bottom; a stack read from a file may lack some units
function stratigraphicColumn({ horizons, units }: HorizonStackInfo): ColumnRow[] {
  const rows: ColumnRow[] = [];
  for (let index = 0; index < Math.max(horizons.length, units.length); index += 1) {
    const unit = units[index];
    if (unit) {
      rows.push({ ...unit, kind: "unit", name: unit.name || `Unit ${index + 1}` });
    }
    const horizon = horizons[index];
    if (horizon) {
      rows.push({ ...horizon, kind: "horizon", name: horizon.name || `Horizon ${index + 1}` });
    }
  }
  return rows;
}

export { createHorizonStack, horizonStackInfo, stratigraphicColumn };
export type { ColumnRow, HorizonStackInfo, NamedComponent };
