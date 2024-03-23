import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";
import Image from "next/image";
export async function generateMetadata(): Promise<Metadata> {
  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: "Game Start",
      },
    ],
    image: `${process.env.NEXT_PUBLIC_URL}/background-images/01_start.png`, // Only image
    post_url: `${process.env.NEXT_PUBLIC_URL}/api/action`,
  });

  return {
    title: "Frogue",
    description: "Game Start:Frogue",
    openGraph: {
      title: "Frogue",
      description: "Frogue is first no field RPG game on Farcaster",
      images: [`${process.env.NEXT_PUBLIC_URL}/api/images/start`],
    },
    other: {
      ...frameMetadata,
      "fc:frame:image:aspect_ratio": "1.91:1",
    },
  };
}

export default async function Page() {
  return (
    <div
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/background-images/04_game_stage.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`relative flex flex-col items-start text-center w-[376px] h-[196px] p-2 overflow-auto`}
    >
      <div className="flex justify-between w-full mb-1">
        {/* Left up */}
        <div className="bg-purple-main rounded-md text-white w-[173px] h-[58px] border border-white text-xs p-2 text-left font-bold">
          Start the adventure! Choose one button.
        </div>
        {/* Right up */}
        <div className="bg-gray-main rounded-md text-white w-[173px] h-[58px] border border-white text-xs p-2 text-left flex space-x-2 justify-between">
          <div className="flex flex-col items-left">
            <div className="flex">💳 20</div>
            <div className="flex">💰 0</div>
            <div className="flex">❤️ 20/20</div>
          </div>
          <div className="flex flex-col items-left">
            <div className="flex">🗡️ Bare hands</div>
            <div className="flex">🛡️</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex flex-col items-center bg-orange-main rounded-md text-white w-[110px] h-[120px] border border-white text-xs text-center">
          <p className="flex items-center justify-center h-6 m-0">Stick</p>
          <div className="bg-orange-background w-full flex justify-center">
            <Image
              src="/card-images/02_stick.png"
              width={40}
              height={40}
              alt="Game Item stick"
            />
          </div>
          <div className="px-1 flex items-left w-full">
            <span>🗡️4s</span>
            <span>💰7</span>
          </div>
        </div>

        {/* Card B */}
        <div className="flex flex-col items-center bg-orange-main rounded-md text-white w-[110px] h-[120px] border border-white text-xs text-center">
          <p className="flex items-center justify-center h-6 m-0">Stick</p>
          <div className="bg-orange-background w-full flex justify-center">
            <Image
              src="/card-images/02_stick.png"
              width={40}
              height={40}
              alt="Game Item stick"
            />
          </div>
          <div className="flex items-left w-full px-1">
            <span>🗡️4</span>
            <span>💰7</span>
          </div>
          <div className="text-xs text-left flex w-full px-1">HP sucking</div>
          <div className="text-xs text-left flex w-full px-1">flying type</div>
        </div>
        {/* Card C */}
        <div className="flex flex-col items-center bg-orange-main rounded-md text-white w-[110px] h-[120px] border border-white text-xs text-center">
          <p className="flex items-center justify-center h-6 m-0">Stick</p>
          <div className="bg-orange-background w-full flex justify-center">
            <img
              src="/card-images/02_stick.png"
              width={40}
              height={40}
              alt="Game Item stick"
            />
          </div>
          <div className="flex items-left w-full px-1">
            <span>🗡️4</span>
            <span>💰7</span>
          </div>
          <div className="text-xs text-left flex w-full px-1">HP sucking</div>
          <div className="text-xs text-left flex w-full px-1">flying type</div>
        </div>
      </div>
    </div>
  );
}
