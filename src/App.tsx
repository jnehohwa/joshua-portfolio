import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.mjs'
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import Download from 'lucide-react/dist/esm/icons/download.mjs'
import Mail from 'lucide-react/dist/esm/icons/mail.mjs'
import Menu from 'lucide-react/dist/esm/icons/menu.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import './App.css'
import { AmbientBackdrop } from './components/AmbientBackdrop'
import {
  caseStudies,
  profile,
  projects,
  timeline,
  type CaseStudy,
  type Project,
  type ProjectLink,
} from './data/portfolio'

const caseStudyPathPattern = /^\/case-studies\/([^/]+)\/?$/
const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
}

const featuredProjects = [
  {
    image: '/case-studies/kucona/kucona-home-mural.jpg',
    imageAlt: 'KuCoNa Community Centre mural and public website project',
    project: projects[0],
  },
  {
    image: '/case-studies/kasiswap/main-marketplace-desktop.png',
    imageAlt: 'KasiSwap marketplace desktop interface',
    project: projects[1],
  },
]

const capabilities = [
  {
    title: 'Product engineering',
    body: 'React, TypeScript and practical interfaces built around real user workflows.',
  },
  {
    title: 'Full-stack delivery',
    body: 'Web products that connect frontends, data, authentication and deployment.',
  },
  {
    title: 'Systems and operations',
    body: 'Structured tools that replace scattered spreadsheets and manual processes.',
  },
  {
    title: 'Teaching and leadership',
    body: 'Clear technical communication through tutoring, workshops and team delivery.',
  },
]

function getCaseStudySlug(pathname: string) {
  return pathname.match(caseStudyPathPattern)?.[1] ?? null
}

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [isLoading, setIsLoading] = useState(true)
  const caseStudySlug = getCaseStudySlug(pathname)
  const activeCaseStudy = caseStudies.find((study) => study.slug === caseStudySlug)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setIsLoading(false), reducedMotion ? 120 : 760)
    const updatePathname = () => setPathname(window.location.pathname)

    window.addEventListener('popstate', updatePathname)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('popstate', updatePathname)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const url = new URL(event.currentTarget.href)
    if (url.origin !== window.location.origin) return
    event.preventDefault()
    if (url.pathname !== pathname) {
      window.history.pushState({}, '', url.pathname)
      setPathname(url.pathname)
    }
  }

  return (
    <div className="site-shell">
      <AmbientBackdrop />
      <AnimatePresence>
        {isLoading ? <IntroLoader key="intro-loader" /> : null}
      </AnimatePresence>
      <SiteHeader navigate={navigate} />
      <AnimatePresence mode="wait">
      <motion.main key={pathname} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.36, ease: 'easeInOut' }}>
        {caseStudySlug ? (
          activeCaseStudy ? (
            <CaseStudyPage caseStudy={activeCaseStudy} />
          ) : (
            <CaseStudyNotFound />
          )
        ) : pathname === '/work' ? (
          <WorkPage />
        ) : pathname === '/about' ? (
          <AboutPage />
        ) : pathname === '/experience' ? (
          <ExperiencePage />
        ) : (
          <HomePage />
        )}
      </motion.main>
      </AnimatePresence>
    </div>
  )
}

function IntroLoader() {
  return (
    <motion.div
      className="intro-loader"
      role="status"
      aria-label="Loading Joshua Nehohwa portfolio"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.42, ease: 'easeInOut' } }}
    >
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        JN
      </motion.span>
      <motion.i
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.62, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

function SiteHeader({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <a className="site-identity" href="/" onClick={(event) => { closeMenu(); navigate(event) }}>
        <span>{profile.name}</span>
        <small>Software developer</small>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/work" onClick={navigate}>Work</a>
        <a href="/about" onClick={navigate}>About</a>
        <a href="/experience" onClick={navigate}>Experience</a>
        <a className="nav-outline" href={profile.links.cv} target="_blank" rel="noreferrer">
          CV
        </a>
        <a className="nav-primary" href={profile.links.email}>Get in touch</a>
      </nav>

      <button
        className="menu-toggle"
        type="button"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            className="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <nav aria-label="Mobile navigation">
              <a href="/work" onClick={(event) => { closeMenu(); navigate(event) }}>Work</a>
              <a href="/about" onClick={(event) => { closeMenu(); navigate(event) }}>About</a>
              <a href="/experience" onClick={(event) => { closeMenu(); navigate(event) }}>Experience</a>
            </nav>
            <div className="mobile-actions">
              <a className="nav-primary" href={profile.links.email}>Get in touch</a>
              <a className="nav-outline" href={profile.links.cv} target="_blank" rel="noreferrer">CV</a>
            </div>
            <a className="mobile-email" href={profile.links.email}>nehohwajoshua@gmail.com</a>
            <p>Cape Town, South Africa</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Contact />
    </>
  )
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-intro">
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <span>{description}</span>
    </section>
  )
}

