import { Animation } from './types/types';
import idle from '../assets/characters/Knight_2/player_idle.png';
import run from '../assets/characters/Knight_2/player_run.png';
import jump from '../assets/characters/Knight_2/player_jump.png';

export const animations: Record<string, Animation> = {
  idle: {
    src: idle,
    frameCount: 5,
    frameDuration: 150,
  },
  run: {
    src: run,
    frameCount: 8,
    frameDuration: 150,
  },
  jump: {
    src: jump,
    frameCount: 7,
    frameDuration: 220,
  },
};
