import Link from "next/link";
import { TbArrowLeft, TbSearch } from "react-icons/tb";
import Logo from "@/components/shared/Logo";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="relative max-w-xl text-center">
        <Logo className="mb-10" />
        <p className="font-display text-[8rem] font-extrabold leading-none md:text-[11rem]">
          4<span className="text-primary">0</span>4
        </p>
        <div className="hazard-stripe mx-auto -mt-2 h-3 w-56 rounded-full" />
        <h1 className="mt-8 text-3xl font-extrabold">This road is closed for construction</h1>
        <p className="mt-3 text-base-content/65">The page you&apos;re looking for doesn&apos;t exist, was moved, or the equipment was removed.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary btn-rig">
            <TbArrowLeft /> Back to home
          </Link>
          <Link href="/equipment" className="btn btn-outline btn-pill">
            <TbSearch /> Browse equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
