import { useEffect, useRef } from 'react';

export type ValidKeys = 'ArrowRight' | 'KeyD' | 'ArrowLeft' | 'KeyA' | 'Space';
type KeyCallback = (key: ValidKeys, isPressed: boolean) => void;

const initialKeysState: Record<ValidKeys, boolean> = {
  ArrowRight: false,
  KeyD: false,
  ArrowLeft: false,
  KeyA: false,
  Space: false,
};

function isKeyValid(code: string): code is ValidKeys {
  return ['ArrowRight', 'KeyD', 'ArrowLeft', 'KeyA', 'Space'].includes(code);
}

export const useKeyManager = (onKeyChange?: KeyCallback) => {
  const keysPressed = useRef(initialKeysState).current;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isKeyValid(e.code)) {
        keysPressed[e.code] = true;
        onKeyChange?.(e.code, true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isKeyValid(e.code)) {
        keysPressed[e.code] = false;
        onKeyChange?.(e.code, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed, onKeyChange]);

  return keysPressed;
};
