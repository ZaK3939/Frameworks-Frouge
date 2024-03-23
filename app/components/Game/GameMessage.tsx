import React from 'react';

interface GameCardProps {
  message: string;
}

export const GameMessage: React.FC<GameCardProps> = ({ message }) => {
  return (
    <div tw="bg-[#1E0C3B] rounded-md text-white w-[173px] h-[58px] border border-white text-xs p-2 text-left font-bold">
      {message}
    </div>
  );
};
