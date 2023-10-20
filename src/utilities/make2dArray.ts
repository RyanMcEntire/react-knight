export function parse2D(data: number[], canvasWidth: number): number[][] {
  const rows = [];
  for (let i = 0; i < data.length; i += canvasWidth / 16) {
    rows.push(data.slice(i, i + canvasWidth / 16));
  }
  return rows;
}
