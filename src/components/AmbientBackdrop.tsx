import { useEffect, useRef } from 'react'

type Star = {
  alpha: number
  phase: number
  radius: number
  speed: number
  x: number
  y: number
}

function createRandom(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function createStars(count: number) {
  const random = createRandom(26061999)

  return Array.from({ length: count }, (): Star => ({
    alpha: 0.16 + random() * 0.5,
    phase: random() * Math.PI * 2,
    radius: 0.45 + random() * 1.45,
    speed: 0.12 + random() * 0.28,
    x: random(),
    y: random(),
  }))
}

export function AmbientBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const auraRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const aura = auraRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context || !aura) {
      return undefined
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    let animationFrame = 0
    let width = window.innerWidth
    let height = window.innerHeight
    let pointerX = width * 0.5
    let pointerY = height * 0.38
    let renderedX = pointerX
    let renderedY = pointerY
    let stars = createStars(width < 700 ? 28 : 64)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const scale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * scale)
      canvas.height = Math.round(height * scale)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(scale, 0, 0, scale, 0, 0)
      stars = createStars(width < 700 ? 28 : 64)
    }

    const movePointer = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      aura.dataset.visible = 'true'
    }

    const hidePointer = () => {
      aura.dataset.visible = 'false'
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)

      const driftX = (renderedX / Math.max(width, 1) - 0.5) * 18
      const driftY = (renderedY / Math.max(height, 1) - 0.5) * 12

      stars.forEach((star, index) => {
        const twinkle = reducedMotion.matches
          ? 1
          : 0.56 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.44
        const x = star.x * width + driftX * ((index % 5) / 5)
        const y = star.y * height + driftY * ((index % 7) / 7)

        context.beginPath()
        context.arc(x, y, star.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(183, 205, 255, ${star.alpha * twinkle})`
        context.shadowBlur = star.radius * 8
        context.shadowColor = 'rgba(145, 178, 255, 0.6)'
        context.fill()
      })

      context.shadowBlur = 0
      renderedX += (pointerX - renderedX) * 0.085
      renderedY += (pointerY - renderedY) * 0.085
      aura.style.transform = `translate3d(${renderedX}px, ${renderedY}px, 0)`
      animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', movePointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', hidePointer)

    if (!coarsePointer.matches) {
      animationFrame = window.requestAnimationFrame(draw)
    } else {
      draw(0)
      window.cancelAnimationFrame(animationFrame)
    }

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', movePointer)
      document.documentElement.removeEventListener('pointerleave', hidePointer)
    }
  }, [])

  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="cursor-aura" ref={auraRef} />
    </div>
  )
}
