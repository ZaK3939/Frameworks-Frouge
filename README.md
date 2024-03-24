![ogp](https://github.com/libdefi/Frameworks-Frouge/assets/8872443/b4d76673-141e-4590-984c-0238e13f0e90)

# Frogue - Fully onchain rogue game

## Summary
Frogue is Farcaster's first fully onchain rogue RPG game to be played on farcaster frames. Can you defeat the boss?

## Feature

- Our game stands out as a fully functional on-chain game, harnessing the power of blockchain technology. Every aspect of gameplay, including battles and logic, is processed on-chain. This means that players' current data is always available on the blockchain, eliminating the need for traditional backend infrastructure like AWS.
- Moreover, for those who are interested in customization, our Stage Factory contract allows the creation of new stages with unique enemies, items, and equipment, offering endless possibilities for personalization and expansion.
- We're also committed to sustainable game development. A portion of the gas fees can be redirected either back to the players or to charitable organizations, creating a more community-focused and socially responsible gaming experience. This innovative approach not only enhances gameplay but also contributes positively to the broader community, setting a new standard for the future of game development.


## Architecture
![Cursor_と_Excalidraw](https://github.com/libdefi/Frameworks-Frouge/assets/8872443/b7cecb5a-2806-4337-ae89-1e2747d15138)


**[User Flow] Very simple!!**

1. Start Game (or Go to Leader Board)
2. Choose your selection
3. Proceed through stages
4. Encounter the final battle with the boss
5. Mint your winner NFT

If you experience a game over, you have the option to revive by paying a gas fee.


## Tech stack

### **◎Base & onchainkit**

Our game is, as the saying goes, Fully onchain game. We use no off-chain at all. It's just full onchain, but with lower gas prices and faster transaction speeds. We were able to achieve this experience because we were able to deploy our contracts on Base.

### **◎Neynar**

Our Farcaster frame didn’t built without Naynar. We were able to create a more serious game than the traditional casual Farcaster frames, such as executing transactions on the frames and changing the destination by pressing buttons.

Their tools are essential to develop the game once we have identified ourselves on Warpcast, such as getting the fid and the wallet address that is connected to the fid.

### **◎XMTP** 

Our product is fully compliant with the Open Frames Standard. We have successfully made our Frame interoperable with the standard, ensuring compatibility with a broader range of applications and protocols.

### **◎Privy** 

In our game, an embedded wallet from Privy is created for each player. As you progress through various stages, every action you choose results in an NFT being dropped into this wallet. These NFTs are unique in that they not only record the number of actions you've taken, but they also play a crucial role in the gameplay. They can be used as equipment or to enhance your player's abilities in subsequent stages. This integration of NFTs brings a new level of interactivity and personalization to the gaming experience, as your collection of NFTs directly reflects your choices and achievements in the game.

### **◎Pinata** 

We were able to utilise Pinata to get a granular view of user actions with Frames Analytics. This allowed us to visualise at which stage they left/were defeated and how many times they made it to the Boss stage.

By using Pinata, a decentralized storage solution, the game can effectively track each player's progress and status. This approach allows for a more dynamic understanding of the game's difficulty level and the players' success rates. By analyzing the data stored on Pinata, developers can gain insights into how players are interacting with the game, identify challenging areas, and make adjustments to enhance the gaming experience. This method not only provides a detailed view of the player's journey but also aids in refining the game design to better suit the players' skills and preferences.

The Leader Board we implemented also utilises the Frames Analytics api to display the number of user actions on the Farcaster frames.

<img width="578" alt="Screenshot 2024-03-24 at 15 36 39" src="https://github.com/libdefi/Frameworks-Frouge/assets/8872443/bcbc4258-f0f9-40f8-8fab-56d38c20bcf2">



**◎Airstack** 

By utilising Airstack, it was possible to visualise the number of NFT holders who had cleared games issued on Base and how many games they had cleared themselves via fid.

<img width="547" alt="Screenshot 2024-03-24 at 15 39 57" src="https://github.com/libdefi/Frameworks-Frouge/assets/8872443/5e7f290d-cf15-4e6e-b723-b7dc86ffe45d">



**◎Open AI**

All the backgrounds and game characters for our games were created by OpenAI. We would like to thank them for their great technology.



## Future Work
- Consider game design (more courses, more difficult games)
- Improve UX using AA etc. (because it is frustrating on smartphones if all transactions are made from Wallet)
- Collaboration with NFT IPs (e.g. Nouns DAO)
- Include social elements (e.g. design the game to be more fun as the number of participants increases)

## Deployed contract

**Base**

| contract | contract address |
| --- | --- |
| Game Stage | https://basescan.org/address/0xb7bF3a3a5a80A62680da65c545f74A47A2CB373E |
| NFT | https://basescan.org/address/0x250ABA37496C5dFb2AE3D75176f98c9cbB0394E3 |

**Optimism Testnet**

| contract | contract address |
| --- | --- |
| Privy Collection | https://sepolia-optimism.etherscan.io/address/0x10c968CA46Cea35b94D752f5654219B5254cDE4a |

## Others
Play here: [https://warpcast.com/zak3939/0x610d2a4b](https://warpcast.com/zak3939/0x610d2a4b)
Hosting site: [https://frameworks-frogue.vercel.app/](https://frameworks-frogue.vercel.app/)
Reference:
Our game idea was sparked by a great casual game. We would like to thank all the great game makers.
https://twitter.com/GameTsukuruKun/status/1682324411687505920?s=20
