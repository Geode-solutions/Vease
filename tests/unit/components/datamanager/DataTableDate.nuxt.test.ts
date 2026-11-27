import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import type { DataItem } from "@ogw_front/stores/data";
import DataTable from "@vease/components/datamanager/DataTable.vue";

vi.setConfig({ testTimeout: 10_000 });

const MINUTES_AGO = 12;
const DAYS_AGO = 3;
const OLD_DAYS_AGO = 40;
const MILLISECONDS_IN_MINUTE = 60_000;
const MILLISECONDS_IN_DAY = 86_400_000;

function itemCreatedAt(createdAt: Date): DataItem {
  return {
    data_id: "item",
    geode_id: "00000000-0000-0000-0000-000000000001",
    name: "Surface",
    geode_object_type: "TriangulatedSurface3D",
    viewer_object_type: "mesh",
    visible: true,
    created_at: createdAt.toISOString(),
  };
}

function dateCellText(createdAt: Date): string {
  const wrapper = mountWithPlugins(DataTable, {
    props: { items: [itemCreatedAt(createdAt)], search: "", compact: false },
  });
  return wrapper.find('[data-testid="dateCell"]').text();
}

describe("data table date", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("a recent data shows how long ago it was imported", () => {
    const minutesAgo = new Date(Date.now() - MINUTES_AGO * MILLISECONDS_IN_MINUTE);
    const daysAgo = new Date(Date.now() - DAYS_AGO * MILLISECONDS_IN_DAY);
    expect(dateCellText(minutesAgo)).toBe(`${MINUTES_AGO}m ago`);
    expect(dateCellText(daysAgo)).toBe(`${DAYS_AGO}d ago`);
  });

  test("an older data shows its date", () => {
    const createdAt = new Date(Date.now() - OLD_DAYS_AGO * MILLISECONDS_IN_DAY);
    expect(dateCellText(createdAt)).toBe(createdAt.toLocaleDateString());
  });
});
