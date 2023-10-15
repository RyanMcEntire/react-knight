import { useRef } from 'react';
import {
  canvasHeight,
  playerHeight,
  baseGravity,
  megaGravity,
  jumpVelocity,
} from '../constants/gameData';

export const usePlayerPhysics = (keysPressed) => {
  const velocityRef = useRef(0);
};
