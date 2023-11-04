import React from 'react';

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

export type UseCanvasDrawingProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  objectPosition: XY;
  scale: number;
  spriteAnimationRef: React.MutableRefObject<SpriteAnimationState>;
  playerDirectionRef: React.MutableRefObject<string>;
  getAnimationState: () => AnimationState;
};

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
  isGroundedRef: React.MutableRefObject<boolean>;
  playerDirectionRef: React.MutableRefObject<'left' | 'right'>;
};

export type DrawPlayerCustomProps = {
  context: CanvasRenderingContext2D;
  img: HTMLImageElement;
  playerDirection: string;
  playerWidth: number;
  playerHeight: number;
};

export type Collision = {
  block: Rect;
  collisionDirection: string;
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>;
  playerHitBox: { width: number; height: number };
  velocity: { x: number; y: number };
  axis: 'x' | 'y';
};

export type PlayerHitBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface Animation {
  src: string;
  frameCount: number;
  frameDuration: number;
}

export type AnimationState = 'idle' | 'walk' | 'jump';

export interface UseAnimationStateReturn {
  getAnimationState: () => AnimationState;
  setAnimationState: (newState: AnimationState) => void;
}

export interface SpriteAnimationState {
  name: string;
  frame: number;
  animations: Record<string, LoadedAnimation>;
}

export interface LoadedAnimation {
  img: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
}

export type UseImageDrawingProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  objectPosition: XY;
  scale: number;
  imgSrc: string;
};
