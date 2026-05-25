import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Download,
  BriefcaseBusiness,
  GitBranch,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react'
import './App.css'
import {
  caseStudies,
  focusAreas,
  metrics,
  navItems,
  profile,
  projects,
  skills,
  timeline,
  type CaseStudy,
  type Project,
  type ProjectLink,
} from './data/portfolio'

const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const caseStudyPathPattern = /^\/case-studies\/([^/]+)\/?$/

function getCaseStudySlug(pathname: string) {
  return pathname.match(caseStudyPathPattern)?.[1] ?? null
}

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const caseStudySlug = getCaseStudySlug(pathname)
  const activeCaseStudy = caseStudies.find((study) => study.slug === caseStudySlug)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress =
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0

      setScrollProgress(Math.min(Math.max(progress, 0), 1))
    }

    updateScrollProgress()
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress)

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [])

  useEffect(() => {
    const updatePathname = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', updatePathname)

    return () => {
      window.removeEventListener('popstate', updatePathname)
    }
  }, [])

  useEffect(() => {
    if (caseStudySlug) {
      window.scrollTo(0, 0)
    }
  }, [caseStudySlug])

  return (
    <div className="site-shell">
      <Frame scrollProgress={scrollProgress} />
      <Header />

      <main>
        {caseStudySlug ? (
          activeCaseStudy ? (
            <CaseStudyPage caseStudy={activeCaseStudy} />
          ) : (
            <CaseStudyNotFound />
          )
        ) : (
          <HomePage />
        )}
      </main>
    </div>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <FocusSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  )
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand-mark" href="/" aria-label={`${profile.name} home`}>
        <span>{profile.initials}</span>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <a
          className="icon-link"
          href={profile.links.github}
          aria-label="GitHub profile"
          target="_blank"
          rel="noreferrer"
        >
          <GitBranch size={18} />
        </a>
        <a
          className="icon-link"
          href={profile.links.linkedin}
          aria-label="LinkedIn profile"
          target="_blank"
          rel="noreferrer"
        >
          <BriefcaseBusiness size={18} />
        </a>
      </div>
    </header>
  )
}

function Frame({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <div className="screen-frame" aria-hidden="true">
        <span className="corner corner-top-left" />
        <span className="corner corner-top-right" />
        <span className="corner corner-bottom-left" />
        <span className="corner corner-bottom-right" />
      </div>
      <div className="scroll-rail" aria-hidden="true">
        <span style={{ transform: `scaleY(${scrollProgress})` }} />
      </div>
    </>
  )
}

function Hero() {
  return (
    <section className="hero-section" id="top">
      <HeroScene />

      <div className="hero-content">
        <motion.div
          className="hero-copy"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="availability-pill">
            <CheckCircle2 size={15} />
            <span>{profile.availability}</span>
          </div>

          <p className="eyebrow">{profile.role}</p>
          <h1>{profile.headline}</h1>
          <p className="hero-summary">{profile.summary}</p>

          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="/#projects">
              <Code2 size={18} />
              View projects
            </a>
            <a className="button button-secondary" href={profile.links.email}>
              <Mail size={18} />
              Contact me
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-panel"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.65, delay: 0.16, ease: 'easeOut' }}
        >
          <div className="terminal-card">
            <div className="terminal-topbar">
              <span />
              <span />
              <span />
              <p>portfolio.tsx</p>
            </div>
            <div className="terminal-body">
              <p>
                <span className="muted">$</span> npm run build
              </p>
              <p>
                <span className="success">✓</span> 86% academic average
              </p>
              <p>
                <span className="success">✓</span> DevClub leadership
              </p>
              <p>
                <span className="success">✓</span> CV ready for download
              </p>
            </div>
          </div>

          <div className="metric-grid">
            {metrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <a className="scroll-cue" href="/#projects" aria-label="Jump to projects">
        <ArrowDown size={18} />
      </a>
    </section>
  )
}

function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <div className="scene-grid" />
      <div className="code-column code-column-left">
        {['const craft = "clean"', 'type Stack = React', 'git push origin main'].map(
          (line) => (
            <span key={line}>{line}</span>
          ),
        )}
      </div>
      <div className="code-column code-column-right">
        {['api.status = 200', 'tests: passing', 'deploy: ready'].map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
      <div className="signal-panel">
        <span>BUILD</span>
        <strong>PASSING</strong>
      </div>
    </div>
  )
}

