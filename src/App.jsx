import Hero from "./sections/Hero";

function PageWrapper({ title, children }) {
  return (
    <section className="pt-6">
      <h2 className="mb-3 text-2xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}


function AboutPage() {
  return (
    <PageWrapper title="About">
      <p className="mb-4 max-w-4xl text-indigo-200/75">
        I am a Software Development graduate with a strong foundation in programming, system design,
        and modern web technologies. My journey into technology has been shaped by both formal
        education and hands-on project development, where I have built interactive applications using
        JavaScript, Python, and C++. I focus on writing clean, maintainable code while continuously
        improving my understanding of data structures, algorithms, and software engineering
        principles.
      </p>
      <p className="max-w-4xl text-indigo-200/75">
        Beyond technical skills, I bring years of real-world experience working in a fast-paced
        environment where problem-solving, teamwork, and attention to detail are essential. I
        approach development with a practical mindset, building solutions that are not only
        functional, but also reliable and user-focused. I am currently seeking opportunities where I
        can grow as a software engineer while contributing to meaningful and impactful projects.
      </p>
    </PageWrapper>
  );
}

function ProjectsPage() {
  return (
    <PageWrapper title="Projects">
      <p className="mb-4 max-w-4xl text-indigo-200/75">
        My projects reflect a combination of technical learning and real-world application. Each
        project is designed to explore different aspects of software development, including
        interactive design, performance optimization, and scalable architecture. I focus on building
        applications that are structured, maintainable, and aligned with real-world use cases rather
        than simple demonstrations.
      </p>
      <p className="mb-8 max-w-4xl text-indigo-200/75">
        From 3D simulations to data-driven web platforms, my work highlights my ability to translate
        concepts into functional systems. These projects continue to evolve as I refine my skills and
        apply best practices in software development.
      </p>

      <div className="grid gap-4">
        <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm text-indigo-100/90">
          <h3 className="text-base font-semibold text-white">Project 1 - 3D Developer Portfolio</h3>
          <p className="mt-2 text-indigo-200/70">
            This project is a modern, interactive 3D developer portfolio built using React, Vite,
            React Three Fiber, and Tailwind CSS. It features a responsive single-page layout with
            smooth navigation and a real-time 3D hero section designed to create an engaging first
            impression.
          </p>
          <p className="mt-2 text-indigo-200/70">
            The application is structured using modular components for scalability and maintainability,
            allowing for continuous updates as new projects are developed. This project demonstrates my
            ability to integrate advanced front-end technologies while balancing performance,
            usability, and visual design.
          </p>
        </article>

        <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm text-indigo-100/90">
          <h3 className="text-base font-semibold text-white">Project 2 - Self-Driving Car Simulation</h3>
          <p className="mt-2 text-indigo-200/70">
            This project is an interactive simulation that models basic autonomous driving behavior
            using JavaScript. It demonstrates how a system can perceive its environment, make
            decisions, and respond dynamically in real time.
          </p>
          <p className="mt-2 text-indigo-200/70">
            The application incorporates structured logic for movement, obstacle handling, and
            environmental interaction. Through this project, I explored concepts related to simulation
            design, state-based logic, and real-time system behavior, strengthening my understanding
            of how intelligent systems operate.
          </p>
        </article>

        <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm text-indigo-100/90">
          <h3 className="text-base font-semibold text-white">Project 3 - Student Portfolio Platform</h3>
          <p className="mt-2 text-indigo-200/70">
            This project is a data-driven web application built to showcase academic achievements,
            events, and media content in a structured and user-friendly format. Developed using HTML,
            CSS, and JavaScript, it emphasizes clean layout design and scalable architecture.
          </p>
          <p className="mt-2 text-indigo-200/70">
            The platform uses structured data files to dynamically render media content, allowing for
            easy updates without modifying core page structure. This project highlights my ability to
            build maintainable front-end systems while addressing real-world requirements such as
            performance, usability, and long-term content management.
          </p>
        </article>
      </div>
    </PageWrapper>
  );
}

function ContactPage() {
  return (
    <PageWrapper title="Contact">
      <p className="mb-4 max-w-4xl text-indigo-200/75">
        I am always open to connecting with professionals, recruiters, and fellow developers. Whether
        it is an opportunity, collaboration, or a conversation about technology, I welcome the chance
        to connect.
      </p>
      <p className="mb-6 max-w-4xl text-indigo-200/75">
        Feel free to reach out via email or LinkedIn.
      </p>
      <div className="flex flex-col gap-2 text-indigo-100/90">
        <a className="hover:text-cyan-300" href="mailto:leclevia@my365.bellevue.edu">
          Email: leclevia@my365.bellevue.edu
        </a>
        <a
          className="hover:text-cyan-300"
          href="https://www.linkedin.com/in/loreto-eclevia-3422872b"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn: https://www.linkedin.com/in/loreto-eclevia-3422872b
        </a>
      </div>
    </PageWrapper>
  );
}

export default function App() {
  const base = import.meta.env.BASE_URL;
  const page = document.body.dataset.page ?? "home";

  const navItems = [
    { label: "Home", href: `${base}index.html` },
    { label: "About", href: `${base}about.html` },
    { label: "Work", href: `${base}projects.html` },
    { label: "Contact", href: `${base}contact.html` },
  ];

  const pageContent = {
    home: <Hero base={base} navItems={navItems} />,
    about: <AboutPage />,
    projects: <ProjectsPage />,
    contact: <ContactPage />,
  };

  const current = pageContent[page] ?? pageContent.home;
  const pageBackgrounds = {
    about: `linear-gradient(rgba(5, 8, 20, 0.7), rgba(5, 8, 20, 0.74)), url("${base}backgrounds/about-bg.jpg")`,
    projects: `linear-gradient(rgba(7, 8, 20, 0.72), rgba(7, 8, 20, 0.76)), url("${base}backgrounds/projects-bg.png")`,
    contact: `linear-gradient(rgba(6, 8, 20, 0.74), rgba(6, 8, 20, 0.78)), url("${base}backgrounds/contact-bg.png")`,
  };
  /** Home: solid shell only — planet/mountains live once on `Hero` (avoids fixed-bg + rounded clip “double mountain”). */
  const shellStyle =
    page === "home"
      ? { backgroundColor: "#030412", minHeight: "100vh" }
      : {
          backgroundImage: pageBackgrounds[page] ?? pageBackgrounds.about,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        };

  return (
    <div className="min-h-screen" style={shellStyle}>
      {page !== "home" ? (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07070c]/85 backdrop-blur-md">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <a href={`${base}index.html`} className="text-lg font-extrabold tracking-wide text-white">
              Lito
            </a>
            <ul className="flex flex-wrap items-center gap-6 text-sm font-semibold text-indigo-200/80">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition hover:text-cyan-300">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={`${base}contact.html`}
              className="rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-[0_0_18px_rgba(255,47,155,0.45)] transition hover:brightness-110"
            >
              Contact
            </a>
          </nav>
        </header>
      ) : null}

      <main
        className={
          page === "home" ? "w-full px-0 pb-20 pt-0" : "mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6"
        }
      >
        {current}
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-indigo-300/50">
        Lito Eclevia · Portfolio scaffold
      </footer>
    </div>
  );
}
