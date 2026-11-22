import HeroBanner from "@/components/home/HeroBanner";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import ReviewsSection from "@/components/home/ReviewsSection";
import TrustedOwners from "@/components/home/TrustedOwners";
import CTASection from "@/components/home/CTASection";
import { serverGet } from "@/lib/server-api";

export default async function HomePage() {
  const [stats, featured, categories, recent, popular, reviews, owners] = await Promise.all([
    serverGet("/stats", {}),
    serverGet("/equipment/featured", []),
    serverGet("/equipment/categories", []),
    serverGet("/equipment/recent", []),
    serverGet("/equipment/popular", []),
    serverGet("/reviews?limit=8", []),
    serverGet("/owners/top", []),
  ]);

  return (
    <>
      <HeroBanner stats={stats} />
      <FeaturedEquipment items={featured} />
      <CategoriesSection stats={categories} />
      <WhyChooseUs />
      <HowItWorks />
      <RecentlyAdded recent={recent} popular={popular} />
      <ReviewsSection reviews={reviews} />
      <TrustedOwners owners={owners} />
      <CTASection />
    </>
  );
}
