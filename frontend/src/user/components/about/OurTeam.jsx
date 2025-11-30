import baristasImg from '../../../assets/baristas.png';

export default function OurTeam() {
  const teamMembers = [
    {
      id: 1,
      name: 'Stephany',
      role: 'Head Barista',
      image: baristasImg,
      alt: 'Stephany',
    },
    {
      id: 2,
      name: 'Gabriel',
      role: 'Coffee Roaster',
      image: baristasImg,
      alt: 'Gabriel',
    },
    {
      id: 3,
      name: 'Christian',
      role: 'Pastry Chef',
      image: baristasImg,
      alt: 'Christian',
    },
    {
      id: 4,
      name: 'Gervy',
      role: 'Barista',
      image: baristasImg,
      alt: 'Gervy',
    },
  ];

  return (
    <section className="bg-neutral-50 py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl xl:max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
          <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-[#967259] uppercase">
            Meet Our Team
          </span>
          <h2 className="font-outfit mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#30442B]">
            The Faces Behind Your Coffee
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 lg:p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 sm:mb-5 lg:mb-6 aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-neutral-100">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="font-outfit mb-1.5 sm:mb-2 text-center text-lg sm:text-xl font-semibold text-[#30442B]">
                {member.name}
              </h3>
              <p className="text-center text-sm sm:text-base leading-relaxed text-neutral-600">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
