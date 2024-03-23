import { enemies, equipments, items } from "../data";

export function createGameCardData(
  type: "enemy" | "equipment" | "item",
  id: number,
): { title: string; imageUrl: string; attributes: string[] } {
  let cardData;
  let title: string;
  let imageUrl: string;
  let attributes: string[] = [];

  switch (type) {
    case "enemy":
      cardData = enemies[id];
      title = `${cardData.name}`;
      imageUrl = `${id}_${cardData.name}.png`;
      attributes.push(
        `🗡️${cardData.attack} 🛡️${cardData.defence} 💰${cardData.gold}`,
      );
      break;
    case "equipment":
      cardData = equipments[id];
      title = `${cardData.name}`;
      imageUrl = `${id}_${cardData.name}.png`;
      attributes.push(
        `🗡️${cardData.attack} 🛡️${cardData.defence} 💰${cardData.gold}`,
      );
      if (cardData.isWeapon) attributes.push("Weapon");
      else attributes.push("Armor");
      break;
    case "item":
      cardData = items[id];
      title = `${cardData.name}`;
      imageUrl = `${id}_${cardData.name}.png`;
      attributes.push(`❤️${cardData.recovery} 💰${cardData.gold}`);
      break;
  }

  return { title, imageUrl, attributes };
}
