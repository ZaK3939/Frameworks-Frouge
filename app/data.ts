type Enemy = {
  name: string;
  hp: number;
  attack: number;
  defence: number;
  gold: number;
};

type Equipment = {
  name: string;
  isWeapon: boolean;
  attack: number;
  defence: number;
  gold: number;
};

type Item = {
  name: string;
  recovery: number;
  gold: number;
};

export const enemies: Record<number, Enemy> = {
  101: { name: "slime", hp: 6, attack: 2, defence: 0, gold: 10 },
  102: { name: "rat", hp: 10, attack: 3, defence: 0, gold: 13 },
  103: { name: "green_slime", hp: 12, attack: 3, defence: 0, gold: 15 },
  104: { name: "red_vat", hp: 15, attack: 4, defence: 0, gold: 20 },
  105: { name: "king_frog", hp: 30, attack: 5, defence: 0, gold: 40 },
};

export const equipments: Record<number, Equipment> = {
  0: { name: "none", isWeapon: false, attack: 0, defence: 0, gold: 0 },
  1: { name: "stick", isWeapon: true, attack: 2, defence: 0, gold: 7 },
  2: { name: "sling_shot", isWeapon: true, attack: 7, defence: 0, gold: 25 },
  3: { name: "shield", isWeapon: false, attack: 0, defence: 1, gold: 8 },
};

export const items: Record<number, Item> = {
  1: { name: "apple", recovery: 5, gold: 5 },
  2: { name: "steak", recovery: 10, gold: 10 },
  3: { name: "restorative", recovery: 15, gold: 15 },
};

export function getCategoryMapping(category: number, number: number): number {
  const enemyMapping: Record<number, number> = {
    101: 1, // "slime"
    102: 2, // "rat"
    103: 3, // "green_slime"
    104: 4, // "red_vat"
    105: 5, // "king_frog"
  };

  const equipmentMapping: Record<number, number> = {
    1: 6, // "stick"
    2: 7, // "sling_shot"
    3: 8, // "shield"
  };

  const itemMapping: Record<number, number> = {
    1: 9, // "apple"
    2: 10, // "steak"
    3: 11, // "restorative"
  };

  switch (category) {
    case 1:
      return enemyMapping[number] ?? 0;
    case 2:
      return equipmentMapping[number] ?? 0;
    case 3:
      return itemMapping[number] ?? 0;
    default:
      return 0;
  }
}
