import HeroBanner from "@/components/home/HeroBanner";
import { serverGet } from "@/lib/server-api";

export default async function HomePage() {
  const stats = await serverGet("/stats", {});
  return (
    <>
      <HeroBanner stats={stats} />
    </>
  );
}
