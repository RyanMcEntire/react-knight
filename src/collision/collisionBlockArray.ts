import { gameWidth, tileSize } from '../constants/gameData';
import collisionsLevel1 from '../constants/levelData/collisions-lvl-1';
import { parse2D } from '../utilities/parse2D';
import { Rect } from '../constants/types/types';

const levelData = collisionsLevel1;

const parsedCollision = parse2D(levelData, gameWidth);
const collisionArray: Rect[] = [];

parsedCollision.forEach((row, i) =>
  row.forEach((cell, j) => {
    if (cell === 11842) {
      collisionArray.push({
        x: j * tileSize,
        y: i * tileSize,
        width: tileSize,
        height: tileSize,
      });
    }
  })
);
console.log('collision array', collisionArray);
export default collisionArray;
