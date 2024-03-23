import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: "Game Start",
      },
      { 
        label: "Leaderboard",
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
      images: [`${process.env.NEXT_PUBLIC_URL}/background-images/01_start.png`],
    },
    other: {
      ...frameMetadata,
      "fc:frame:image:aspect_ratio": "1.91:1",
    },
  };
}

export default async function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">Frogue</h1>
        <div className="text-xs text-stone-400 hover:underline tracking-tighter text-center">
          <a
            href="https://github.com/ZaK3939/Frameworks-Frouge"
            target="_blank"
          >
            See code on Github
          </a>
        </div>
      </div>
    </div>
  );
}
