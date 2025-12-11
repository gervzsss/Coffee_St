import baristasImg from "../../../assets/baristas.png";

export default function OurTeam() {
  const teamMembers = [
    {
      id: 1,
      name: "Stephany",
      role: "Head Barista",
      image: baristasImg,
      alt: "Stephany",
    },
    {
      id: 2,
      name: "Gabriel",
      role: "Coffee Roaster",
      image: baristasImg,
      alt: "Gabriel",
    },
    {
      id: 3,
      name: "Christian",
      role: "Pastry Chef",
      image: baristasImg,
      alt: "Christian",
    },
    {
      id: 4,
      name: "Gervy",
      role: "Barista",
      image: baristasImg,
      alt: "Gervy",
    },
  ];

  return (
    <section className="bg-neutral-50 py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 xl:max-w-[1400px]">
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#967259] uppercase sm:text-sm">Meet Our Team</span>
          <h2 className="font-outfit mt-3 text-2xl font-semibold text-[#30442B] sm:mt-4 sm:text-3xl lg:text-4xl">The Faces Behind Your Coffee</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 xl:grid-cols-4 xl:gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl sm:p-5 lg:p-6">
              <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-neutral-100 sm:mb-5 sm:rounded-xl lg:mb-6">
                <img src={member.image} alt={member.alt} className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-105" />
              </div>
              <h3 className="font-outfit mb-1.5 text-center text-lg font-semibold text-[#30442B] sm:mb-2 sm:text-xl">{member.name}</h3>
              <p className="text-center text-sm leading-relaxed text-neutral-600 sm:text-base">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
