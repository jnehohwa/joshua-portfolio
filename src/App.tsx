import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Download,
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
  profile,
  projects,
  skills,
  timeline,
  type CaseStudy,
  type Project,
  type ProjectLink,
} from './data/portfolio'

const fadeUp = {
  hidden: { opacity: 0, y: 42, scale: 0.96, filter: 'blur(14px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
}

const caseStudyPathPattern = /^\/case-studies\/([^/]+)\/?$/
const heroLead =
  'Software engineering student building clean web products, cloud-aware tools, and AI-assisted workflows.'

type HeaderNavItem = {
  label: string
  href: string
  external?: boolean
}

type HoverFrame = {
  height: number
  left: number
  top: number
  width: number
}

type AmbientNodes = {
  filter: BiquadFilterNode
  lfo: OscillatorNode
  lfoGain: GainNode
  masterGain: GainNode
  oscillators: OscillatorNode[]
  sourceGain: GainNode
}

type PortfolioAudio = {
  isAudioEnabled: boolean
  playHoverSound: () => void
  toggleAudio: () => Promise<void>
}

const headerNavItems: HeaderNavItem[] = [
  { label: 'CV', href: profile.links.cv, external: true },
  { label: 'GitHub', href: profile.links.github, external: true },
  { label: 'LinkedIn', href: profile.links.linkedin, external: true },
  { label: 'Mail', href: profile.links.email },
]

const techMedallions = [
  { label: 'React', mark: 'Rx' },
  { label: 'TypeScript', mark: 'TS' },
  { label: 'Python', mark: 'Py' },
  { label: 'AWS', mark: 'AWS' },
  { label: 'Database', mark: 'DB' },
  { label: 'GitHub', mark: 'Git' },
  { label: 'Security', mark: 'Sec' },
  { label: 'AI', mark: 'AI' },
]

const audioWaveBars = Array.from({ length: 7 })
const bootCrystalCells = Array.from({ length: 12 })
const bootSignalBars = Array.from({ length: 4 })
const lofiTrack = {
  artist: 'OMF-Games',
  license: 'CC0',
  source: 'https://opengameart.org/content/lofi-hip-hop-loop',
  src: '/audio/lofi-hip-hop-loop.ogg',
  title: 'Lofi Hip Hop Loop',
}

function createAudioContext() {
  const audioWindow = window as Window &
    typeof globalThis & {
      webkitAudioContext?: typeof AudioContext
    }
  const AudioContextConstructor =
    audioWindow.AudioContext ?? audioWindow.webkitAudioContext

  return AudioContextConstructor ? new AudioContextConstructor() : null
}

function usePortfolioAudio(): PortfolioAudio {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const ambientNodesRef = useRef<AmbientNodes | null>(null)
  const audioEnabledRef = useRef(false)
  const lastHoverSoundRef = useRef(0)
  const lofiAudioRef = useRef<HTMLAudioElement | null>(null)
  const musicFadeFrameRef = useRef<number | null>(null)

  const getContext = useCallback(() => {
    audioContextRef.current ??= createAudioContext()
    return audioContextRef.current
  }, [])

  const getLofiAudio = useCallback(() => {
    if (!lofiAudioRef.current) {
      const audio = new Audio(lofiTrack.src)
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0
      lofiAudioRef.current = audio
    }

    return lofiAudioRef.current
  }, [])

  const fadeLofiVolume = useCallback((targetVolume: number, durationMs = 900) => {
    const audio = lofiAudioRef.current
    if (!audio) {
      return
    }

    if (musicFadeFrameRef.current) {
      window.cancelAnimationFrame(musicFadeFrameRef.current)
    }

    const startVolume = audio.volume
    const startedAt = window.performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1)
      audio.volume = startVolume + (targetVolume - startVolume) * progress

      if (progress < 1) {
        musicFadeFrameRef.current = window.requestAnimationFrame(tick)
      }
    }

    musicFadeFrameRef.current = window.requestAnimationFrame(tick)
  }, [])

  const stopLofiTrack = useCallback((reset = true) => {
    const audio = lofiAudioRef.current
    if (!audio) {
      return
    }

    if (musicFadeFrameRef.current) {
      window.cancelAnimationFrame(musicFadeFrameRef.current)
      musicFadeFrameRef.current = null
    }

    audio.pause()
    audio.volume = 0
    if (reset) {
      audio.currentTime = 0
    }
  }, [])

  const startLofiTrack = useCallback(async () => {
    const audio = getLofiAudio()
    audio.volume = 0

    try {
      await audio.play()
      fadeLofiVolume(0.24, 1200)
      return true
    } catch {
      stopLofiTrack()
      return false
    }
  }, [fadeLofiVolume, getLofiAudio, stopLofiTrack])

  const stopAmbient = useCallback(() => {
    const context = audioContextRef.current
    const nodes = ambientNodesRef.current

    if (!context || !nodes) {
      return
    }

    const stopAt = context.currentTime + 0.35
    nodes.masterGain.gain.cancelScheduledValues(context.currentTime)
    nodes.masterGain.gain.setTargetAtTime(0.0001, context.currentTime, 0.08)

    nodes.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop(stopAt)
      } catch {
        // Audio nodes may already be stopped during hot reload or unmount.
      }
    })

    try {
      nodes.lfo.stop(stopAt)
    } catch {
      // Audio nodes may already be stopped during hot reload or unmount.
    }

    window.setTimeout(() => {
      nodes.oscillators.forEach((oscillator) => {
        try {
          oscillator.disconnect()
        } catch {
          // Audio nodes may already be disconnected during hot reload or unmount.
        }
      })

      try {
        nodes.lfo.disconnect()
        nodes.lfoGain.disconnect()
        nodes.sourceGain.disconnect()
        nodes.filter.disconnect()
        nodes.masterGain.disconnect()
      } catch {
        // Audio nodes may already be disconnected during hot reload or unmount.
      }
    }, 380)

    ambientNodesRef.current = null
  }, [])

  const startAmbient = useCallback((context: AudioContext) => {
    if (ambientNodesRef.current) {
      return
    }

    const masterGain = context.createGain()
    const filter = context.createBiquadFilter()
    const lfo = context.createOscillator()
    const lfoGain = context.createGain()
    const sourceGain = context.createGain()

    masterGain.gain.setValueAtTime(0.0001, context.currentTime)
    masterGain.gain.exponentialRampToValueAtTime(0.025, context.currentTime + 1.8)
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(520, context.currentTime)
    filter.Q.setValueAtTime(5, context.currentTime)
    lfo.frequency.setValueAtTime(0.035, context.currentTime)
    lfoGain.gain.setValueAtTime(120, context.currentTime)
    sourceGain.gain.setValueAtTime(0.2, context.currentTime)

    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    filter.connect(masterGain)
    masterGain.connect(context.destination)

    const oscillators = [44, 55, 82, 110].map((frequency, index) => {
      const oscillator = context.createOscillator()
      oscillator.type = index === 2 ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(frequency, context.currentTime)
      oscillator.detune.setValueAtTime(index % 2 === 0 ? -7 : 6, context.currentTime)
      oscillator.connect(sourceGain)
      oscillator.start()
      return oscillator
    })

    sourceGain.connect(filter)
    lfo.start()
    ambientNodesRef.current = {
      filter,
      lfo,
      lfoGain,
      masterGain,
      oscillators,
      sourceGain,
    }
  }, [])

  const playTone = useCallback(
    (kind: 'click' | 'hover') => {
      if (!audioEnabledRef.current) {
        return
      }

      const context = getContext()
      if (!context) {
        return
      }

      if (context.state === 'suspended') {
        void context.resume()
      }

      const now = context.currentTime
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const filter = context.createBiquadFilter()
      const isClick = kind === 'click'
      const duration = isClick ? 0.16 : 0.08
      const startFrequency = isClick ? 210 : 620
      const endFrequency = isClick ? 820 : 390

      oscillator.type = isClick ? 'sawtooth' : 'triangle'
      oscillator.frequency.setValueAtTime(startFrequency, now)
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration)
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(isClick ? 880 : 620, now)
      filter.Q.setValueAtTime(isClick ? 8 : 5, now)
      gain.gain.setValueAtTime(isClick ? 0.028 : 0.012, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      oscillator.connect(filter)
      filter.connect(gain)
      gain.connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + duration + 0.03)
      oscillator.addEventListener('ended', () => {
        oscillator.disconnect()
        filter.disconnect()
        gain.disconnect()
      })
    },
    [getContext],
  )

  const playHoverSound = useCallback(() => {
    const now = window.performance.now()
    if (now - lastHoverSoundRef.current < 130) {
      return
    }

    lastHoverSoundRef.current = now
    playTone('hover')
  }, [playTone])

  const toggleAudio = useCallback(async () => {
    const context = getContext()
    if (!context) {
      return
    }

    if (isAudioEnabled) {
      audioEnabledRef.current = false
      stopLofiTrack()
      stopAmbient()
      setIsAudioEnabled(false)
      return
    }

    await context.resume()
    audioEnabledRef.current = true
    const didStartLofiTrack = await startLofiTrack()
    if (!didStartLofiTrack) {
      startAmbient(context)
    }
    setIsAudioEnabled(true)

    window.setTimeout(() => {
      playTone('click')
    }, 40)
  }, [
    getContext,
    isAudioEnabled,
    playTone,
    startAmbient,
    startLofiTrack,
    stopAmbient,
    stopLofiTrack,
  ])

  useEffect(() => {
    if (!isAudioEnabled) {
      return undefined
    }

    audioEnabledRef.current = true

    const playClick = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('a, button')) {
        playTone('click')
      }
    }

    document.addEventListener('pointerdown', playClick)

    return () => {
      document.removeEventListener('pointerdown', playClick)
    }
  }, [isAudioEnabled, playTone])

  useEffect(
    () => () => {
      stopAmbient()
      stopLofiTrack()
      void audioContextRef.current?.close()
    },
    [stopAmbient, stopLofiTrack],
  )

  return { isAudioEnabled, playHoverSound, toggleAudio }
}

