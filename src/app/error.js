"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TbAlertTriangle, TbRefresh, TbHome } from "react-icons/tb";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[80vh] place-items-center px-4">
      <div className="max-w-lg text-center">
        <div className="hazard-stripe mx-auto mb-6 h-3 w-40 rounded-full" />
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-warning/15 text-5xl text-warning">
          <TbAlertTriangle />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold md:text-4xl">Something broke down on site</h1>
        <p className="mt-3 text-base-content/65">
          An unexpected error happened while loading this page. Our crew has been notified – try again or head back home.
        </p>
        {error?.digest && <p className="mt-2 font-mono text-xs text-base-content/40">Ref: {error.digest}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => reset()} className="btn btn-primary btn-rig">
            <TbRefresh /> Try again
          </button>
          <Link href="/" className="btn btn-outline btn-pill">
            <TbHome /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
