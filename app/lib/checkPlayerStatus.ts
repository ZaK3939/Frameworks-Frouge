import { createPublicClient, http } from "viem";
import { Action, Player } from "./types";
import { FROUGE_STAGE_ADDRESS } from "../config";
import { base } from "viem/chains";

const viemClientForBase = createPublicClient({
  chain: base,
  transport: http(),
});

export const stageAbi = [
  {
    type: "function",
    name: "getAllNextAction",
    inputs: [
      {
        name: "playerId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gameClear",
    inputs: [
      {
        name: "playerId_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "gameAction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    type: "function",
    name: "gameAction",
    inputs: [
      { name: "playerId_", type: "uint256", internalType: "uint256" },
      { name: "option_", type: "uint8", internalType: "uint8" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "playerStageStatus",
    inputs: [{ name: "playerId_", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PlayerStageStatus",
        components: [
          { name: "playerId", type: "uint256", internalType: "uint256" },
          { name: "hp", type: "uint256", internalType: "uint256" },
          { name: "floor", type: "uint256", internalType: "uint256" },
          { name: "gold", type: "uint256", internalType: "uint256" },
          { name: "weapon", type: "uint256", internalType: "uint256" },
          { name: "shield", type: "uint256", internalType: "uint256" },
          { name: "attack", type: "uint256", internalType: "uint256" },
          { name: "defense", type: "uint256", internalType: "uint256" },
          { name: "active", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reviveUser",
    inputs: [{ name: "playerId_", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
];

export async function getAllNextAction(fid: number): Promise<Action> {
  const data = await viemClientForBase.readContract({
    address: FROUGE_STAGE_ADDRESS,
    abi: stageAbi,
    functionName: "getAllNextAction",
    args: [fid],
  });

  if (!Array.isArray(data) || data.some((item) => typeof item !== "bigint")) {
    throw new Error("Data is not in the expected format");
  }

  const action: Action = {
    enemyId: Number(data[0]),
    equipmentId: Number(data[1]),
    itemId: Number(data[2]),
    random: Number(data[3]),
  };
  console.log("action", action);
  return action;
}

// Player type definition
/**
 * Retrieves the stage status of a player from a smart contract.
 * @param {number} fid - The player's ID.
 * @returns {Promise<Player>} A promise that resolves to the player's stage status.
 */
export async function getPlayerStageStatus(fid: number): Promise<Player> {
  try {
    return (await viemClientForBase.readContract({
      address: FROUGE_STAGE_ADDRESS,
      abi: stageAbi,
      functionName: "playerStageStatus",
      args: [fid],
    })) as Player;
  } catch (error) {
    console.error(
      "Error in getPlayerStageStatus:",
      error || "Could not get player stage status",
    );
    throw error; // Rethrow the error for handling by the caller
  }
}

export async function gameClear(fid: number): Promise<boolean> {
  try {
    return (await viemClientForBase.readContract({
      address: FROUGE_STAGE_ADDRESS,
      abi: stageAbi,
      functionName: "gameClear",
      args: [fid],
    })) as boolean;
  } catch (error) {
    console.error(
      "Error in gameClear:",
      error || "Could not get game clear status",
    );
    throw error; // Rethrow the error for handling by the caller
  }
}
