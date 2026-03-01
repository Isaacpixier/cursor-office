import { OfficeState } from './types';
import { TILE_SIZE, COLS, ROWS, floorTile, wallTile, renderSprite } from './sprites';
import { renderCharacter } from './character';

const WALL_ROWS = 1;

export function renderOffice(ctx: CanvasRenderingContext2D, state: OfficeState, scale: number, offsetX: number, offsetY: number) {
  const tileS = TILE_SIZE * scale;
  const sceneW = COLS * tileS;
  const sceneH = ROWS * tileS;

  ctx.fillStyle = '#0e0e1a';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Floor
  for (let r = WALL_ROWS; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      renderSprite(ctx, floorTile, c * tileS, r * tileS, scale);

  // Wall
  for (let r = 0; r < WALL_ROWS; r++)
    for (let c = 0; c < COLS; c++)
      renderSprite(ctx, wallTile, c * tileS, r * tileS, scale);

  // Baseboard — thick line where wall meets floor
  const baseY = WALL_ROWS * tileS;
  ctx.fillStyle = '#3a3a58';
  ctx.fillRect(0, baseY - Math.ceil(scale), sceneW, Math.ceil(scale * 2));
  ctx.fillStyle = '#2a2a44';
  ctx.fillRect(0, baseY + Math.ceil(scale), sceneW, Math.ceil(scale));

  // Wall shadow on floor (soft gradient)
  const shadowGrad = ctx.createLinearGradient(0, baseY, 0, baseY + 20 * scale);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0.2)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, baseY, sceneW, 20 * scale);

  // Z-sorted rendering of objects and character
  const sortable: { zY: number; render: () => void }[] = [];

  for (const obj of state.objects) {
    sortable.push({
      zY: obj.zY,
      render: () => obj.render(ctx, obj, state.tick, scale),
    });
  }

  sortable.push({
    zY: (state.character.position.row + 1) * TILE_SIZE,
    render: () => {
      const px = state.character.position.col * tileS;
      const py = state.character.position.row * tileS - 8 * scale;
      renderCharacter(ctx, state.character, px, py, scale);
    },
  });

  sortable.sort((a, b) => a.zY - b.zY);
  for (const item of sortable) item.render();

  // Lamp light cone on floor
  const lamp = state.objects.find(o => o.id === 'lamp');
  if (lamp && lamp.state.on) {
    const lx = lamp.position.col * tileS + 8 * scale;
    const ly = lamp.position.row * tileS + 8 * scale;
    const pulseR = 50 * scale + Math.sin(state.tick * 1.5) * 3 * scale;
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly + 20 * scale, pulseR);
    grad.addColorStop(0, 'rgba(255,240,180,0.12)');
    grad.addColorStop(0.4, 'rgba(255,240,180,0.06)');
    grad.addColorStop(1, 'rgba(255,240,180,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(lx - pulseR, ly, pulseR * 2, pulseR);
  }

  // Monitor glow (subtle blue glow on desk area)
  const desk = state.objects.find(o => o.id === 'desk');
  if (desk && !state.dimmed) {
    const mx = desk.position.col * tileS + 16 * scale;
    const my = desk.position.row * tileS;
    const glowR = 25 * scale;
    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, glowR);
    const pulse = 0.06 + 0.02 * Math.sin(state.tick * 2);
    grad.addColorStop(0, `rgba(100,160,255,${pulse})`);
    grad.addColorStop(1, 'rgba(100,160,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(mx - glowR, my - glowR, glowR * 2, glowR * 2);
  }

  // Dimmed overlay
  if (state.dimmed) {
    ctx.fillStyle = 'rgba(0,0,20,0.5)';
    ctx.fillRect(0, 0, sceneW, sceneH);
  }

  // Ambient dust particles
  renderParticles(ctx, state, scale);

  ctx.restore();
}

function renderParticles(ctx: CanvasRenderingContext2D, state: OfficeState, scale: number) {
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 8; i++) {
    const x = ((state.tick * 4 + i * 83) % (COLS * TILE_SIZE)) * scale;
    const y = ((Math.sin(state.tick * 0.3 + i * 1.7) * 0.5 + 0.5) * ROWS * TILE_SIZE) * scale;
    const sz = (0.8 + Math.sin(state.tick * 0.6 + i) * 0.4) * scale;
    ctx.fillStyle = '#ffe8c0';
    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
