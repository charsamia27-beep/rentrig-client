import HeroBanner from "@/components/home/HeroBanner";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { serverGet } from "@/lib/server-api";

export default async function HomePage() {
  const [stats, featured, categories] = await Promise.all([
    serverGet("/stats", {}),
    serverGet("/equipment/featured", []),
    serverGet("/equipment/categories", []),
  ]);

  return (
    <>
      <HeroBanner stats={stats} />
      <FeaturedEquipment items={featured} />
      <CategoriesSection stats={categories} />
      <WhyChooseUs />
    </>
  );
}
