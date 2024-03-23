import React from "react";

export interface GameCardProps {
  title: string;
  imageUrl: string;
  attributes: string[];
  category: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  imageUrl,
  attributes,
  category,
}) => {
  // Determine background and border colors based on the category
  let backgroundColor, borderColor;
  switch (category) {
    case "enemy":
      backgroundColor = "#7D0202";
      borderColor = "#FF0000";
      break;
    case "equipment":
      backgroundColor = "#CC8207";
      borderColor = "#B86900";
      break;
    case "item":
      backgroundColor = "#031159";
      borderColor = "#001D85";
      break;
    default:
      backgroundColor = "#CC8207";
      borderColor = "#B86900";
  }

  return (
    <div
      tw="flex flex-col items-center rounded-md text-white w-[110px] h-[120px] text-xs text-center"
      style={{
        backgroundColor: backgroundColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <p tw="flex items-center justify-center h-6 m-0">{title}</p>
      <div tw="w-full flex justify-center" style={{ backgroundColor: borderColor }}>
        <img
          src={`${process.env.NEXT_PUBLIC_URL}/card-images/${imageUrl}`}
          width={40}
          height={40}
          alt={`Game Item ${title}`}
        />
      </div>
      {attributes.map((attr, index) => (
        <div tw="px-1 flex items-left w-full" key={index}>
          <span>{attr}</span>
        </div>
      ))}
    </div>
  );
};
