import { useEffect, useRef } from 'react';
import { BackgroundProps } from '../constants/types/types';
import { canvasHeight, canvasWidth } from '../constants/gameData';
import { scale } from '../constants/gameData';

const Background: React.FC<BackgroundProps> = ({ imageSrc, position }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context && canvasRef.current) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        context.save();
        context.translate(-200, -200);
        context.transform(scale, 0, 0, scale, 0, 0);
        context.imageSmoothingEnabled = false;
        context.drawImage(img, position.x, position.y);
        context.restore();
      };
      img.onerror = (errorEvent) => {
        console.error('Error loading the image:', errorEvent);
      };
    }
  }, [imageSrc, position]);
  return (
    <div>
      <canvas
        className="background pixelated"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  );
};

export default Background;
