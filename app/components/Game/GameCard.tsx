import React from "react";

export interface GameCardProps {
  title: string;
  imageUrl: string;
  attributes: string[];
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  imageUrl,
  attributes,
}) => {
  return (
    <div tw="flex flex-col items-center bg-[#CC8207] rounded-md text-white w-[110px] h-[120px] border border-white text-xs text-center">
      <p tw="flex items-center justify-center h-6 m-0">{title}</p>
      <div tw="bg-[#B86900] w-full flex justify-center">
        <img
          src={`${process.env.NEXT_PUBLIC_URL}/card-images/${imageUrl}`}
          width={40}
          height={40}
          alt={`Game Item ${title}`}
        />
      </div>
      {attributes.map((attr, index) => (
        <div tw="px-1 flex items-left w-full">
          <span key={index}>{attr}</span>
        </div>
      ))}
    </div>
  );
};
