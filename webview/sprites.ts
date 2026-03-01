import { SpriteData } from './types';

const _ = '';

export const TILE_SIZE = 32;
export const COLS = 6;
export const ROWS = 3;

const OL = '#1a1a2e'; // outline color

const PAL = {
  outline: OL,
  wallTop: '#d4bfa0',
  wallMid: '#c4a888',
  wallBot: '#b09070',
  wallTrim: '#8a6a4a',
  floorA: '#c09060',
  floorB: '#b88555',
  floorC: '#a87a4a',
  floorLine: '#9a6e42',
  woodDark: '#5a3a1e',
  woodMid: '#7a5432',
  woodLight: '#9a7050',
  woodHighlight: '#b08a60',
  deskTop: '#c49a70',
  deskFront: '#8a6040',
  deskLeg: '#6a4a30',
  monitorFrame: '#2a2a3a',
  monitorScreen: '#1a2840',
  monitorCode1: '#66aaff',
  monitorCode2: '#44cc88',
  monitorCode3: '#88bbff',
  monitorStand: '#3a3a4a',
  chairSeat: '#4a4a5e',
  chairBack: '#3a3a4e',
  chairArm: '#5a5a6e',
  chairWheel: '#2a2a3a',
  chairStem: '#4a4a5a',
  skin: '#f2c8a0',
  skinShadow: '#d4a57a',
  hair: '#2a2030',
  hairHighlight: '#3a3040',
  suitDark: '#1e1e30',
  suitMid: '#2a2a42',
  suitLight: '#3a3a55',
  suitHighlight: '#4a4a66',
  dressShirt: '#e8e4e0',
  tie: '#cc3344',
  tieDark: '#aa2233',
  pantsBase: '#222238',
  pantsDark: '#1a1a2a',
  shoeDark: '#1a1418',
  red: '#dd4444',
  green: '#44aa44',
  greenLight: '#66cc55',
  greenDark: '#336633',
  blue: '#4466cc',
  yellow: '#ddcc44',
  orange: '#dd8844',
  purple: '#8855aa',
  white: '#f0f0f0',
  offWhite: '#e0ddd8',
  coffeeBrown: '#5c3317',
  mugWhite: '#e8e0d8',
  waterBlue: '#88ccee',
  waterLight: '#aaddff',
  potTerracotta: '#c06830',
  potDark: '#984820',
  potRim: '#d87838',
  catOrange: '#e8a040',
  catDark: '#c08030',
  black: '#1a1a2e',
};

export function fill(s: SpriteData, x1: number, y1: number, x2: number, y2: number, c: string) {
  for (let y = y1; y <= y2; y++)
    for (let x = x1; x <= x2; x++)
      if (y >= 0 && y < s.length && x >= 0 && x < s[0].length) s[y][x] = c;
}

export function outline(s: SpriteData, x1: number, y1: number, x2: number, y2: number, c: string) {
  for (let x = x1; x <= x2; x++) { if (y1 >= 0 && y1 < s.length) s[y1][x] = c; if (y2 >= 0 && y2 < s.length) s[y2][x] = c; }
  for (let y = y1; y <= y2; y++) { if (x1 >= 0 && x1 < s[0].length) s[y][x1] = c; if (x2 >= 0 && x2 < s[0].length) s[y][x2] = c; }
}

export function makeSprite(w: number, h: number): SpriteData {
  return Array.from({ length: h }, () => Array(w).fill(_));
}

// ============ TILES ============

export const floorTile: SpriteData = (() => {
  const s = makeSprite(32, 32);
  const { floorA: A, floorB: B, floorC: C, floorLine: L } = PAL;
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const noise = ((x * 7 + y * 13) % 5);
      s[y][x] = noise < 2 ? A : noise < 4 ? B : C;
    }
  for (let x = 0; x < 32; x++) { s[0][x] = L; s[16][x] = L; }
  for (let y = 0; y < 32; y++) { s[y][0] = L; s[y][16] = L; }
  return s;
})();

export const wallTile: SpriteData = (() => {
  const s = makeSprite(32, 32);
  const { wallTop: T, wallMid: M, wallBot: B, wallTrim: TR } = PAL;
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++)
      s[y][x] = y < 8 ? T : y < 24 ? M : y < 28 ? B : TR;
  for (let x = 0; x < 32; x++) s[28][x] = PAL.outline;
  for (let y = 8; y < 24; y++) { s[y][0] = PAL.wallBot; s[y][16] = PAL.wallBot; }
  return s;
})();

