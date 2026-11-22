import { LogoMark } from "@/components/shared/Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-base-100">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <LogoMark className="h-16 w-16 animate-bounce" />
        </div>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-base-300">
          <div className="hazard-stripe h-full w-1/2 animate-[loadbar_1.1s_ease-in-out_infinite] rounded-full" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-base-content/60">Loading the right rig…</p>
      </div>
      <style>{`@keyframes loadbar{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </div>
  );
}
