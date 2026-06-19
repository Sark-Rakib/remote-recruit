import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureBlocks from "../components/FeatureBlocks";
import CTA from "../components/CTA";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import SignUpAdd from "../components/SignUpAdd";
import Feature from "../components/Feature";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Feature />
      <FeatureBlocks />
      <CTA />
      <SignUpAdd />
      <FAQ />
      <Footer />
    </div>
  );
}
