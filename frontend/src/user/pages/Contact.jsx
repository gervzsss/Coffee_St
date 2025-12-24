import { Header, Footer } from "../components/layout";
import { AnimatedPage } from "../components/common";
import { ContactHero, ContactInfoCard, StoreHoursCard, ContactForm } from "../components/contact";

export default function Contact() {
  return (
    <>
      <Header />
      <AnimatedPage className="min-h-screen bg-gray-50 pt-20">
        <ContactHero />

        <section className="relative -mt-8 pb-16 sm:-mt-10 sm:pb-20 lg:-mt-12 lg:pb-24">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 lg:flex-row lg:gap-12 lg:px-10 xl:max-w-7xl">
            <div className="space-y-4 sm:space-y-5 lg:w-[320px] lg:space-y-6 xl:w-[360px] 2xl:w-[400px]">
              <ContactInfoCard />
              <StoreHoursCard />
            </div>
            <ContactForm />
          </div>
        </section>
      </AnimatedPage>
      <Footer />
    </>
  );
}
