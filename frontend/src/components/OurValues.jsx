import sustainabilityImg from '../assets/sustainability.png';
import bakedDailyImg from '../assets/bakeddaily.png';
import farmerCoffeeBeanImg from '../assets/farmercoffeebean.png';
import coffeeBeansImg from '../assets/coffeebeans.png';

export default function OurValues() {
  const values = [
    {
      id: 1,
      title: 'Sustainability',
      description:
        "We're committed to eco-friendly practices and reducing our environmental impact through responsible sourcing and packaging.",
      image: sustainabilityImg,
      alt: 'Sustainability',
    },
    {
      id: 2,
      title: 'Fresh Quality',
      description:
        'We bake fresh daily and source only the highest quality ingredients to ensure every bite and sip exceeds expectations.',
      image: bakedDailyImg,
      alt: 'Fresh Quality',
    },
    {
      id: 3,
      title: 'Ethical Sourcing',
      description:
        'We partner directly with farmers, ensuring fair practices and sustainable relationships throughout our supply chain.',
      image: farmerCoffeeBeanImg,
      alt: 'Ethical Sourcing',
    },
    {
      id: 4,
      title: 'Premium Beans',
      description:
        'We carefully select and roast the finest coffee beans to create rich, complex flavors in every cup.',
      image: coffeeBeansImg,
      alt: 'Premium Beans',
    },
  ];

  return (
    <section className="my-8 py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="mb-12 text-center">
          <h1 className="font-outfit text-2xl font-semibold text-[#30442B] sm:text-5xl lg:text-4xl">
            Our Core Values
          </h1>
          <h2 className="font-outfit mx-auto mt-4 max-w-2xl text-xl text-neutral-600 sm:text-2xl">
            Discover the principles that guide our coffee journey
          </h2>
        </div>

        <div className="flex flex-col items-stretch justify-center gap-6 lg:flex-row lg:gap-8">
          {values.map((value) => (
            <div
              key={value.id}
              className="flex min-h-[500px] flex-1 flex-col rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-1 items-center justify-center p-6">
                <div className="aspect-square overflow-hidden rounded-xl">
                  <img
                    src={value.image}
                    alt={value.alt}
                    className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-start rounded-b-2xl bg-[#30442B] p-6">
                <h3 className="font-outfit mb-2 text-xl font-semibold text-white">
                  {value.title}
                </h3>
                <p className="font-small leading-relaxed text-white/90">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
