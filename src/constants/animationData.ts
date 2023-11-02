import { Animation } from "./types/types";
import idle from '../assets/characters/Knight_2/player_idle.png'

export const animations: Record<string, Animation> = {
  idle: {
    src: idle,
    frameCount: 5,
  },
};