// ============ DESK — 64×40, prominent monitor, keyboard, mug ============

export const deskSprite: SpriteData = (() => {
  const s = makeSprite(64, 44);
  const { monitorFrame: MF, monitorScreen: MS, monitorCode1: C1, monitorCode2: C2, monitorCode3: C3,
    monitorStand: ST, deskTop: DT, deskFront: DF, deskLeg: DL, outline: O,
    mugWhite: MW, coffeeBrown: CB } = PAL;

  // Monitor — 24x16 centered
  fill(s, 20, 0, 43, 17, MF);
  outline(s, 20, 0, 43, 17, O);
  fill(s, 22, 2, 41, 15, MS);
  // Code lines on screen
  fill(s, 24, 4, 32, 4, C1);
  fill(s, 26, 6, 38, 6, C2);
  fill(s, 24, 8, 30, 8, C3);
  fill(s, 26, 10, 36, 10, C1);
  fill(s, 24, 12, 28, 12, C2);
  fill(s, 26, 14, 34, 14, C3);
  // Monitor stand
  fill(s, 30, 18, 33, 20, ST);
  fill(s, 27, 21, 36, 22, ST);
  outline(s, 27, 21, 36, 22, O);

  // Desk surface
  fill(s, 0, 23, 63, 28, DT);
  outline(s, 0, 23, 63, 28, O);
  fill(s, 1, 24, 62, 24, PAL.woodHighlight);

  // Keyboard on desk
  fill(s, 24, 25, 39, 27, PAL.chairSeat);
  outline(s, 24, 25, 39, 27, O);
  for (let x = 25; x < 39; x += 2) s[26][x] = PAL.chairArm;

  // Mug on desk — right side
  fill(s, 48, 20, 53, 27, MW);
  outline(s, 48, 20, 53, 27, O);
  fill(s, 49, 21, 52, 21, CB);
  fill(s, 49, 22, 52, 22, '#7a4422');
  s[23][54] = MW; s[24][55] = MW; s[25][55] = MW; s[26][54] = MW;
  s[23][54] = O; s[24][55] = O; s[25][55] = O; s[26][54] = O;
  s[23][54] = MW;

  // Desk front panel
  fill(s, 0, 29, 63, 33, DF);
  outline(s, 0, 29, 63, 33, O);

  // Desk legs
  fill(s, 2, 34, 5, 43, DL);
  outline(s, 2, 34, 5, 43, O);
  fill(s, 58, 34, 61, 43, DL);
  outline(s, 58, 34, 61, 43, O);

  return s;
})();

// ============ CHAIR — 28×32 ============

export const chairSprite: SpriteData = (() => {
  const s = makeSprite(28, 32);
  const { chairBack: CB, chairSeat: CS, chairArm: CA, chairStem: CSt, chairWheel: CW, outline: O } = PAL;

  // Backrest
  fill(s, 6, 0, 21, 12, CB);
  outline(s, 6, 0, 21, 12, O);
  fill(s, 8, 2, 19, 10, CS);

  // Armrests
  fill(s, 2, 10, 6, 14, CA);
  outline(s, 2, 10, 6, 14, O);
  fill(s, 21, 10, 25, 14, CA);
  outline(s, 21, 10, 25, 14, O);

  // Seat cushion
  fill(s, 4, 13, 23, 18, CS);
  outline(s, 4, 13, 23, 18, O);
  fill(s, 6, 14, 21, 16, CA);

  // Stem
  fill(s, 12, 19, 15, 24, CSt);
  outline(s, 12, 19, 15, 24, O);

  // Wheel base
  fill(s, 4, 25, 23, 27, CW);
  outline(s, 4, 25, 23, 27, O);
  // Wheels
  fill(s, 3, 28, 6, 31, O);
  fill(s, 21, 28, 24, 31, O);
  fill(s, 11, 28, 16, 31, O);

  return s;
})();

// ============ CAT — 20×14 ============

