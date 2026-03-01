export type SpriteData = string[][];

export interface Position {
  col: number;
  row: number;
}

export interface InteractiveObject {
  id: string;
  sprites: SpriteData[];
  position: Position;
  hitbox: { w: number; h: number };
  zY: number;
  state: Record<string, unknown>;
  onClick: (obj: InteractiveObject, office: OfficeState) => void;
  render: (ctx: CanvasRenderingContext2D, obj: InteractiveObject, tick: number, scale: number) => void;
}

export type AgentActivity = 'idle' | 'typing' | 'reading' | 'running' | 'editing' | 'searching' | 'celebrating' | 'walking' | 'phoning' | 'error';

export interface CharacterState {
  activity: AgentActivity;
  position: Position;
  targetPosition: Position | null;
  animFrame: number;
  speechBubble: string | null;
  speechBubbleTimer: number;
  facingDir: 'left' | 'right' | 'back';
}

export interface FloatingText {
  text: string;
  x: number;
  y: number;
  age: number;
  color: string;
}

export interface ClickCounter {
  objectId: string;
  count: number;
  resetTimer: number;
}

export interface BackgroundRenderer {
  id: string;
  name: string;
  renderFloor: (ctx: CanvasRenderingContext2D, cols: number, rows: number, wallRows: number, tileSize: number, scale: number, tick: number) => void;
  renderWall: (ctx: CanvasRenderingContext2D, cols: number, wallRows: number, tileSize: number, scale: number, tick: number) => void;
}

export interface OfficeState {
  objects: InteractiveObject[];
  character: CharacterState;
  dimmed: boolean;
  tick: number;
  hoveredObjectId: string | null;
  floatingTexts: FloatingText[];
  clickCounter: ClickCounter | null;
  customBackground: BackgroundRenderer | null;
}

export interface AgentMessage {
  type: 'agentStatus';
  activity: AgentActivity;
  statusText: string | null;
}