function getCaseStudySlug(pathname: string) {
  return pathname.match(caseStudyPathPattern)?.[1] ?? null
}

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [isBooting, setIsBooting] = useState(true)
  const [shouldShowBoot, setShouldShowBoot] = useState(true)
  const portfolioAudio = usePortfolioAudio()
  const caseStudySlug = getCaseStudySlug(pathname)
  const activeCaseStudy = caseStudies.find((study) => study.slug === caseStudySlug)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const bootTimer = window.setTimeout(() => {
      setIsBooting(false)
    }, reduceMotion ? 160 : 1450)
    const removeTimer = window.setTimeout(() => {
      setShouldShowBoot(false)
    }, reduceMotion ? 380 : 2250)

    return () => {
      window.clearTimeout(bootTimer)
      window.clearTimeout(removeTimer)
    }
  }, [])

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
    <div className={`site-shell ${isBooting ? 'is-booting' : 'is-ready'}`}>
      {shouldShowBoot && <BootScreen isExiting={!isBooting} />}
      <Frame scrollProgress={scrollProgress} />
      <Header
        isAudioEnabled={portfolioAudio.isAudioEnabled}
        onToggleAudio={portfolioAudio.toggleAudio}
        playHoverSound={portfolioAudio.playHoverSound}
      />

      <main>
        {caseStudySlug ? (
          activeCaseStudy ? (
            <CaseStudyPage caseStudy={activeCaseStudy} />
          ) : (
            <CaseStudyNotFound />
          )
        ) : (
          <HomePage playHoverSound={portfolioAudio.playHoverSound} />
        )}
      </main>
    </div>
  )
}

