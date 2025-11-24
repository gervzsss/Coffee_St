import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import SplitScreen from '../components/SplitScreen';
import BenefitsGrid from '../components/BenefitsGrid';

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
