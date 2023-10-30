import { useMemo, useState } from 'react';
import { UseCanvasDrawingProps } from '../constants/types/types';

export const useCanvasDrawing = ({
  canvasRef,
  objectPosition,
  scale,
  imgSrc,
  customDraw,
}: UseCanvasDrawingProps) => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const img = useMemo(() => {
    const image = new Image();
    image.onload = () => setImageLoaded(true);
    image.src = imgSrc;
    return image;
  }, [imgSrc]);

  return {
    draw: () => {
      const context = canvasRef.current?.getContext('2d');
      if (context && canvasRef.current && isImageLoaded) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        context.save();

        context.translate(objectPosition.x, objectPosition.y);
        context.scale(scale, scale);
        context.imageSmoothingEnabled = false;

        if (img.complete) {
          if (customDraw) {
            customDraw(context, img);
          } else {
            context.drawImage(img, 0, 0);
          }
        }
        context.restore();
      }
    },
    isImageLoaded,
  };
};
