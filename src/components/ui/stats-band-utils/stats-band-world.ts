export const WORLD = {
  columns: 48,
  rows: 24,
  west: -180,
  east: 180,
  north: 85,
  south: -60,
};

// Simplified raster representation of global landmasses on a 48x24 grid
const mapAscii = [
  "                                                ",
  "        ..  .....                .....          ",
  "       ....... ...              ........        ",
  "     ............              ...........      ",
  "     .............            ..............    ",
  "      ...........             ...............   ",
  "       ..........             ..............    ",
  "        ........               ............     ",
  "         ......                 ..........      ",
  "          ....                   ........       ",
  "          ...          ....       ......        ",
  "          ..         ........      ....         ",
  "           .        ..........                  ",
  "                    ...........                 ",
  "                     .........                  ",
  "                      .......                   ",
  "                       .....       ....         ",
  "                        ...       ......        ",
  "                         .        ........      ",
  "                                   ......       ",
  "                                     ..         ",
  "                                                ",
  "                                                ",
  "                                                ",
];

export const worldLand: boolean[] = [];

for (let r = 0; r < WORLD.rows; r++) {
  const rowStr = mapAscii[r] || "";
  for (let c = 0; c < WORLD.columns; c++) {
    const char = rowStr[c] || " ";
    worldLand.push(char !== " ");
  }
}
