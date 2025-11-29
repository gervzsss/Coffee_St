import { Header, Footer } from '../components/layout';
import { AboutHero, OurStory, OurValues, OurTeam } from '../components/about';

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
