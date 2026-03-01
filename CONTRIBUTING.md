# Contributing to Agent Arcade

Pull requests welcome. Here's how to add things.

## Setup

```bash
git clone https://github.com/ofershap/agent-arcade.git
cd agent-arcade
npm install
npm run build
```

Press F5 in Cursor/VS Code to launch the Extension Development Host with the extension loaded. Changes to `webview/` files require a rebuild (`npm run build`) and a reload of the dev host window.

## Adding an Interactive Object

Every object in the office is an `InteractiveObject`. To add one, create a factory function in `webview/objects.ts` and add it to `createDefaultObjects()`.

### The interface

```typescript
interface InteractiveObject {
  id: string;
  sprites: SpriteData[];
  position: { col: number; row: number };
  hitbox: { w: number; h: number };
  zY: number;
  state: Record<string, unknown>;
  onClick: (obj: InteractiveObject, office: OfficeState) => void;
  render: (ctx: CanvasRenderingContext2D, obj: InteractiveObject, tick: number, scale: number) => void;
}
```

### Fields

- `id` - unique string, used for hit testing and click-to-attract
- `sprites` - array of `SpriteData` (2D color arrays). Can be empty if you draw manually in `render`
- `position` - `{ col, row }` in tile coordinates. The office is 6 columns wide, 3 rows tall. Row 0 is the back wall, row ~2.5 is the front
- `hitbox` - width/height in pixels (not tiles). Gets scaled automatically
- `zY` - y-sort value for depth ordering. Higher = rendered later (in front). Usually `(row + spriteHeightInTiles) * 32`
- `state` - freeform object for your internal state (click counts, timers, toggles)
- `onClick` - called when clicked. Return a string to show it as a speech bubble on the character, or `null` for no bubble
- `render` - draw the object each frame. `tick` is seconds since start, `scale` is the current pixel scale

### Example: a trophy

```typescript
export function createTrophy(col: number, row: number): InteractiveObject {
  return {
    id: 'trophy',
    sprites: [trophySprite],
    position: { col, row },
    hitbox: { w: 12, h: 16 },
    zY: (row + 0.5) * TILE_SIZE,
    state: { shineTimer: 0 },
    onClick: (obj) => {
      obj.state.shineTimer = 2;
      return '🏆 100 builds!';
    },
    render: (ctx, obj, tick, scale) => {
      const x = obj.position.col * TILE_SIZE * scale;
      const y = obj.position.row * TILE_SIZE * scale;
      renderSprite(ctx, obj.sprites[0]!, x, y, scale);

      if ((obj.state.shineTimer as number) > 0) {
        obj.state.shineTimer = (obj.state.shineTimer as number) - 0.016;
        const alpha = 0.5 * ((obj.state.shineTimer as number) / 2);
        ctx.fillStyle = `rgba(255,255,200,${alpha})`;
        ctx.beginPath();
        ctx.arc(x + 6 * scale, y + 4 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  };
}
```

Then in `createDefaultObjects()`:

```typescript
createTrophy(3.5, 0.4),
```

### Runtime registration

Objects can also be registered at runtime via the global API:

```typescript
window.agentArcade.registerObject(myObject);
window.agentArcade.removeObject('trophy');
```

## Adding a Sprite

Sprites live in `webview/sprites.ts` as 2D arrays of hex color strings. Empty string = transparent pixel.

```typescript
export const trophySprite: SpriteData = [
  ['', '#ffd700', '#ffd700', ''],
  ['#ffd700', '#ffed4a', '#ffed4a', '#ffd700'],
  ['', '#daa520', '#daa520', ''],
  ['', '#8b6914', '#8b6914', ''],
];
```

Each row is a horizontal line of pixels. Use `renderSprite(ctx, sprite, x, y, scale)` to draw them.

## Adding a Background

You can contribute custom office backgrounds (floor and wall themes). A background is a pair of render functions.

### The interface

```typescript
interface BackgroundRenderer {
  id: string;
  name: string;
  renderFloor: (ctx, cols, rows, wallRows, tileSize, scale, tick) => void;
  renderWall: (ctx, cols, wallRows, tileSize, scale, tick) => void;
}
```

### Example: concrete office

```typescript
const concreteBackground: BackgroundRenderer = {
  id: 'concrete',
  name: 'Concrete Loft',
  renderFloor: (ctx, cols, rows, wallRows, tileSize, scale, _tick) => {
    for (let r = wallRows; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * tileSize * scale;
        const y = r * tileSize * scale;
        ctx.fillStyle = (c + r) % 2 === 0 ? '#3a3a3a' : '#383838';
        ctx.fillRect(x, y, tileSize * scale, tileSize * scale);
      }
    }
  },
  renderWall: (ctx, cols, wallRows, tileSize, scale, _tick) => {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, cols * tileSize * scale, wallRows * tileSize * scale);
  },
};

window.agentArcade.registerBackground(concreteBackground);
```

The default background renders warm wood floors and blue-gray walls. Custom backgrounds replace both. Objects, character, lighting, and particles render on top of whatever background you provide.

## Making clickable objects work with attract

If you want the character to walk to your object when it's clicked during idle, add an entry in `OBJECT_POSITIONS` in `webview/character.ts`:

```typescript
const OBJECT_POSITIONS: Record<string, { col: number; row: number; action: string }> = {
  // ...existing entries
  trophy: { col: 3.5, row: 1.2, action: 'lookAround' },
};
```

The `col`/`row` is where the character stands when attracted. The `action` controls the facing direction and idle pose.

## Code style

- No comments explaining what code does. Only comment non-obvious *why*
- TypeScript strict mode
- No external runtime dependencies
- Sprites as code, no image files

## Submitting

1. Fork the repo
2. Create a branch (`git checkout -b add-trophy-object`)
3. Build and test locally (`npm run build`, F5 to test in dev host)
4. Open a PR with a screenshot showing your addition in the office
