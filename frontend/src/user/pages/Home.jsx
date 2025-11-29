import { Header, Footer } from '../components/layout';
import { HeroSection, FeaturedProducts } from '../components/home';
import { SplitScreen } from '../components/common';
import { BenefitsGrid } from '../components/about';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <HeroSection />
        <FeaturedProducts />
        <SplitScreen />
        <BenefitsGrid />
      </main>
      <Footer />
    </>
  );
}