export const catSprite1: SpriteData = (() => {
  const s = makeSprite(20, 14);
  const { catOrange: O2, catDark: D, outline: OL, black: BK } = PAL;
  const P = '#ffaaaa';

  // Ears
  fill(s, 3, 0, 5, 2, O2); outline(s, 3, 0, 5, 2, OL);
  fill(s, 11, 0, 13, 2, O2); outline(s, 11, 0, 13, 2, OL);
  s[1][4] = P; s[1][12] = P;

  // Head
  fill(s, 2, 3, 14, 7, O2); outline(s, 2, 3, 14, 7, OL);
  s[5][5] = BK; s[5][6] = BK; s[5][11] = BK; s[5][12] = BK; // eyes
  s[6][8] = P; s[6][9] = P; // nose

  // Body
  fill(s, 3, 8, 13, 11, O2); outline(s, 3, 8, 13, 11, OL);
  fill(s, 5, 9, 11, 10, D);

  // Legs
  fill(s, 4, 12, 6, 13, D); outline(s, 4, 12, 6, 13, OL);
  fill(s, 10, 12, 12, 13, D); outline(s, 10, 12, 12, 13, OL);

  // Tail
  fill(s, 14, 7, 15, 8, D); fill(s, 16, 5, 17, 6, D); fill(s, 18, 3, 19, 4, D);
  s[7][14] = OL; s[5][16] = OL; s[3][18] = OL;

  return s;
})();

export const catSprite2: SpriteData = (() => {
  const s: SpriteData = catSprite1.map(r => [...r]);
  // Tail up
  for (let y = 3; y <= 8; y++) for (let x = 14; x <= 19; x++) s[y][x] = '';
  fill(s, 14, 8, 15, 9, PAL.catDark);
  fill(s, 15, 6, 16, 7, PAL.catDark);
  fill(s, 16, 4, 17, 5, PAL.catDark);
  fill(s, 17, 2, 18, 3, PAL.catDark);
  return s;
})();

// ============ PLANT — 24×32 with terracotta pot ============

export const plantStage1: SpriteData = (() => {
  const s = makeSprite(24, 32);
  const { potTerracotta: PT, potDark: PD, potRim: PR, greenDark: GD, green: G, outline: O } = PAL;
  // Pot
  fill(s, 6, 18, 17, 31, PT); outline(s, 6, 18, 17, 31, O);
  fill(s, 4, 17, 19, 19, PR); outline(s, 4, 17, 19, 19, O);
  fill(s, 8, 20, 10, 28, PD);
  // Small sprout
  fill(s, 11, 13, 12, 17, GD);
  s[12][10] = G; s[12][13] = G; s[11][10] = G; s[11][13] = G;
  return s;
})();

export const plantStage2: SpriteData = (() => {
  const s = makeSprite(24, 32);
  const { potTerracotta: PT, potDark: PD, potRim: PR, greenDark: GD, green: G, greenLight: GL, outline: O } = PAL;
  fill(s, 6, 18, 17, 31, PT); outline(s, 6, 18, 17, 31, O);
  fill(s, 4, 17, 19, 19, PR); outline(s, 4, 17, 19, 19, O);
  fill(s, 8, 20, 10, 28, PD);
  // Stem
  fill(s, 11, 8, 12, 17, GD);
  // Leaves
  fill(s, 6, 6, 10, 10, G); fill(s, 13, 6, 17, 10, G);
  fill(s, 8, 4, 15, 8, GL);
  outline(s, 6, 4, 17, 11, O);
  return s;
})();

export const plantStage3: SpriteData = (() => {
  const s = makeSprite(24, 32);
  const { potTerracotta: PT, potDark: PD, potRim: PR, greenDark: GD, green: G, greenLight: GL, red: R, yellow: Y, outline: O } = PAL;
  fill(s, 6, 18, 17, 31, PT); outline(s, 6, 18, 17, 31, O);
  fill(s, 4, 17, 19, 19, PR); outline(s, 4, 17, 19, 19, O);
  fill(s, 8, 20, 10, 28, PD);
  fill(s, 11, 6, 12, 17, GD);
  // Full foliage
  fill(s, 4, 2, 19, 12, G);
  fill(s, 6, 0, 17, 10, GL);
  outline(s, 4, 0, 19, 12, O);
  // Flowers
  fill(s, 7, 1, 9, 3, R); fill(s, 14, 2, 16, 4, Y);
  return s;
})();

// ============ WINDOW — 64×44, wooden frame with glass panes ============

