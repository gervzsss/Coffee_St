export default function ContactInfoCard() {
  return (
    <div className="lg:w-[360px] space-y-6 text-sm text-neutral-600">
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-[#30442B]/10 ring-1 ring-[#30442B]/10">
        <h2 className="font-outfit text-2xl font-semibold text-[#30442B]">We'd love to hear from you</h2>
        <p className="mt-4 leading-relaxed">
          Share feedback, inquire about catering, or collaborate on events. Our baristas will reach out within one
          business day with a thoughtful response.
        </p>
        <hr className="mt-6 border-dashed border-[#30442B]/20" />
        <p className="mt-6 text-sm text-neutral-500">
          Looking for career opportunities? Email <span className="font-medium text-[#30442B]">careers@coffeest.com</span>
          {' '}with your résumé.
        </p>
      </div>
    </div>
  );
}
