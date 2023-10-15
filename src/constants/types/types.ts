export type ValidKeys = 'ArrowRight' | 'KeyD' | 'ArrowLeft' | 'KeyA' | 'Space';
export type KeyCallback = (key: ValidKeys, isPressed: boolean) => void;

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
  applyGravity: (deltaTime: number) => void;
  setMoveDirection: (keysPressed: Record<ValidKeys, boolean>) => void;
  velocity: { x: number; y: number };
  previousVelocity: { x: number; y: number };
  gravity: number;
};
