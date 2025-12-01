import { Header, Footer } from '../components/layout';
import {
  ContactHero,
  ContactInfoCard,
  StoreHoursCard,
  ContactForm,
} from '../components/contact';

export default function Contact() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        <ContactHero />

        <section className="relative -mt-8 sm:-mt-10 lg:-mt-12 pb-16 sm:pb-20 lg:pb-24">
          <div className="mx-auto flex max-w-6xl xl:max-w-7xl flex-col gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-10 lg:flex-row">
            <div className="lg:w-[320px] xl:w-[360px] 2xl:w-[400px] space-y-4 sm:space-y-5 lg:space-y-6">
              <ContactInfoCard />
              <StoreHoursCard />
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