function WorkPage() {
  return (
    <>
      <PageIntro eyebrow="Work" title="Things I've built." description="Software projects, digital systems, and practical tools across community work and study." />
      <SelectedWork />
      <section className="content-section project-directory">
        <SectionTitle eyebrow="More projects" title="The work keeps growing." />
        {projects.slice(2).map((project) => (
          <a key={project.title} href={project.links.caseStudy ?? project.links.live ?? project.links.source ?? profile.links.github}>
            <span>{project.timeline}</span>
            <strong>{project.title}</strong>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        ))}
      </section>
      <Contact />
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About" title="Curious about how things work. Focused on making them work better." description="I'm Joshua Nehohwa, a software engineering student and developer based in Cape Town." />
      <section className="content-section about-story">
        <img src="/joshua-cape-town.jpg" alt="Joshua Nehohwa in Cape Town" />
        <div>
          <h2>Building with purpose</h2>
          <p>I study software engineering and learn best by building things people can actually use. My work spans web applications, data workflows, and the quieter operational details that help a system hold together after launch.</p>
          <p>At Nature's Valley Trust and KuCoNa, I worked across a public website, registration pathways, and staff-facing data processes. That experience made the connection between code and the people using it very real to me.</p>
          <h2>Learning out loud</h2>
          <p>I was selected to run an ITMTA1-B22 tutoring pilot at Eduvos from August to September 2026, and served as Vossie DevClub chair from July 2025 to July 2026. Those experiences sharpened how I explain technical ideas, listen to questions, and work with a team. I like making complex systems clearer, whether I'm writing code or helping someone understand it.</p>
          <p>I'm interested in full-stack engineering, security, cloud systems, and responsible uses of AI. I bring curiosity to unfamiliar problems and care about the practical details that make software dependable.</p>
        </div>
      </section>
      <Capabilities />
      <Contact />
    </>
  )
}

function ExperiencePage() {
  return (
    <>
      <PageIntro eyebrow="Experience" title="Learning by building and leading." description="A path through software engineering, community systems, tutoring, and hands-on project delivery." />
      <section className="content-section experience-section experience-detail">
        <div className="experience-list">
          {timeline.map((item) => (
            <article key={`${item.date}-${item.title}`}>
              <time>{item.date}</time>
              <div><h2>{item.title}</h2><p>{item.description}</p></div>
            </article>
          ))}
        </div>
      </section>
      <Contact />
    </>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <motion.h1
        variants={reveal}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.75, ease: 'easeOut', delay: 0.15 }}
      >
        Joshua <em>Nehohwa.</em>
      </motion.h1>

      <motion.dl
        className="hero-meta"
        variants={reveal}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.28 }}
      >
        <div><dt>Based</dt><dd>Cape Town, South Africa</dd></div>
        <div><dt>Focus</dt><dd>Full-stack products and systems</dd></div>
        <div><dt>Currently</dt><dd>Software engineering student</dd></div>
        <div><dt>Open for</dt><dd>Junior developer opportunities</dd></div>
      </motion.dl>

      <motion.figure
        className="hero-portrait"
        initial={{ opacity: 0, y: 54 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.22 }}
      >
        <img src="/joshua-cape-town.jpg" alt="Joshua Nehohwa with Table Mountain in the background" />
      </motion.figure>
    </section>
  )
}

function SelectedWork() {
  return (
    <section className="content-section work-section" id="work">
      <SectionTitle eyebrow="Selected work" title="A few things I’ve built." />

      <div className="featured-work-list">
        {featuredProjects.map((item, index) => (
          <FeaturedProject
            image={item.image}
            imageAlt={item.imageAlt}
            index={index}
            key={item.project.title}
            project={item.project}
          />
        ))}
      </div>

      <motion.div
        className="more-work"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55 }}
      >
        <span>Also building</span>
        <p>HackJam Innovation Platform · Innosimm ERP · LedgerLite</p>
        <a href={profile.links.github} target="_blank" rel="noreferrer">
          Explore GitHub <ArrowUpRight size={17} />
        </a>
      </motion.div>
    </section>
  )
}

