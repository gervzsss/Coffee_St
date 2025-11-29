import contactHeaderImg from '../../../assets/contact_header.webp';

export default function ContactHero() {
  return (
    <section className="relative isolate pt-24">
      <div className="absolute inset-0">
        <img
          src={contactHeaderImg}
          alt="Barista pouring coffee"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#1a2319]/80 mix-blend-multiply"></div>
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-6 py-24 text-white sm:px-10 lg:flex-row lg:items-end">
        <div className="lg:flex-1">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
            Drop us a line
          </span>
          <h1 className="mt-6 font-outfit text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Let's Brew a Conversation
          </h1>
          <p className="mt-6 max-w-xl text-white/80 text-base sm:text-lg">
            Have a question, a custom order, or just want to say hello? We're
            always here to chat over a warm cup of coffee.
          </p>
        </div>
        <div className="lg:w-[280px]">
          <div className="rounded-3xl bg-white/10 p-6 shadow-lg shadow-black/25 ring-1 ring-white/20 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200">
              visit us
            </p>
            <p className="mt-3 font-outfit text-lg text-white">
              123 Coffee Street, Manila
            </p>
            <div className="mt-6 space-y-4 text-sm text-white/80">
              <p className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#30442B]">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25c0 7.15 9.75 13.5 9.75 13.5s9.75-6.35 9.75-13.5C21.75 4.977 18.773 2.25 15 2.25S8.25 4.977 8.25 8.25c0 3.273 2.977 6 6.75 6s6.75-2.727 6.75-6"
                    />
                  </svg>
                </span>
                <span>Daily • 7AM – 8PM</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#30442B]">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75l8.954 5.372a1.5 1.5 0 001.592 0L21.75 6.75M4.5 19.5h15a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z"
                    />
                  </svg>
                </span>
                <span>hello@coffeest.com</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#30442B]">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 4.5l4.5-1.125a1.5 1.5 0 011.824 1.09l.692 2.768a1.5 1.5 0 01-.824 1.707L6.75 9.75a11.048 11.048 0 006 6l.81-1.692a1.5 1.5 0 011.707-.824l2.768.692a1.5 1.5 0 011.09 1.824L17.25 21.75a1.5 1.5 0 01-1.707 1.09C7.174 21.474 2.526 16.826 1.16 8.457A1.5 1.5 0 012.25 6.75l0-2.25z"
                    />
                  </svg>
                </span>
                <span>(+63) 900 000 0000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