export const windowSprite: SpriteData = (() => {
  const s = makeSprite(30, 22);
  const { outline: O, woodDark: WD, woodMid: WM, woodLight: WL } = PAL;

  fill(s, 0, 0, 29, 21, WM);
  outline(s, 0, 0, 29, 21, O);
  fill(s, 1, 1, 28, 1, WL);
  fill(s, 1, 1, 1, 20, WL);

  fill(s, 2, 2, 13, 17, '#88bbdd');
  outline(s, 2, 2, 13, 17, WD);

  fill(s, 16, 2, 27, 17, '#88bbdd');
  outline(s, 16, 2, 27, 17, WD);

  fill(s, 14, 0, 15, 21, WM);
  outline(s, 14, 0, 15, 21, O);

  fill(s, 0, 9, 29, 10, WM);
  fill(s, 1, 9, 28, 9, WL);

  fill(s, 0, 18, 29, 21, WD);
  outline(s, 0, 18, 29, 21, O);
  fill(s, 1, 19, 28, 19, WM);

  return s;
})();

// ============ ARCADE CABINET — 28×52 ============

export const arcadeCabinetSprite: SpriteData = (() => {
  const s = makeSprite(28, 56);
  const { outline: O, red: R, yellow: Y, blue: B, green: G, black: BK, chairSeat: BD } = PAL;

  // Top marquee
  fill(s, 4, 0, 23, 8, R);
  outline(s, 4, 0, 23, 8, O);
  fill(s, 8, 2, 19, 6, Y);

  // Screen area
  fill(s, 5, 9, 22, 28, BK);
  outline(s, 5, 9, 22, 28, O);
  fill(s, 7, 11, 20, 26, '#0a1428');
  // Game pixels
  fill(s, 12, 14, 15, 17, G); s[20][10] = B; s[20][17] = B;
  s[23][13] = Y; s[23][14] = Y;
  s[16][9] = R; s[18][18] = '#ff8844';

  // Control panel
  fill(s, 5, 29, 22, 34, BD);
  outline(s, 5, 29, 22, 34, O);
  fill(s, 10, 31, 12, 33, BK); // joystick
  s[32][16] = R; s[32][19] = B; // buttons

  // Body
  fill(s, 5, 35, 22, 51, '#3a3a4e');
  outline(s, 5, 35, 22, 51, O);

  // Base
  fill(s, 3, 52, 24, 55, BK);
  outline(s, 3, 52, 24, 55, O);

  return s;
})();

// ============ LAMP — 24×14 ceiling ============

export const lampSprite: SpriteData = (() => {
  const s = makeSprite(24, 14);
  const { outline: O, yellow: Y, chairSeat: SH } = PAL;
  // Cord
  fill(s, 11, 0, 12, 4, O);
  // Shade
  fill(s, 5, 5, 18, 9, SH); outline(s, 5, 5, 18, 9, O);
  // Bulb
  fill(s, 9, 10, 14, 13, Y); outline(s, 9, 10, 14, 13, O);
  return s;
})();

export const lampSpriteOff: SpriteData = (() => {
  const s: SpriteData = lampSprite.map(r => [...r]);
  fill(s, 9, 10, 14, 13, PAL.chairSeat);
  return s;
})();

// ============ BOOKSHELF — 28×56 with outlined books ============

export const bookshelfSprite: SpriteData = (() => {
  const s = makeSprite(28, 56);
  const { woodDark: WD, woodMid: WM, woodLight: WL, outline: O } = PAL;

  // Frame
  fill(s, 0, 0, 27, 55, WM);
  outline(s, 0, 0, 27, 55, O);
  // Back panel
  fill(s, 2, 2, 25, 53, WL);

  // Shelves
  for (const sy of [18, 36]) {
    fill(s, 0, sy, 27, sy + 1, WD);
    s[sy][0] = O; s[sy][27] = O; s[sy + 1][0] = O; s[sy + 1][27] = O;
  }

  // Books on each shelf
  const bookColors = [PAL.red, PAL.blue, PAL.green, PAL.yellow, PAL.purple, PAL.orange, '#3366aa'];
  for (let shelf = 0; shelf < 3; shelf++) {
    const baseY = shelf * 18 + 3;
    for (let i = 0; i < 5; i++) {
      const bx = 3 + i * 5;
      const color = bookColors[(shelf * 5 + i) % bookColors.length]!;
      const h = 10 + (i % 3) * 2;
      fill(s, bx, baseY + (14 - h), bx + 3, baseY + 14, color);
      outline(s, bx, baseY + (14 - h), bx + 3, baseY + 14, O);
    }
  }

  return s;
})();

// ============ WATER COOLER — 20×44 ============

