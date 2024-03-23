import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

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
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-center min-h-screen items-start font-body">
        <div className="w-full md:w-1/4 flex flex-col items-center md:items-start space-y-4 mt-4 md:mt-0 md:pl-4">
          <h1 className="text-2xl font-bold">Frogue</h1>
          <div className="text-xs text-stone-400 hover:underline tracking-tighter text-center">
            <a
              href="https://github.com/OnchainGame/demo-non-field-rpg"
              target="_blank"
            >
              See code on Github
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
