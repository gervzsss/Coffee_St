import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutHero from '../components/AboutHero';
import OurStory from '../components/OurStory';
import OurValues from '../components/OurValues';
import OurTeam from '../components/OurTeam';

export default function About() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <AboutHero />
        <OurStory />
        <OurValues />
        <OurTeam />
      </main>
      <Footer />
    </>
  );
}
