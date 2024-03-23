import React from "react";

interface GameStatusProps {
  floor: number;
  gold: number;
  hp: number;
  maxhp: number;
  weapon: number;
  shield: number;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  floor,
  gold,
  hp,
  maxhp,
  weapon,
  shield,
}) => {
  return (
    <div tw="bg-[#262528] rounded-md text-white w-[173px] h-[58px] border border-white text-xs p-2 text-left flex space-x-2 justify-between">
      <div tw="flex flex-col items-left">
        <div tw="flex">💳 {floor}F</div>
        <div tw="flex">💰 {gold}G</div>
        <div tw="flex">
          ❤️ {hp}/{maxhp}
        </div>
      </div>
      <div tw="flex flex-col items-left">
        <div tw="flex">🗡️{weapon}</div>
        <div tw="flex">🛡️{shield}</div>
      </div>
    </div>
  );
};