export const waterCoolerSprite: SpriteData = (() => {
  const s = makeSprite(20, 44);
  const { white: W, offWhite: OW, outline: O, red: R, blue: B } = PAL;
  const BD = '#5a5a6a';
  const BL = '#6a6a7a';
  const BT = '#aaddff';
  const BM = '#88ccee';
  const BD2 = '#66aadd';

  // Water bottle — bright, translucent blues
  fill(s, 8, 0, 11, 3, BM); outline(s, 8, 0, 11, 3, O);
  fill(s, 6, 4, 13, 5, BT); outline(s, 6, 4, 13, 5, O);
  fill(s, 5, 6, 14, 17, BT); outline(s, 5, 6, 14, 17, O);
  fill(s, 6, 7, 13, 16, BM);
  fill(s, 7, 8, 12, 15, BT);
  // Highlight shine on bottle
  fill(s, 7, 7, 8, 14, '#cceeff');
  // Horizontal bands
  fill(s, 5, 10, 14, 10, BD2);
  fill(s, 5, 14, 14, 14, BD2);

  // Body — medium gray, not too dark
  fill(s, 4, 18, 15, 31, BD); outline(s, 4, 18, 15, 31, O);
  fill(s, 5, 19, 14, 30, BL);

  // Front panel — white inset with taps
  fill(s, 6, 21, 13, 29, W); outline(s, 6, 21, 13, 29, O);
  // Blue tap (cold) — left
  fill(s, 7, 23, 8, 24, B); outline(s, 7, 23, 8, 24, O);
  s[25][7] = B; s[25][8] = B;
  // Red tap (hot) — right
  fill(s, 11, 23, 12, 24, R); outline(s, 11, 23, 12, 24, O);
  s[25][11] = R; s[25][12] = R;

  // Drip tray
  fill(s, 5, 30, 14, 31, PAL.chairSeat); outline(s, 5, 30, 14, 31, O);

  // Base
  fill(s, 3, 32, 16, 35, BD); outline(s, 3, 32, 16, 35, O);
  fill(s, 4, 33, 15, 34, BL);

  // Feet
  fill(s, 4, 36, 6, 37, PAL.chairStem);
  fill(s, 13, 36, 15, 37, PAL.chairStem);

  return s;
})();

// ============ CHARACTER SPRITES — 24×36 suited office worker ============

function makeCharHead(s: SpriteData, headY: number) {
  const { skin: SK, skinShadow: SS, hair: H, hairHighlight: HH, outline: O, black: BK } = PAL;
  // Hair — neatly combed, darker
  fill(s, 7, headY, 16, headY + 3, H); outline(s, 7, headY, 16, headY + 3, O);
  fill(s, 9, headY + 1, 12, headY + 1, HH);
  // Face
  fill(s, 7, headY + 4, 16, headY + 9, SK); outline(s, 7, headY + 4, 16, headY + 9, O);
  s[headY + 5][7] = SS;
  // Eyes
  s[headY + 6][9] = BK; s[headY + 6][10] = BK;
  s[headY + 6][13] = BK; s[headY + 6][14] = BK;
  // Mouth
  s[headY + 8][11] = SS; s[headY + 8][12] = SS;
}

function makeSuitTorso(s: SpriteData, torsoY: number) {
  const { suitDark: SD, suitMid: SM, suitLight: SL, suitHighlight: SH,
    dressShirt: DS, tie: T, tieDark: TD, outline: O } = PAL;
  // Jacket body
  fill(s, 5, torsoY, 18, torsoY + 11, SM);
  outline(s, 5, torsoY, 18, torsoY + 11, O);
  // Jacket left lapel shadow
  fill(s, 5, torsoY, 7, torsoY + 8, SD);
  // Jacket right highlight
  fill(s, 16, torsoY + 1, 17, torsoY + 5, SL);
  // Shoulder highlights
  fill(s, 6, torsoY, 17, torsoY, SH);
  // White dress shirt V opening
  fill(s, 10, torsoY, 13, torsoY + 7, DS);
  // Tie
  fill(s, 11, torsoY + 1, 12, torsoY + 8, T);
  s[torsoY + 2][11] = TD; s[torsoY + 4][12] = TD; s[torsoY + 6][11] = TD;
  // Tie knot
  fill(s, 10, torsoY, 13, torsoY, DS);
  s[torsoY][11] = T; s[torsoY][12] = T;
}

