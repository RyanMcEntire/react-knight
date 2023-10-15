export type ValidKeys = 'ArrowRight' | 'KeyD' | 'ArrowLeft' | 'KeyA' | 'Space';
export type KeyCallback = (key: ValidKeys, isPressed: boolean) => void;

export interface BackgroundProps {
  imageSrc: string;
  position: {
    x: number;
    y: number;
  };
}