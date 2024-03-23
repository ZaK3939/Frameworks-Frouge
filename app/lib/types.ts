import { Hex } from "viem";

export type Action = {
  enemyId: number;
  equipmentId: number;
  itemId: number;
  random: number;
};

export type Player = {
  playerId: bigint;
  hp: bigint;
  floor: bigint;
  gold: bigint;
  weapon: bigint;
  shield: bigint;
  attack: bigint;
  defense: bigint;
  active: boolean;
};