function makeCharacterIdle(): SpriteData {
  const s = makeSprite(24, 36);
  const { suitDark: SD, suitMid: SM, pantsBase: PB, pantsDark: PD,
    skin: SK, shoeDark: SH, outline: O } = PAL;

  makeCharHead(s, 0);
  fill(s, 10, 10, 13, 11, PAL.skin);
  makeSuitTorso(s, 12);
  // Jacket sleeves / arms
  fill(s, 2, 13, 5, 21, SD); outline(s, 2, 13, 5, 21, O);
  fill(s, 3, 14, 4, 19, SM);
  fill(s, 18, 13, 21, 21, SD); outline(s, 18, 13, 21, 21, O);
  fill(s, 19, 14, 20, 19, SM);
  // Hands
  fill(s, 2, 22, 4, 23, SK); outline(s, 2, 22, 4, 23, O);
  fill(s, 19, 22, 21, 23, SK); outline(s, 19, 22, 21, 23, O);
  // Suit pants
  fill(s, 6, 24, 17, 30, PB); outline(s, 6, 24, 17, 30, O);
  fill(s, 6, 24, 8, 28, PD);
  // Shoes
  fill(s, 5, 31, 10, 34, SH); outline(s, 5, 31, 10, 34, O);
  fill(s, 13, 31, 18, 34, SH); outline(s, 13, 31, 18, 34, O);

  return s;
}

function makeCharacterSitType(frame: 0 | 1): SpriteData {
  const s = makeSprite(24, 36);
  const { suitDark: SD, suitMid: SM, suitHighlight: SH,
    hair: H, hairHighlight: HH, pantsBase: PB,
    skin: SK, outline: O } = PAL;

  // Back of head (sitting faces monitor)
  fill(s, 7, 0, 16, 9, H); outline(s, 7, 0, 16, 9, O);
  fill(s, 8, 1, 15, 8, HH);
  s[5][7] = SK; s[5][16] = SK;
  // Neck
  fill(s, 10, 10, 13, 11, SK);
  // Back of jacket
  fill(s, 5, 12, 18, 23, SM); outline(s, 5, 12, 18, 23, O);
  fill(s, 6, 13, 17, 22, SD);
  fill(s, 11, 13, 12, 22, SM);
  fill(s, 6, 12, 17, 12, SH);
  // Upper arms tucked at sides
  fill(s, 2, 13, 5, 18, SD); outline(s, 2, 13, 5, 18, O);
  fill(s, 18, 13, 21, 18, SD); outline(s, 18, 13, 21, 18, O);
  // Forearms angled inward toward keyboard
  const armOff = frame === 0 ? 0 : 1;
  fill(s, 5, 19, 8, 20 + armOff, SD); outline(s, 5, 19, 8, 20 + armOff, O);
  fill(s, 15, 19, 18, 20, SD); outline(s, 15, 19, 18, 20, O);
  // Hands near center (on keyboard)
  fill(s, 8, 21 + armOff, 10, 22 + armOff, SK); outline(s, 8, 21 + armOff, 10, 22 + armOff, O);
  fill(s, 13, 21, 15, 22, SK); outline(s, 13, 21, 15, 22, O);
  // Seated legs
  fill(s, 6, 23, 17, 27, PB); outline(s, 6, 23, 17, 27, O);
  fill(s, 5, 28, 10, 31, PB); outline(s, 5, 28, 10, 31, O);

  return s;
}

function makeCharacterCelebrate(): SpriteData {
  const s = makeSprite(24, 36);
  const { suitDark: SD, suitMid: SM, pantsBase: PB,
    skin: SK, shoeDark: SH, outline: O, yellow: Y } = PAL;

  makeCharHead(s, 0);
  fill(s, 10, 10, 13, 11, PAL.skin);
  makeSuitTorso(s, 12);
  // Arms UP in suit sleeves
  fill(s, 1, 4, 5, 13, SD); outline(s, 1, 4, 5, 13, O);
  fill(s, 2, 5, 4, 11, SM);
  fill(s, 18, 4, 22, 13, SD); outline(s, 18, 4, 22, 13, O);
  fill(s, 19, 5, 21, 11, SM);
  // Hands up
  fill(s, 0, 1, 3, 4, SK); outline(s, 0, 1, 3, 4, O);
  fill(s, 20, 1, 23, 4, SK); outline(s, 20, 1, 23, 4, O);
  // Stars
  s[0][0] = Y; s[1][1] = Y; s[0][23] = Y; s[1][22] = Y;
  // Pants
  fill(s, 6, 24, 17, 30, PB); outline(s, 6, 24, 17, 30, O);
  fill(s, 5, 31, 10, 34, SH); outline(s, 5, 31, 10, 34, O);
  fill(s, 13, 31, 18, 34, SH); outline(s, 13, 31, 18, 34, O);

  return s;
}

