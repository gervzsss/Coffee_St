import { Header, Footer } from "../components/layout";
import { AnimatedPage } from "../components/common";
import { AboutHero, OurStory, OurValues, OurTeam } from "../components/about";

export default function About() {
  return (
    <>
      <Header />
      <AnimatedPage className="min-h-screen pt-20">
        <AboutHero />
        <OurStory />
        <OurValues />
        <OurTeam />
      </AnimatedPage>
      <Footer />
    </>
  );
}
