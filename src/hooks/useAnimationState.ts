import { useRef } from 'react';
import {
  AnimationState,
  UseAnimationStateReturn,
} from '../constants/types/types';

export function useAnimationState(
  defaultState: AnimationState = 'idle'
): UseAnimationStateReturn {
  const animationStateRef = useRef<AnimationState>(defaultState);

  const getAnimationState = () => {
    return animationStateRef.current;
  };

  const setAnimationState = (newState: AnimationState) => {
    animationStateRef.current = newState;
  };

  return { getAnimationState, setAnimationState };
}

