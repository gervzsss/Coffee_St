import aboutHeadImg from '../../assets/aboutus_head.png';

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

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-6 py-24 text-white sm:px-10">
        <div>
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-amber-200 uppercase">
            Our Story
          </span>
          <h1 className="font-outfit mt-6 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
            Crafting Moments, <br />
            One Cup at a Time
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
            Since 2015, we've been dedicated to sourcing the finest coffee beans
            and creating unforgettable experiences for our community.
          </p>
        </div>
      </div>
    </section>
  );
}
