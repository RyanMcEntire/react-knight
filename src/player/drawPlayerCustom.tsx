import { DrawPlayerCustomProps } from "../constants/types/types";

export const drawPlayerCustom = ({
  context,
  img,
  playerDirection,
  playerWidth,
  playerHeight,
}: DrawPlayerCustomProps) => {
  context.save();
  if (playerDirection === 'left') {
    context.scale(-1, 1);
    context.drawImage(img, -playerWidth, 0, playerWidth, playerHeight);
  } else {
    context.drawImage(img, 0, 0, playerWidth, playerHeight);
  }
  context.restore();
};
