import journeyImg from '../assets/journeyimage.png';

export default function OurStory() {
  return (
    <section className="relative -mt-12 overflow-hidden py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="flex min-h-[600px] flex-col gap-12 lg:flex-row">
          {/* Image Side */}
          <div className="group relative h-[400px] flex-1 lg:h-auto">
            <div className="absolute inset-0 rotate-3 transform rounded-3xl bg-[#30442B] transition-transform duration-300 group-hover:rotate-6"></div>
            <img
              src={journeyImg}
              alt="Fresh baked goods"
              className="relative z-10 h-full w-full rounded-3xl object-cover shadow-2xl transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
            />
          </div>
          {/* Content Side */}
          <div className="flex flex-1 items-center p-8 lg:p-12">
            <div className="mx-auto max-w-xl transform transition-all duration-500 hover:translate-y-[-5px]">
              <span className="inline-block border-b-2 border-[#967259]/20 pb-2 text-sm font-semibold tracking-[0.3em] text-[#967259] uppercase">
                Our Journey
              </span>
              <h2 className="font-outfit mt-6 bg-linear-to-r from-[#30442B] via-[#967259] to-[#30442B] bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
                A Story of Passion & Quality
              </h2>
              <div className="mt-8 space-y-6 text-neutral-600">
                <p className="w-full text-lg leading-loose hyphens-auto backdrop-blur-sm">
                  Coffee St. began with a simple mission: to serve exceptional
                  coffee in a welcoming environment. What started as a small
                  coffee cart in Manila has grown into a beloved destination for
                  coffee enthusiasts and casual drinkers alike.
                </p>
                <p className="w-full text-lg leading-loose hyphens-auto backdrop-blur-sm">
                  Our dedication to quality extends beyond the cup. We work
                  directly with farmers, ensuring fair practices and sustainable
                  relationships that benefit everyone in the coffee supply chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
