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
        {/* Hero Section */}
        <ContactHero />

        {/* Contact Form and Info Section */}
        <section className="relative -mt-12 pb-24">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-10 lg:flex-row">
            {/* Left Sidebar - Info Cards */}
            <div className="lg:w-[360px] space-y-6">
              <ContactInfoCard />
              <StoreHoursCard />
            </div>

            {/* Right Side - Contact Form */}
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
