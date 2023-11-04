import { animations } from '../constants/animationData';
import { LoadedAnimation } from '../constants/types/types';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function loadAnimationData(
  name: string
): Promise<LoadedAnimation | undefined> {
  const animation = animations[name];
  if (!animation) {
    throw new Error(`Animation "${name}" not found`);
  }

  try {
    const img = await loadImage(animation.src);
    return {
      img,
      frameWidth: img.width / animation.frameCount,
      frameHeight: img.height,
      frameCount: animation.frameCount,
    };
  } catch (error) {
    console.error(`Error loading image for animation "${name}":`, error);
  }
}

export async function loadAllAnimations(): Promise<
  Record<string, LoadedAnimation>
> {
  const loadedAnimations: Record<string, LoadedAnimation> = {};

  for (const name in animations) {
    const animationData = await loadAnimationData(name);
    if (animationData) {
      loadedAnimations[name] = animationData;
    } else {
      console.error(`Failed to load animation data for ${name}`);
    }
  }
  return loadedAnimations;
}