function FeaturedProject({
  image,
  imageAlt,
  index,
  project,
}: {
  image: string
  imageAlt: string
  index: number
  project: Project
}) {
  const href = project.links.caseStudy ?? project.links.live ?? project.links.source ?? '#work'

  return (
    <motion.article
      className="featured-project"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
    >
      <a className="project-image" href={href} aria-label={`View ${project.title}`}>
        <img src={image} alt={imageAlt} loading={index === 0 ? 'eager' : 'lazy'} />
      </a>

      <div className="project-copy">
        <div className="project-line">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.timeline}</span>
        </div>
        <p className="project-type">{project.type}</p>
        <h3>{project.tileTitle ?? project.title}</h3>
        <p>{project.summary}</p>
        <ul aria-label={`${project.title} technologies`}>
          {project.stack.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
        </ul>
        <a className="text-link" href={href}>
          View project <ArrowUpRight size={17} />
        </a>
      </div>
    </motion.article>
  )
}

function Capabilities() {
  return (
    <section className="content-section capabilities-section" id="about">
      <SectionTitle eyebrow="What I do" title="Practical software, built around people." />

      <div className="capability-list">
        {capabilities.map((capability, index) => (
          <motion.article
            key={capability.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{capability.title}</h3>
            <p>{capability.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.65 }}
      >
        <p>Let’s work together</p>
        <a className="contact-email" href={profile.links.email}>
          nehohwajoshua<span>@</span>gmail.com
        </a>
      </motion.div>

      <footer>
        <span>Designed and built by Joshua Nehohwa</span>
        <span>Cape Town</span>
        <nav aria-label="Social links">
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.links.cv} target="_blank" rel="noreferrer">CV</a>
        </nav>
      </footer>
    </section>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      className="section-title"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.62, ease: 'easeOut' }}
    >
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </motion.div>
  )
}

function CaseStudyPage({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="case-page">
      <section className="case-hero">
        <div>
          <a className="back-link" href="/work">
            <ArrowLeft size={16} /> Back to work
          </a>
          <p className="case-kicker">{caseStudy.type}</p>
          <h1>{caseStudy.title}</h1>
          <p className="case-summary">{caseStudy.summary}</p>
          <dl className="case-facts">
            <div><dt>Role</dt><dd>{caseStudy.role}</dd></div>
            <div><dt>Timeline</dt><dd>{caseStudy.timeline}</dd></div>
            <div><dt>Status</dt><dd>{caseStudy.status}</dd></div>
          </dl>
          <div className="case-actions">
            {caseStudy.links.map((link) => <CaseStudyAction key={`${link.label}-${link.href}`} link={link} />)}
          </div>
        </div>

        {caseStudy.heroImage ? (
          <figure className="case-hero-media">
            <img src={caseStudy.heroImage.src} alt={caseStudy.heroImage.alt} />
            <figcaption>{caseStudy.heroImage.caption}</figcaption>
          </figure>
        ) : null}
      </section>

      <section className="case-content">
        <aside>
          <p>Stack</p>
          <ul>{caseStudy.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>
        <div className="case-sections">
          {caseStudy.sections.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
            </article>
          ))}
        </div>
      </section>

      {caseStudy.gallery ? (
        <section className="case-gallery">
          <SectionTitle eyebrow="Evidence" title="The work, not just the words." />
          <div>
            {caseStudy.gallery.map((image) => (
              <figure key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function CaseStudyAction({ link }: { link: ProjectLink }) {
  const isExternal = link.external ?? link.href.startsWith('http')
  return (
    <a href={link.href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
      {link.label}
      {link.label.toLowerCase().includes('cv') ? <Download size={16} /> : <ArrowUpRight size={16} />}
    </a>
  )
}

function CaseStudyNotFound() {
  return (
    <section className="not-found-section">
      <Mail size={28} />
      <h1>That project page is not available.</h1>
      <a className="text-link" href="/#work">Return to selected work <ArrowUpRight size={17} /></a>
    </section>
  )
}

export default App
