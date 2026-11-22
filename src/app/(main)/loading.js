import { LogoMark } from "@/components/shared/Logo";

export default function MainLoading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <LogoMark className="h-12 w-12 animate-bounce" />
        <span className="loading loading-dots loading-md text-primary" />
      </div>
    </div>
  );
}
