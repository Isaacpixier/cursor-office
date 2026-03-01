import { OfficeState } from './types';
import { renderOffice } from './office';
import { updateCharacter } from './character';

export function startGameLoop(
  canvas: HTMLCanvasElement,
  state: OfficeState,
  getScale: () => number,
  getOffsetX: () => number,
  getOffsetY: () => number
) {
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  let lastTime = performance.now();

  function loop(now: number) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    state.tick += dt;

    updateCharacter(state.character, dt);

    for (const ft of state.floatingTexts) ft.age += dt;
    state.floatingTexts = state.floatingTexts.filter(ft => ft.age < 1.2);

    if (state.clickCounter) {
      state.clickCounter.resetTimer -= dt;
      if (state.clickCounter.resetTimer <= 0) state.clickCounter = null;
    }

    const scale = getScale();
    const offsetX = getOffsetX();
    const offsetY = getOffsetY();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderOffice(ctx, state, scale, offsetX, offsetY);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
