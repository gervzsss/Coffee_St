import { Link } from 'react-router-dom';

export default function BenefitsGrid() {
  const benefits = [
    {
      id: 1,
      title: 'Freshly Roasted Coffee',
      description:
        'Our beans are roasted in small batches daily to ensure peak flavor and aroma.',
      icon: (
        <svg
          className="mx-auto h-16 w-16 text-[#967259]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 8c0 1.657-1.343 3-3 3S6 9.657 6 8s1.343-3 3-3 3 1.343 3 3z"
          ></path>
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Handcrafted Pastries',
      description:
        'Each pastry is lovingly crafted by our expert bakers using traditional recipes.',
      icon: (
        <svg
          className="mx-auto h-16 w-16 text-[#967259]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12l2 2 4-4"
          ></path>
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Ethically Sourced',
      description:
        'We partner directly with farmers to ensure fair prices and sustainable practices.',
      icon: (
        <svg
          className="mx-auto h-16 w-16 text-[#967259]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          ></path>
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Baked Daily',
      description:
        'Fresh batches of pastries are baked throughout the day for maximum freshness.',
      icon: (
        <svg
          className="mx-auto h-16 w-16 text-[#967259]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Community Focus',
      description:
        "We're proud to be a gathering place for our local community since 2020.",
      icon: (
        <svg
          className="mx-auto h-16 w-16 text-[#967259]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 009.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      ),
    },
    {
      id: 6,
      title: 'Expert Baristas',
      description:
        'Our certified baristas are passionate about crafting the perfect cup for you.',
      icon: (
        <svg
          className="mx-auto h-16 w-16 text-[#967259]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#FDFBF6] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#30442B] md:text-4xl">
            Why Choose Our Coffee Shop?
          </h2>
          <Link
            to="/about#why-choose-us"
            className="group inline-flex items-center gap-2 text-[#30442B] transition-colors hover:text-[#967259]"
          >
            <span className="text-lg">Learn more about us</span>
            <svg
              className="h-5 w-5 transform transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="benefit-card transform rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="icon-container mb-4 text-center">
                {benefit.icon}
              </div>
              <h3 className="mb-2 text-center text-xl font-semibold text-[#30442B]">
                {benefit.title}
              </h3>
              <p className="text-center text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