function FocusSection() {
  return (
    <section className="section section-split" id="about">
      <motion.div
        className="section-heading"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55 }}
      >
        <p className="eyebrow">About</p>
        <h2>A junior developer with a production mindset.</h2>
      </motion.div>

      <div className="focus-grid">
        {focusAreas.map((area, index) => (
          <motion.article
            key={area.title}
            className="focus-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{area.title}</h3>
            <p>{area.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section className="section" id="projects">
      <div className="section-heading section-heading-wide">
        <p className="eyebrow">Selected work</p>
        <h2>Projects that show how I think, build, and polish.</h2>
      </div>

      <div className="project-list">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className="project-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55 }}
    >
      <div className="project-visual">
        <div className="preview-window">
          <div className="preview-bar">
            <span />
            <span />
            <span />
          </div>
          <div className={`preview-body preview-body-${index + 1}`}>
            <div className="preview-sidebar" />
            <div className="preview-content">
              <span className="preview-kicker">{project.type}</span>
              <strong>{project.title}</strong>
              <div className="preview-lines">
                <span />
                <span />
                <span />
              </div>
              <div className="preview-widgets">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="project-details">
        <span className="project-type">{project.type}</span>
        <h3>{project.title}</h3>
        <div className="project-meta" aria-label={`${project.title} role and timeline`}>
          <span>{project.role}</span>
          <span>{project.timeline}</span>
        </div>
        <p>{project.summary}</p>
        <p className="project-impact">{project.impact}</p>

        <ul className="project-highlights" aria-label={`${project.title} highlights`}>
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <ul className="tag-list" aria-label={`${project.title} stack`}>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="project-links">
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noreferrer">
              Live
              <ArrowUpRight size={16} />
            </a>
          )}
          {project.links.source && (
            <a href={project.links.source} target="_blank" rel="noreferrer">
              Source
              <ArrowUpRight size={16} />
            </a>
          )}
          {project.links.caseStudy && (
            <a href={project.links.caseStudy}>
              Case study
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

function CaseStudyPage({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="case-page">
      <section className="case-hero">
        <div className="case-hero-copy">
          <a className="back-link" href="/#projects">
            <ArrowLeft size={16} />
            Back to projects
          </a>
          <p className="eyebrow">{caseStudy.type}</p>
          <h1>{caseStudy.title}</h1>
          <p className="case-summary">{caseStudy.summary}</p>

          <dl className="case-facts">
            <div>
              <dt>Role</dt>
              <dd>{caseStudy.role}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>{caseStudy.timeline}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{caseStudy.status}</dd>
            </div>
          </dl>

          <div className="case-actions" aria-label={`${caseStudy.title} links`}>
            {caseStudy.links.map((link) => (
              <CaseStudyAction key={`${link.label}-${link.href}`} link={link} />
            ))}
          </div>
        </div>

        {caseStudy.heroImage && (
          <figure className="case-hero-media">
            <img src={caseStudy.heroImage.src} alt={caseStudy.heroImage.alt} />
            <figcaption>{caseStudy.heroImage.caption}</figcaption>
          </figure>
        )}
      </section>

      <section className="section case-metrics" aria-label={`${caseStudy.title} metrics`}>
        {caseStudy.metrics.map((metric) => (
          <article className="case-metric-card" key={`${metric.label}-${metric.value}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="section case-study-body">
        <div className="case-stack-panel">
          <p className="eyebrow">Stack</p>
          <ul className="tag-list" aria-label={`${caseStudy.title} stack`}>
            {caseStudy.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="case-section-list">
          {caseStudy.sections.map((section) => (
            <article className="case-section-card" key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      {caseStudy.gallery && (
        <section className="section case-gallery" aria-label={`${caseStudy.title} evidence`}>
          <div className="section-heading section-heading-wide">
            <p className="eyebrow">Evidence</p>
            <h2>Project proof a recruiter can scan quickly.</h2>
          </div>

          <div className="case-gallery-grid">
            {caseStudy.gallery.map((image) => (
              <figure key={image.src} className="case-gallery-item">
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function CaseStudyAction({ link }: { link: ProjectLink }) {
  const isExternal = link.external ?? link.href.startsWith('http')

  return (
    <a
      className="button button-secondary"
      href={link.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      {link.label}
      <ArrowUpRight size={16} />
    </a>
  )
}

function CaseStudyNotFound() {
  return (
    <section className="section not-found-section">
      <a className="back-link" href="/#projects">
        <ArrowLeft size={16} />
        Back to projects
      </a>
      <p className="eyebrow">Case study</p>
      <h1>That project page is not available.</h1>
      <p>
        The portfolio has moved to structured case-study pages. Head back to the
        selected work section and choose one of the current projects.
      </p>
    </section>
  )
}

function SkillsSection() {
  return (
    <section className="section skills-section" id="skills">
      <div className="section-heading">
        <p className="eyebrow">Skills</p>
        <h2>Practical tools, grouped by how they show up in real work.</h2>
      </div>

      <div className="skills-grid">
        {skills.map((skillGroup) => (
          <article className="skill-card" key={skillGroup.group}>
            <h3>{skillGroup.group}</h3>
            <ul>
              {skillGroup.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section className="section timeline-section" id="experience">
      <div className="section-heading">
        <p className="eyebrow">Experience</p>
        <h2>A focused timeline for growth, projects, and stronger delivery.</h2>
      </div>

      <div className="timeline">
        {timeline.map((item) => (
          <article className="timeline-item" key={`${item.date}-${item.title}`}>
            <span>{item.date}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-card">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Let’s turn the next project into something solid.</h2>
          <p>
            Send through the role, project, or problem you want to discuss. I’ll
            respond with clear next steps and the context I need.
          </p>
        </div>

        <div className="contact-actions">
          <a className="button button-primary" href={profile.links.email}>
            <Mail size={18} />
            Email me
          </a>
          <a
            className="button button-secondary"
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch size={18} />
            GitHub
          </a>
          <a className="button button-secondary" href={profile.links.cv}>
            <Download size={18} />
            CV
          </a>
        </div>

        <div className="contact-meta">
          <span>
            <MapPin size={15} />
            {profile.location}
          </span>
          <span>
            <ShieldCheck size={15} />
            AI, security, and cloud interests
          </span>
          <span>
            <Terminal size={15} />
            React, TypeScript, Python, PHP/MySQL
          </span>
          <span>
            <Sparkles size={15} />
            Product-minded project delivery
          </span>
        </div>
      </div>
    </section>
  )
}

export default App
