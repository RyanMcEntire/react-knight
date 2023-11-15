import { hitboxOffset } from '../constants/gameData';
import { PlayerHitBox, UseCanvasDrawingProps } from '../constants/types/types';

export const useCanvasDrawing = ({
  canvasRef,
  objectPosition,
  scale,
  spriteAnimationRef,
  playerDirectionRef,
  getAnimationState,
}: UseCanvasDrawingProps & { getPlayerHitbox: () => PlayerHitBox }) => {
  const draw = () => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      const currentAnimationName = getAnimationState();
      const currentAnimation =
        spriteAnimationRef.current.animations[currentAnimationName];
      if (currentAnimation) {
        const currentFrame = spriteAnimationRef.current.frame;

        const centerX = objectPosition.x + currentAnimation.frameWidth * 0.5;
        const axisOfSymmetry =
          centerX - (hitboxOffset.left - hitboxOffset.right);

        if (playerDirectionRef.current === 'left') {
          context.save();
          context.scale(-1, 1);
          context.translate(-2 * axisOfSymmetry, 0);
        }

        context.drawImage(
          currentAnimation.img,
          currentFrame * currentAnimation.frameWidth,
          0,
          currentAnimation.frameWidth,
          currentAnimation.frameHeight,
          playerDirectionRef.current === 'left'
            ? axisOfSymmetry - currentAnimation.frameWidth * scale * 0.5
            : objectPosition.x,
          objectPosition.y,
          currentAnimation.frameWidth * scale,
          currentAnimation.frameHeight * scale
        );
        console.log('current animation', currentAnimationName);

        if (playerDirectionRef.current === 'left') {
          context.restore();
        }
        // drawHitbox(context, getPlayerHitbox());
        context.imageSmoothingEnabled = false;
      }
    }
  };

  return { draw };
};
