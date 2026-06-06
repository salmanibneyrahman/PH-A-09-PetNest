import HeroBanner from "@/components/home/HeroBanner";
import SpeciesSection from "@/components/home/SpeciesSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedPets from "@/components/home/FeaturedPets";
import WhyAdoptSection from "@/components/home/WhyAdoptSection";
import SuccessStories from "@/components/home/SuccessStories";
import PetCareSection from "@/components/home/PetCareSection";
import GuardianshipSection from "@/components/home/GuardianshipSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export const metadata = {
  title: "PetNest - Find Your Perfect Furry Companion",
  description:
    "Browse thousands of pets available for adoption. Dogs, cats, birds, rabbits and more. Start your adoption journey today.",
};

export default function HomePage() {
  return (
    <div className="bg-black overflow-x-hidden min-h-screen">
      <HeroBanner />
      <SpeciesSection />
      <StatsSection />
      <FeaturedPets />
      <WhyAdoptSection />
      <GuardianshipSection />
      <SuccessStories />
      <PetCareSection />
      <NewsletterSection />
    </div>
  );
}
