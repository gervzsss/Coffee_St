import { Header, Footer } from "../components/layout";
import { AboutHero, OurStory, OurValues, OurTeam } from "../components/about";

export default function About() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <AboutHero />
        <OurStory />
        <OurValues />
        <OurTeam />
      </main>
      <Footer />
    </>
  );
}
