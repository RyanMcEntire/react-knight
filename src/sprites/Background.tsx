import { useEffect, useRef } from 'react';
import { BackgroundProps } from '../constants/types/types';
import { canvasHeight, canvasWidth } from '../constants/gameData';
import { scale } from '../constants/gameData';
import { useImageDrawing } from '../hooks/useImageDrawing';


const Background: React.FC<BackgroundProps> = ({ imageSrc, position }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { draw, isImageLoaded } = useImageDrawing(
    {canvasRef,
    objectPosition: position,
    scale,
    imgSrc: imageSrc}
  );
  
  useEffect(() => {
    if (isImageLoaded) {
      draw();
    }
  }, [isImageLoaded, draw]);

  return (
    <>
      <canvas
        className="background"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </>
  );
};

export default Background;
