import { useEffect, useRef } from 'react';
import { BackgroundProps } from '../constants/types/types';


const canvasHeight = 32 * 9;
const canvasWidth = 32 * 16;

const Background: React.FC<BackgroundProps> = ({ imageSrc, position }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context && canvasRef.current) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        console.log('image loaded!');
        context.drawImage(img, position.x, position.y);
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
