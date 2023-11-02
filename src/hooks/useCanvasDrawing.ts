import { UseCanvasDrawingProps } from '../constants/types/types';

export const useCanvasDrawing = ({
  canvasRef,
  objectPosition,
  scale,
  spriteAnimationRef,
}: UseCanvasDrawingProps) => {
  
  const draw = () => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      // Clear the canvas
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      const currentAnimation =
        spriteAnimationRef.current.animations[spriteAnimationRef.current.name];
      if (currentAnimation) {
        const currentFrame = spriteAnimationRef.current.frame;

        // Draw the current frame
        context.drawImage(
          currentAnimation.img,
          currentFrame * currentAnimation.frameWidth,
          0,
          currentAnimation.frameWidth,
          currentAnimation.frameHeight,
          objectPosition.x,
          objectPosition.y,
          currentAnimation.frameWidth * scale,
          currentAnimation.frameHeight * scale
        );
      }
    }
  };

  return { draw };
};