function makeCharacterWalk(frame: 0 | 1): SpriteData {
  const s = makeSprite(24, 36);
  const { suitDark: SD, suitMid: SM, pantsBase: PB, pantsDark: PD,
    skin: SK, shoeDark: SH, outline: O } = PAL;

  makeCharHead(s, 0);
  fill(s, 10, 10, 13, 11, PAL.skin);
  makeSuitTorso(s, 12);
  // Arms swing in suit sleeves
  const armY = frame === 0 ? 14 : 15;
  fill(s, 2, armY, 5, armY + 7, SD); outline(s, 2, armY, 5, armY + 7, O);
  fill(s, 3, armY + 1, 4, armY + 5, SM);
  fill(s, 18, 28 - armY, 21, 35 - armY, SD); outline(s, 18, 28 - armY, 21, 35 - armY, O);
  fill(s, 19, 29 - armY, 20, 33 - armY, SM);
  // Legs walk
  if (frame === 0) {
    fill(s, 5, 24, 10, 29, PB); outline(s, 5, 24, 10, 29, O);
    fill(s, 12, 25, 17, 31, PD); outline(s, 12, 25, 17, 31, O);
    fill(s, 4, 30, 9, 34, SH); outline(s, 4, 30, 9, 34, O);
    fill(s, 13, 32, 18, 35, SH); outline(s, 13, 32, 18, 35, O);
  } else {
    fill(s, 5, 25, 10, 31, PD); outline(s, 5, 25, 10, 31, O);
    fill(s, 12, 24, 17, 29, PB); outline(s, 12, 24, 17, 29, O);
    fill(s, 4, 32, 9, 35, SH); outline(s, 4, 32, 9, 35, O);
    fill(s, 13, 30, 18, 34, SH); outline(s, 13, 30, 18, 34, O);
  }

  return s;
}

function makeCharacterBack(): SpriteData {
  const s = makeSprite(24, 36);
  const { suitDark: SD, suitMid: SM, suitLight: SL, suitHighlight: SH,
    hair: H, hairHighlight: HH, pantsBase: PB, pantsDark: PD,
    skin: SK, shoeDark: SHO, outline: O } = PAL;

  // Back of head — all hair, no face
  fill(s, 7, 0, 16, 9, H); outline(s, 7, 0, 16, 9, O);
  fill(s, 8, 1, 15, 8, HH);
  // Ears peeking out
  s[5][7] = SK; s[5][16] = SK;
  // Neck
  fill(s, 10, 10, 13, 11, SK);
  // Back of jacket
  fill(s, 5, 12, 18, 23, SM); outline(s, 5, 12, 18, 23, O);
  fill(s, 6, 13, 17, 22, SD);
  // Center seam
  fill(s, 11, 13, 12, 22, SM);
  // Shoulder highlights
  fill(s, 6, 12, 17, 12, SH);
  // Sleeves
  fill(s, 2, 13, 5, 21, SD); outline(s, 2, 13, 5, 21, O);
  fill(s, 3, 14, 4, 19, SM);
  fill(s, 18, 13, 21, 21, SD); outline(s, 18, 13, 21, 21, O);
  fill(s, 19, 14, 20, 19, SM);
  // Hands
  fill(s, 2, 22, 4, 23, SK); outline(s, 2, 22, 4, 23, O);
  fill(s, 19, 22, 21, 23, SK); outline(s, 19, 22, 21, 23, O);
  // Pants
  fill(s, 6, 24, 17, 30, PB); outline(s, 6, 24, 17, 30, O);
  fill(s, 6, 24, 8, 28, PD);
  // Shoes
  fill(s, 5, 31, 10, 34, SHO); outline(s, 5, 31, 10, 34, O);
  fill(s, 13, 31, 18, 34, SHO); outline(s, 13, 31, 18, 34, O);

  return s;
}

// ============ DESK PHONE — 16×14 classic red rotary phone ============

