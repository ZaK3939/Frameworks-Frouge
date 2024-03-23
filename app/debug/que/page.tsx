import Image from "next/image";

export default async function Page() {
  return (
    <div
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/background-images/05_que.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
      className={`relative flex flex-col items-start text-center w-[376px] h-[196px] p-2 overflow-auto`}
    >
      <Image className="mb-4" src="/gif/frog-spin.gif" alt="Frog Spinning" width={100} height={100} />
    </div>
  );
}
