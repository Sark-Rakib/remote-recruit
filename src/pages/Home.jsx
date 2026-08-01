import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureBlocks from "../components/FeatureBlocks";
import CTA from "../components/CTA";
import FAQ from "../components/FAQ";
import Feature from "../components/Feature";
import PricingSection from "../components/PricingSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Feature />
      <FeatureBlocks />
      <CTA />
      <FAQ />
      <PricingSection />
    </div>
  );
}
