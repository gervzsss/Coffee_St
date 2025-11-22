import { User } from 'lucide-react';

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
    <section className="bg-[#30442B] py-16 relative overflow-hidden">
      {/* Coffee texture pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Large Profile Icon */}
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border-4 border-white/30 shadow-2xl">
            <User className="w-16 h-16 text-white" strokeWidth={2} />
          </div>

          {/* Username */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {getUserName()}
          </h1>

          {/* Email */}
          <p className="text-lg text-white/90">
            {user?.email || 'user@example.com'}
          </p>
        </div>
      </div>
    </section>
  );
}
