import { useEffect, useState } from "react";
import { UseImageDrawingProps } from "../constants/types/types";

export const useImageDrawing = ({
  canvasRef,
  objectPosition,
  scale,
  imgSrc,
}: UseImageDrawingProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      setImage(img);
      setIsImageLoaded(true);
    };
  }, [imgSrc]);

  const draw = () => {
    const context = canvasRef.current?.getContext('2d');
    if (context && image) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(
        image,
        objectPosition.x,
        objectPosition.y,
        image.width * scale,
        image.height * scale
      );
      context.imageSmoothingEnabled = false
    }
  };

  return { draw, isImageLoaded };
};
