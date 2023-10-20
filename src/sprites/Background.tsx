import { useEffect, useRef } from 'react';
import { BackgroundProps } from '../constants/types/types';
import { canvasHeight, canvasWidth } from '../constants/gameData';
import { scale } from '../constants/gameData';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';

const Background: React.FC<BackgroundProps> = ({ imageSrc, position }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { draw, isImageLoaded } = useCanvasDrawing(
    canvasRef,
    position,
    scale,
    imageSrc,
    { translateX: -224, translateY: -192 }
  );

  useEffect(() => {
    if (isImageLoaded) {
      draw();
    }
  }, [isImageLoaded, draw]);

  return (
    <>
      <canvas
        className="background pixelated"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </>
  );
};

export default Background;
