import { useMemo, useState } from 'react';

export const useCanvasDrawing = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  objectPosition: { x: number; y: number },
  scale: number,
  imgSrc: string,
  transform?: { translateX: number; translateY: number }
) => {
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
        if (transform) {
          context.translate(transform.translateX, transform.translateY);
        }
        context.translate(objectPosition.x, objectPosition.y);
        context.transform(scale, 0, 0, scale, 0, 0);
        context.imageSmoothingEnabled = false;
        if (img.complete) {
          context.drawImage(img, 0, 0);
        }
        context.restore();
      }
    },
    isImageLoaded,
  };
};