function BootScreen({ isExiting }: { isExiting: boolean }) {
  return (
    <div
      className={`boot-screen ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-label="Loading Joshua portfolio"
    >
      <div className="boot-crystal-grid" aria-hidden="true">
        {bootCrystalCells.map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="boot-loader">
        <span className="boot-logo">{profile.initials}</span>
        <div className="boot-signal" aria-hidden="true">
          {bootSignalBars.map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <p>SIGNAL ACQUIRING</p>
        <div className="boot-progress" aria-hidden="true">
          <span />
        </div>
        <small>CONNECTING PORTFOLIO</small>
      </div>
    </div>
  )
}

function HomePage({ playHoverSound }: { playHoverSound: () => void }) {
  return (
    <>
      <Hero playHoverSound={playHoverSound} />
      <ProofSection />
      <FocusSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
      <SignatureSection />
    </>
  )
}

function Header({
  isAudioEnabled,
  onToggleAudio,
  playHoverSound,
}: {
  isAudioEnabled: boolean
  onToggleAudio: () => Promise<void>
  playHoverSound: () => void
}) {
  const navRef = useRef<HTMLElement>(null)
  const [hoverFrame, setHoverFrame] = useState<HoverFrame | null>(null)

  const activateNavFrame = useCallback(
    (target: HTMLElement) => {
      const navElement = navRef.current
      if (!navElement) {
        return
      }

      const navRect = navElement.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()

      setHoverFrame({
        height: targetRect.height,
        left: targetRect.left - navRect.left,
        top: targetRect.top - navRect.top,
        width: targetRect.width,
      })
      playHoverSound()
    },
    [playHoverSound],
  )

  return (
    <header className="site-header">
      <div className="brand-cluster">
        <a className="brand-mark" href="/" aria-label={`${profile.name} home`}>
          <span>{profile.initials}</span>
        </a>

        <button
          className={`audio-toggle ${isAudioEnabled ? 'is-active' : ''}`}
          type="button"
          aria-label={isAudioEnabled ? 'Disable lofi ambience' : 'Enable lofi ambience'}
          aria-pressed={isAudioEnabled}
          title={`${lofiTrack.title} by ${lofiTrack.artist} (${lofiTrack.license})`}
          onClick={() => {
            void onToggleAudio()
          }}
          onMouseEnter={playHoverSound}
          onPointerEnter={playHoverSound}
        >
          <span className="audio-wave" aria-hidden="true">
            {audioWaveBars.map((_, index) => (
              <span key={index} />
            ))}
          </span>
        </button>
      </div>

      <nav
        className="nav-links recruiter-nav"
        aria-label="Recruiter navigation"
        ref={navRef}
        onMouseLeave={() => setHoverFrame(null)}
        onBlur={(event) => {
          const nextTarget = event.relatedTarget
          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setHoverFrame(null)
          }
        }}
      >
        {hoverFrame && (
          <span
            className="nav-hover-frame"
            aria-hidden="true"
            style={{
              height: hoverFrame.height,
              transform: `translate3d(${hoverFrame.left}px, ${hoverFrame.top}px, 0)`,
              width: hoverFrame.width,
            }}
          >
            <span />
            <span />
            <span />
            <span />
          </span>
        )}

        {headerNavItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noreferrer' : undefined}
            onMouseEnter={(event) => activateNavFrame(event.currentTarget)}
            onPointerEnter={(event) => activateNavFrame(event.currentTarget)}
            onFocus={(event) => activateNavFrame(event.currentTarget)}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
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

function Hero({ playHoverSound }: { playHoverSound: () => void }) {
  return (
    <section className="hero-section" id="top">
      <HeroScene playHoverSound={playHoverSound} />

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
          <p className="hero-summary">{heroLead}</p>

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
      </div>

      <a className="scroll-cue" href="/#proof" aria-label="Jump to portfolio signal">
        <ArrowDown size={18} />
      </a>
    </section>
  )
}

function HeroScene({ playHoverSound }: { playHoverSound: () => void }) {
  return (
    <div className="hero-scene" aria-hidden="true">
      <div className="scene-grid" />
      <div className="tech-orbit">
        {techMedallions.map((item, index) => (
          <span
            aria-hidden="true"
            className={`tech-orbit-ring tech-orbit-ring-${index + 1}`}
            key={item.label}
          >
            <span className="tech-orbit-path">
              <span
                className="tech-medallion"
                onMouseEnter={playHoverSound}
                onPointerEnter={playHoverSound}
              >
                <span className="tech-medallion-inner">
                  <strong>{item.mark}</strong>
                  <small>{item.label}</small>
                </span>
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

function ProofSection() {
  return (
    <motion.section
      className="section proof-section"
      id="proof"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
    >
      <div className="section-heading section-heading-wide">
        <p className="eyebrow">Signal</p>
        <h2>The quick proof, then the deeper story.</h2>
      </div>

      <div className="hero-panel proof-panel">
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
      </div>
    </motion.section>
  )
}

function FocusSection() {
  return (
    <motion.section
      className="section section-split"
      id="about"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
    >
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
    </motion.section>
  )
}

function ProjectsSection() {
  return (
    <motion.section
      className="section"
      id="projects"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
    >
      <div className="section-heading section-heading-wide">
        <p className="eyebrow">Selected work</p>
        <h2>Projects that show how I think, build, and polish.</h2>
      </div>

      <div className="project-list">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </motion.section>
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
    <motion.section
      className="section skills-section"
      id="skills"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
    >
      <div className="section-heading">
        <p className="eyebrow">Skills</p>
        <h2>Practical tools, grouped by how they show up in real work.</h2>
      </div>

      <div className="skills-grid">
        {skills.map((skillGroup, index) => (
          <motion.article
            className="skill-card"
            key={skillGroup.group}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.26 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
          >
            <h3>{skillGroup.group}</h3>
            <ul>
              {skillGroup.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

function ExperienceSection() {
  return (
    <motion.section
      className="section timeline-section"
      id="experience"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
    >
      <div className="section-heading">
        <p className="eyebrow">Experience</p>
        <h2>A focused timeline for growth, projects, and stronger delivery.</h2>
      </div>

      <div className="timeline">
        {timeline.map((item, index) => (
          <motion.article
            className="timeline-item"
            key={`${item.date}-${item.title}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
          >
            <span>{item.date}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

function ContactSection() {
  return (
    <motion.section
      className="contact-section"
      id="contact"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
    >
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
    </motion.section>
  )
}

function SignatureSection() {
  return (
    <motion.section
      className="signature-section"
      aria-label="Joshua signature"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.26 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
    >
      <p className="eyebrow">Built and shipped by</p>
      <strong>JOSHUA</strong>
    </motion.section>
  )
}

export default App
