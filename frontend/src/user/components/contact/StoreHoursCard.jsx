export default function StoreHoursCard() {
  return (
    <div className="rounded-3xl bg-[#30442B] p-6 text-white shadow-xl shadow-[#30442B]/20 ring-1 ring-white/10">
      <h3 className="font-outfit text-xl font-semibold">Store Hours</h3>
      <ul className="mt-4 space-y-2 text-sm text-white/90">
        <li className="flex justify-between">
          <span>Monday – Friday</span>
          <span>7:00 AM – 8:00 PM</span>
        </li>
        <li className="flex justify-between">
          <span>Saturday</span>
          <span>8:00 AM – 9:00 PM</span>
        </li>
        <li className="flex justify-between">
          <span>Sunday</span>
          <span>8:00 AM – 7:00 PM</span>
        </li>
      </ul>
    </div>
  );
}
