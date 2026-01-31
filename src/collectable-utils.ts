export function boundsAroundPlayer(px: number, py: number, radius: number) {
  return {
    minX: px - radius,
    maxX: px + radius,
    minY: py - radius,
    maxY: py + radius,
  };
}
