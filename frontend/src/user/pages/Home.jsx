import { Header, Footer } from "../components/layout";
import { HeroSection, FeaturedProducts, SplitScreen } from "../components/home";
import { BenefitsGrid } from "../components/about";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <HeroSection />
        <FeaturedProducts />
        <SplitScreen />
        <BenefitsGrid />
      </main>
      <Footer />
    </>
  );
}
