import journeyImg from '../../../assets/journeyimage.png';

export default function OurStory() {
  return (
    <section className="relative -mt-8 sm:-mt-10 lg:-mt-12 overflow-hidden py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex-col gap-8 sm:gap-10 lg:gap-12 lg:flex-row">
          {/* Image Side */}
          <div className="group relative h-[300px] sm:h-[350px] lg:h-auto flex-1">
            <div className="absolute inset-0 rotate-3 transform rounded-2xl sm:rounded-3xl bg-[#30442B] transition-transform duration-300 group-hover:rotate-6"></div>
            <img
              src={journeyImg}
              alt="Fresh baked goods"
              className="relative z-10 h-full w-full rounded-2xl sm:rounded-3xl object-cover shadow-2xl transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
            />
          </div>
          {/* Content Side */}
          <div className="flex flex-1 items-center p-4 sm:p-6 lg:p-12">
            <div className="mx-auto max-w-xl transform transition-all duration-500 hover:translate-y-[-5px]">
              <span className="inline-block border-b-2 border-[#967259]/20 pb-2 text-xs sm:text-sm font-semibold tracking-[0.3em] text-[#967259] uppercase">
                Our Journey
              </span>
              <h2 className="font-outfit mt-4 sm:mt-6 bg-linear-to-r from-[#30442B] via-[#967259] to-[#30442B] bg-clip-text text-2xl sm:text-3xl lg:text-4xl font-semibold text-transparent">
                A Story of Passion & Quality
              </h2>
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 text-neutral-600">
                <p className="w-full text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-loose hyphens-auto backdrop-blur-sm">
                  Coffee St. began with a simple mission: to serve exceptional
                  coffee in a welcoming environment. What started as a small
                  coffee cart in Manila has grown into a beloved destination for
                  coffee enthusiasts and casual drinkers alike.
                </p>
                <p className="w-full text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-loose hyphens-auto backdrop-blur-sm">
                  Our dedication to quality extends beyond the cup. We work
                  directly with farmers, ensuring fair practices and sustainable
                  relationships that benefit everyone in the coffee supply
                  chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
