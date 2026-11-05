function curveEdges(count: number, closed: boolean): [number, number][] {
  const edges = Array.from({ length: count - 1 }, (_, index): [number, number] => [
    index,
    index + 1,
  ]);
  if (closed && count >= 2) {
    edges.push([count - 1, 0]);
  }
  return edges;
}

function singlePolygon(count: number): number[][] {
  return [Array.from({ length: count }, (_, index) => index)];
}

export { curveEdges, singlePolygon };
