import Hero from "./sections/Hero";

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#1c1140,#07070c_35%)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07070c]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="#home" className="text-lg font-extrabold tracking-wide text-white">
            Lito Eclevia
          </a>
          <ul className="flex flex-wrap items-center gap-6 text-sm font-semibold text-indigo-200/80">
            <li>
              <a href="#about" className="transition hover:text-cyan-300">
                About
              </a>
            </li>
            <li>
              <a href="#projects" className="transition hover:text-cyan-300">
                Projects
              </a>
            </li>
            <li>
              <a href="#contact" className="transition hover:text-cyan-300">
                Contact
              </a>
            </li>
          </ul>
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-[0_0_18px_rgba(255,47,155,0.45)] transition hover:brightness-110"
          >
            Contact
          </a>
        </nav>
      </header>

      <main id="home" className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6">
        <Hero />

        <section id="about" className="scroll-mt-24 pt-20">
          <h2 className="mb-3 text-2xl font-bold text-white">About</h2>
          <p className="max-w-2xl text-indigo-200/75">
            Replace this copy with your bio, education, and focus areas. Section IDs match the nav
            links for smooth scrolling.
          </p>
        </section>

        <section id="projects" className="scroll-mt-24 pt-16">
          <h2 className="mb-3 text-2xl font-bold text-white">Projects</h2>
          <p className="mb-6 max-w-2xl text-indigo-200/75">
            Drop in project cards or your 3D showcase here. Images live under{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">LitoEclevia/assets</code> —
            import or reference from <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">public/</code>{" "}
            when ready.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {["Project one", "Project two", "Project three"].map((title) => (
              <li
                key={title}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm text-indigo-100/90"
              >
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-indigo-200/65">Description coming soon.</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="scroll-mt-24 pt-16">
          <h2 className="mb-3 text-2xl font-bold text-white">Contact</h2>
          <p className="mb-6 max-w-2xl text-indigo-200/75">
            Primary CTA for recruiters — hook up EmailJS or your preferred form in a follow-up step.
          </p>
          <a
            href="mailto:you@example.com"
            className="inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(255,47,155,0.45)]"
          >
            Email me
          </a>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-indigo-300/50">
        Lito Eclevia · Portfolio scaffold
      </footer>
    </div>
  );
}
