export type ValidKeys = 'ArrowRight' | 'KeyD' | 'ArrowLeft' | 'KeyA' | 'Space';
export type KeyCallback = (key: ValidKeys, isPressed: boolean) => void;

export type Rect = { x: number; y: number; width: number; height: number };
export type XY = { x: number; y: number };
export type Dimension = { width: number; height: number };
export interface BackgroundProps {
  imageSrc: string;
  position: {
    x: number;
    y: number;
  };
}

export type KeysPressedState = Record<ValidKeys, boolean>;

export type PlayerPhysicsOutputs = {
  handleJump: () => void;
  handleRelease: () => void;
  handleLand: () => void;
  handleLeaveGround: () => void;
  applyGravity: (deltaTime: number) => void;
  setMoveDirection: (keysPressed: Record<ValidKeys, boolean>) => void;
  velocityRef: React.MutableRefObject<{ x: number; y: number }>;
  previousVelocityRef: React.MutableRefObject<{ x: number; y: number }>;
  gravityRef: React.MutableRefObject<number>;
  isGrounded: React.MutableRefObject<boolean>;
};

export type Collision = {
  block: Rect;
  collisionDirection: string;
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>;
  playerHitBox: { width: number; height: number };
  velocity: { x: number; y: number };
  axis: 'x' | 'y';
};
