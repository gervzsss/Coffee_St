import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import cafeLatteImg from '../../../assets/cafe_late.png';
import cheesecakeImg from '../../../assets/cheesecake.png';
import whiteMochaImg from '../../../assets/white_mocha.png';
import cinammonImg from '../../../assets/cinammon.png';

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: 'Caramel Latte',
      description: 'Rich espresso with steamed milk and caramel drizzle',
      image: cafeLatteImg,
    },
    {
      id: 2,
      name: 'Blueberry Delight',
      description: 'Fresh blueberry parfait with vanilla cream',
      image: cheesecakeImg,
    },
    {
      id: 3,
      name: 'Artisan Latte',
      description: 'Hand-crafted latte with signature leaf art design',
      image: whiteMochaImg,
    },
    {
      id: 4,
      name: 'Almond Chocolate Croissant',
      description: 'Buttery croissant filled with chocolate and almonds',
      image: cinammonImg,
    },
  ];

  return (
    <section className="bg-white pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-playfair mb-4 text-4xl font-bold text-[#30442B]">
            Featured Delights
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover our handcrafted signature drinks and delectable treats
          </p>
        </div>

        {/* Products Carousel */}
        <div className="featured-products-carousel relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            spaceBetween={32}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="overflow-visible"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="p-4">
                <div className="group flex h-[420px] flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="relative shrink-0 bg-[#30442B] pt-4 pb-8">
                    <div className="relative mx-auto h-48 w-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="flex grow flex-col border-t border-gray-100 bg-white p-6">
                    <h3 className="font-playfair mb-2 text-xl font-bold text-[#30442B]">
                      {product.name}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-gray-600">
                      {product.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 transform">
            <button className="swiper-button-prev flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#30442B] shadow-lg transition-all duration-300 hover:bg-[#30442B] hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
          </div>
          <div className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 transform">
            <button className="swiper-button-next flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#30442B] shadow-lg transition-all duration-300 hover:bg-[#30442B] hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
