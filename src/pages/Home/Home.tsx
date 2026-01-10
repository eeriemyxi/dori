import { Calendar } from "@/components/Calendar";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-bg pb-10">
      <div className="flex-1 flex w-full h-full flex-col justify-center text-text-primary items-center gap-2 select-none">
        <h1 className="text-accent font-medium text-5xl">Dori</h1>
        <p className="text-text-inverse rounded-full px-2 py-1 text-sm font-thin">
          Your daily journal
        </p>
      </div>
      <Calendar />
    </div>
  );
}
