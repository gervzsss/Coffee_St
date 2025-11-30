import aboutHeadImg from '../../../assets/aboutus_head.webp';

export default function AboutHero() {
  return (
    <section className="relative isolate pt-24">
      <div className="absolute inset-0">
        <img
          src={aboutHeadImg}
          alt="Coffee roasting process"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#1a2319]/75 mix-blend-multiply"></div>

      <div className="relative z-10 mx-auto flex max-w-5xl xl:max-w-6xl flex-col gap-8 sm:gap-10 px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24 text-white">
        <div>
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold tracking-[0.35em] text-amber-200 uppercase">
            Our Story
          </span>
          <h1 className="font-outfit mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight font-semibold">
            Crafting Moments, <br className="hidden sm:block" />
            One Cup at a Time
          </h1>
          <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg text-white/80">
            Since 2015, we've been dedicated to sourcing the finest coffee beans
            and creating unforgettable experiences for our community.
          </p>
        </div>
      </div>
    </section>
  );
}
