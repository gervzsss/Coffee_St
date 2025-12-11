import { Link } from "react-router-dom";
import homeHeadImg from "../../../assets/home_head.webp";

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px]">
      {/* Hero Background overlay */}
      <div className="absolute inset-0 z-10 bg-black/40"></div>
      <div className="absolute inset-0">
        <img src={homeHeadImg} alt="Coffee Shop" className="h-full w-full object-cover" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 md:ml-8 md:px-0 lg:ml-16 xl:ml-24 xl:max-w-3xl 2xl:ml-32 2xl:max-w-4xl">
          <div className="text-left">
            <span className="font-poppins mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs tracking-wide text-white uppercase backdrop-blur-sm sm:mb-6 sm:px-6 sm:py-2.5 sm:text-sm">
              Welcome to Coffee St.
            </span>
            <h1 className="font-playfair mb-4 text-3xl leading-tight font-bold tracking-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:mb-8 lg:text-6xl xl:text-7xl 2xl:text-8xl">
              Experience the
              <br />
              <span className="text-[#d4b78f]">Art of Coffee</span>
            </h1>
            <p className="font-poppins mb-6 max-w-md text-sm leading-relaxed tracking-wide text-white/90 sm:mb-8 sm:max-w-lg sm:text-base md:text-lg lg:mb-10 lg:max-w-xl lg:text-xl">
              Discover our carefully curated selection of premium coffee beans and artisanal brews, crafted just for you.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:gap-5">
              <Link
                to="/products"
                className="font-poppins inline-flex transform items-center justify-center rounded-full bg-[#30442B] px-6 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#3a533a] sm:px-8 sm:py-4 sm:text-base lg:px-10 lg:py-5 lg:text-lg"
              >
                View Menu
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="font-poppins inline-flex transform items-center justify-center rounded-full border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 sm:px-8 sm:py-4 sm:text-base lg:px-10 lg:py-5 lg:text-lg"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
