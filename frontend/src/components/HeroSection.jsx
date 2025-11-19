import { Link } from 'react-router-dom';
import homeHeadImg from '../assets/home_head.png';

export default function HeroSection() {
  return (
    <section className="relative h-screen">
      {/* Hero Background overlay */}
      <div className="absolute inset-0 z-10 bg-black/40"></div>
      <div className="absolute inset-0">
        <img
          src={homeHeadImg}
          alt="Coffee Shop"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto ml-4 max-w-2xl md:ml-12 lg:ml-24 xl:ml-32">
          <div className="text-left">
            <span className="font-poppins mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm tracking-wide text-white uppercase backdrop-blur-sm">
              Welcome to Coffee St.
            </span>
            <h1 className="font-playfair mb-8 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Experience the
              <br />
              <span className="text-[#d4b78f]">Art of Coffee</span>
            </h1>
            <p className="font-poppins mb-10 max-w-xl text-base leading-relaxed tracking-wide text-white/90 sm:text-lg md:text-xl">
              Discover our carefully curated selection of premium coffee beans
              and artisanal brews, crafted just for you.
            </p>
            <div className="flex flex-col gap-5 sm:flex-row">
              <Link
                to="/products"
                className="font-poppins inline-flex transform items-center rounded-full bg-[#30442B] px-8 py-4 text-base font-medium tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#3a533a]"
              >
                View Menu
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <Link
                to="/about"
                className="font-poppins inline-flex transform items-center rounded-full border-2 border-white/20 bg-white/10 px-8 py-4 text-base font-medium tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
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
