import { useEffect, useRef } from 'react';
import {
  ValidKeys,
  KeyCallback,
  KeysPressedState,
} from '../constants/types/types';

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

export const useKeyManager = (
  onKeyChange?: KeyCallback,
  onKeysChanged?: (keys: KeysPressedState) => void
): KeysPressedState => {
  const keysPressedRef = useRef<KeysPressedState>(initialKeysState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isKeyValid(e.code)) {
        keysPressedRef.current[e.code] = true;
        onKeyChange?.(e.code, true);
        onKeysChanged?.(keysPressedRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isKeyValid(e.code)) {
        keysPressedRef.current[e.code] = false;
        onKeyChange?.(e.code, false);
        onKeysChanged?.(keysPressedRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyChange, onKeysChanged]);
  return keysPressedRef.current;
};
