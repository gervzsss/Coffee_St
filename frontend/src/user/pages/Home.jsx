import { Header, Footer } from "../components/layout";
import { AnimatedPage } from "../components/common";
import { HeroSection, FeaturedProducts, SplitScreen } from "../components/home";
import { BenefitsGrid } from "../components/about";

export default function Home() {
  return (
    <>
      <Header />
      <AnimatedPage className="min-h-screen pt-20">
        <HeroSection />
        <FeaturedProducts />
        <SplitScreen />
        <BenefitsGrid />
      </AnimatedPage>
      <Footer />
    </>
  );
}
