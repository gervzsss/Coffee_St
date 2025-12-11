import sustainabilityImg from "../../../assets/sustainability.png";
import bakedDailyImg from "../../../assets/bakeddaily.png";
import farmerCoffeeBeanImg from "../../../assets/farmercoffeebean.png";
import coffeeBeansImg from "../../../assets/coffeebeans.png";

export default function OurValues() {
  const values = [
    {
      id: 1,
      title: "Sustainability",
      description: "We're committed to eco-friendly practices and reducing our environmental impact through responsible sourcing and packaging.",
      image: sustainabilityImg,
      alt: "Sustainability",
    },
    {
      id: 2,
      title: "Fresh Quality",
      description: "We bake fresh daily and source only the highest quality ingredients to ensure every bite and sip exceeds expectations.",
      image: bakedDailyImg,
      alt: "Fresh Quality",
    },
    {
      id: 3,
      title: "Ethical Sourcing",
      description: "We partner directly with farmers, ensuring fair practices and sustainable relationships throughout our supply chain.",
      image: farmerCoffeeBeanImg,
      alt: "Ethical Sourcing",
    },
    {
      id: 4,
      title: "Premium Beans",
      description: "We carefully select and roast the finest coffee beans to create rich, complex flavors in every cup.",
      image: coffeeBeansImg,
      alt: "Premium Beans",
    },
  ];

  return (
    <section className="my-6 py-12 sm:my-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 xl:max-w-[1400px]">
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <h1 className="font-outfit text-xl font-semibold text-[#30442B] sm:text-2xl lg:text-3xl xl:text-4xl">Our Core Values</h1>
          <h2 className="font-outfit mx-auto mt-3 max-w-2xl text-base text-neutral-600 sm:mt-4 sm:text-lg lg:text-xl xl:text-2xl">Discover the principles that guide our coffee journey</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 xl:grid-cols-4 xl:gap-8">
          {values.map((value) => (
            <div
              key={value.id}
              className="flex min-h-[380px] flex-col rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-h-[420px] sm:rounded-2xl lg:min-h-[480px] xl:min-h-[500px]"
            >
              <div className="flex flex-1 items-center justify-center p-4 sm:p-5 lg:p-6">
                <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl">
                  <img src={value.image} alt={value.alt} className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-105" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-start rounded-b-xl bg-[#30442B] p-4 sm:rounded-b-2xl sm:p-5 lg:p-6">
                <h3 className="font-outfit mb-1.5 text-lg font-semibold text-white sm:mb-2 sm:text-xl">{value.title}</h3>
                <p className="text-sm leading-relaxed text-white/90 sm:text-base">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
