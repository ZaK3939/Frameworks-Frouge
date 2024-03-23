import React from "react";

export const GameCardBoss = ({
}) => {
  return (
    <div tw="flex flex-col items-center bg-[#2A1D51] rounded-md text-white w-[110px] h-[120px] border border-white text-xs text-center">
      <p tw="flex items-center justify-center h-6 m-0">King Frog</p>
      <div tw="w-full flex justify-center">
        <img
          src={`${process.env.NEXT_PUBLIC_URL}/card-images/105_king_frog.png`}
          width={121}
          height={60}
          alt={`Boss`}
        />
      </div>
        <div tw="px-1 flex items-left w-full">
          <span>Can you beat me?</span>
        </div>
    </div>
  );
};
