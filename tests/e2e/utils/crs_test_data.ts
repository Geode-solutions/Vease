const BREP_FILE = "test.og_brep";
const POINTSET_FILE = "test.og_pts3d";
// Wells-like data sharing the local frame of the model: aligned with it
const CURVE_FILE = "test.og_edc3d";
const POINTSET_NAME = "test";
const BREP_NAME = "test";
const LAMBERT_93 = "RGF93 v1 / Lambert-93";
const UTM_31N = "WGS 84 / UTM zone 31N";
const CC42 = "RGF93 v1 / CC42";
const ALIGN_SOURCE = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];
const ALIGN_TARGET = [
  { x: 700_000, y: 6_600_000 },
  { x: 700_010, y: 6_600_000 },
  { x: 700_000, y: 6_600_010 },
];

export {
  ALIGN_SOURCE,
  ALIGN_TARGET,
  BREP_FILE,
  BREP_NAME,
  CC42,
  CURVE_FILE,
  LAMBERT_93,
  POINTSET_FILE,
  POINTSET_NAME,
  UTM_31N,
};