export const phoneSprite: SpriteData = (() => {
  const s = makeSprite(16, 14);
  const { outline: O } = PAL;
  const RD = '#cc2222';
  const RL = '#dd4444';
  const RK = '#aa1818';
  const HB = '#222230';
  const HL = '#3a3a4e';

  // Base body — rounded red block
  fill(s, 2, 6, 13, 13, RD);
  outline(s, 2, 6, 13, 13, O);
  fill(s, 3, 7, 12, 12, RL);
  fill(s, 3, 11, 12, 12, RK);

  // Rotary dial circle on base
  fill(s, 5, 8, 10, 11, RK);
  outline(s, 5, 8, 10, 11, O);
  fill(s, 6, 9, 9, 10, '#e8ddd0');
  s[9][7] = '#888';
  s[10][8] = '#888';

  // Handset resting on top — earpiece left, mouthpiece right
  fill(s, 0, 2, 4, 6, HB);
  outline(s, 0, 2, 4, 6, O);
  fill(s, 1, 3, 3, 5, HL);

  fill(s, 11, 2, 15, 6, HB);
  outline(s, 11, 2, 15, 6, O);
  fill(s, 12, 3, 14, 5, HL);

  // Handset bridge connecting earpiece to mouthpiece
  fill(s, 4, 4, 11, 5, HB);
  outline(s, 4, 4, 11, 5, O);

  // Cradle bumps
  s[6][4] = RD; s[6][11] = RD;
  s[5][4] = O; s[5][11] = O;

  // Cord coming off right side
  s[10][14] = '#444'; s[11][15] = '#444';

  return s;
})();

function makeCharacterPhoning(): SpriteData {
  const s = makeSprite(24, 36);
  const { suitDark: SD, suitMid: SM, suitHighlight: SH,
    hair: H, hairHighlight: HH, pantsBase: PB, pantsDark: PD,
    skin: SK, shoeDark: SHO, outline: O } = PAL;
  const RD = '#cc2222';
  const RL = '#dd4444';
  const RK = '#aa1818';

  // Back of head (same as back/sitType)
  fill(s, 7, 0, 16, 9, H); outline(s, 7, 0, 16, 9, O);
  fill(s, 8, 1, 15, 8, HH);
  s[5][7] = SK; s[5][16] = SK;
  // Neck
  fill(s, 10, 10, 13, 11, SK);
  // Back of jacket
  fill(s, 5, 12, 18, 23, SM); outline(s, 5, 12, 18, 23, O);
  fill(s, 6, 13, 17, 22, SD);
  fill(s, 11, 13, 12, 22, SM);
  fill(s, 6, 12, 17, 12, SH);

  // Right arm down (resting)
  fill(s, 18, 13, 21, 21, SD); outline(s, 18, 13, 21, 21, O);
  fill(s, 19, 14, 20, 19, SM);
  fill(s, 19, 22, 21, 23, SK); outline(s, 19, 22, 21, 23, O);

  // Left arm raised holding phone to ear
  fill(s, 2, 6, 5, 14, SD); outline(s, 2, 6, 5, 14, O);
  fill(s, 3, 7, 4, 12, SM);
  fill(s, 2, 3, 4, 6, SK); outline(s, 2, 3, 4, 6, O);

  // Red handset at left ear (matches desk phone color)
  fill(s, 0, 0, 2, 3, RD); outline(s, 0, 0, 2, 3, O);
  fill(s, 1, 1, 1, 2, RL);
  fill(s, 0, 4, 1, 6, RK);
  fill(s, 0, 7, 2, 10, RD); outline(s, 0, 7, 2, 10, O);
  fill(s, 1, 8, 1, 9, RL);

  // Pants & shoes
  fill(s, 6, 24, 17, 30, PB); outline(s, 6, 24, 17, 30, O);
  fill(s, 6, 24, 8, 28, PD);
  fill(s, 5, 31, 10, 34, SHO); outline(s, 5, 31, 10, 34, O);
  fill(s, 13, 31, 18, 34, SHO); outline(s, 13, 31, 18, 34, O);

  return s;
}

export const characterSprites = {
  idle: makeCharacterIdle(),
  back: makeCharacterBack(),
  sitType1: makeCharacterSitType(0),
  sitType2: makeCharacterSitType(1),
  celebrate: makeCharacterCelebrate(),
  walk1: makeCharacterWalk(0),
  walk2: makeCharacterWalk(1),
  phoning: makeCharacterPhoning(),
};

export function renderSprite(ctx: CanvasRenderingContext2D, sprite: SpriteData, x: number, y: number, scale: number) {
  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      const color = sprite[row][col];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.floor(x + col * scale),
        Math.floor(y + row * scale),
        Math.ceil(scale),
        Math.ceil(scale)
      );
    }
  }
}
