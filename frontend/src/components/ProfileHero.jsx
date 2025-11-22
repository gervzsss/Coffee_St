import { User } from 'lucide-react';
import contactHeaderImg from '../assets/contact_header.png';

export default function ProfileHero({ user }) {
  const getUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.name) {
      return user.name;
    }
    return 'User';
  };

  return (
    <section className="relative isolate pt-24">
      <div className="absolute inset-0">
        <img
          src={contactHeaderImg}
          alt="Coffee background"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#1a2319]/80 mix-blend-multiply"></div>
      
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-white sm:px-10">
        {/* Profile Icon Badge */}
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur ring-2 ring-white/20 shadow-xl">
          <User className="h-12 w-12 text-white" strokeWidth={1.5} />
        </div>
        
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
            My Account
          </span>
          <h1 className="mt-6 font-outfit text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {getUserName()}
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            {user?.email || 'user@example.com'}
          </p>
        </div>
      </div>
    </section>
  );
}
