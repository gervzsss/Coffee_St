export default function ContactInfoCard() {
  return (
    <div className="space-y-4 text-xs text-neutral-600 sm:space-y-6 sm:text-sm">
      <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 shadow-[#30442B]/10 ring-[#30442B]/10 sm:rounded-3xl sm:p-5 lg:p-6">
        <h2 className="font-outfit text-xl font-semibold text-[#30442B] sm:text-2xl">We'd love to hear from you</h2>
        <p className="mt-3 leading-relaxed sm:mt-4">
          Share feedback, inquire about catering, or collaborate on events. Our baristas will reach out within one business day with a thoughtful response.
        </p>
        <hr className="mt-4 border-dashed border-[#30442B]/20 sm:mt-6" />
        <p className="mt-4 text-xs text-neutral-500 sm:mt-6 sm:text-sm">
          Looking for career opportunities? Email <span className="font-medium text-[#30442B]">careers@coffeest.com</span> with your résumé.
        </p>
      </div>
    </div>
  );
}
