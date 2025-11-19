import baristasImg from '../assets/baristas.png';

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
    <section className="bg-neutral-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold tracking-[0.3em] text-[#967259] uppercase">
            Meet Our Team
          </span>
          <h2 className="font-outfit mt-4 text-3xl font-semibold text-[#30442B] sm:text-4xl">
            The Faces Behind Your Coffee
          </h2>
        </div>

        <div className="flex flex-col items-stretch justify-center gap-6 lg:flex-row lg:gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex-1 rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 aspect-square overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="font-outfit mb-2 text-center text-xl font-semibold text-[#30442B]">
                {member.name}
              </h3>
              <p className="text-center leading-relaxed text-neutral-600">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
