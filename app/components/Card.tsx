import { GameCard } from "./Game/GameCard";
import { GameStatus } from "./Game/GameStatus";
import { GameMessage } from "./Game/GameMessage";
import React from "react";
import { createGameCardData } from "../lib/createCardData";
import { equipments, items } from "../data";

export function Card({
  message,
  floor,
  gold,
  hp,
  maxhp,
  weapon,
  shield,
  enemyId,
  equipmentId,
  itemId,
}: {
  message: string;
  floor?: number;
  gold?: number;
  hp?: number;
  maxhp?: number;
  weapon?: string;
  shield?: string;
  enemyId?: number;
  equipmentId?: number;
  itemId?: number;
}) {
  const enemyCardData = enemyId ? createGameCardData("enemy", enemyId) : null;
  const equipmentCardData = equipmentId
    ? createGameCardData("equipment", equipmentId)
    : null;
  const itemCardData = itemId ? createGameCardData("item", itemId) : null;
  const weaponAttack = weapon
    ? equipments[Number(weapon)].attack.toString()
    : null;
  const shieldDefence = shield
    ? equipments[Number(shield)].defence.toString()
    : null;
  return (
    <div
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/background-images/04_game_stage.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      tw={`relative flex flex-col items-start text-center w-[376px] h-[196px] p-2 overflow-auto`}
    >
      <div tw="flex justify-between w-full mb-1">
        {/* Left up */}
        <GameMessage message={message} />
        {/* Right up */}
        <GameStatus
          floor={floor || 0}
          gold={gold || 0}
          hp={hp || 20}
          maxhp={maxhp || 20}
          weapon={weaponAttack || ""}
          shield={shieldDefence || ""}
        />
      </div>

      {/* Game cards */}
      <div tw="flex justify-between w-full">
        {enemyCardData && (
          <GameCard
            title={enemyCardData.title}
            imageUrl={enemyCardData.imageUrl}
            attributes={enemyCardData.attributes}
          />
        )}
        {equipmentCardData && (
          <GameCard
            title={equipmentCardData.title}
            imageUrl={equipmentCardData.imageUrl}
            attributes={equipmentCardData.attributes}
          />
        )}
        {itemCardData && (
          <GameCard
            title={itemCardData.title}
            imageUrl={itemCardData.imageUrl}
            attributes={itemCardData.attributes}
          />
        )}
      </div>
    </div>
  );
}
