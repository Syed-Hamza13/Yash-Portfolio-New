import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

export interface LightboxItem {
  id: string
  title: string
  image: string
  tag?: string
  subtag?: string
}

interface ImageLightboxProps {
  isOpen: boolean
  items: LightboxItem[]
  currentIndex: number
  originRect: DOMRect | null
  onClose: () => void
  onNavigate: (index: number) => void
  onExited?: () => void
}

interface FlipTransform {
  x: number
  y: number
  scaleX: number
  scaleY: number
  borderRadius: string
}

// Critically-damped ease-out curve — mathematically cannot overshoot (no spring bounce).
const FLIP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const OPEN_DURATION = 0.5
const CLOSE_DURATION = 0.4
const SOURCE_RADIUS = '24px'
const TARGET_RADIUS = '14px'

export default function ImageLightbox({
  isOpen,
  items,
  currentIndex,
  originRect,
  onClose,
  onNavigate,
  onExited,
}: ImageLightboxProps) {
  const [direction, setDirection] = useState(0)
  const openTimeRef = useRef(0)

  const currentItem = items[currentIndex]

  console.log('[MONITOR] ImageLightbox RENDER', { isOpen, currentIndex, currentItemId: currentItem?.id, originRect })

  /* ------------------------------------------------------------------ */
  /* Preload only the immediate neighbours — one image in the DOM at a  */
  /* time, decoded asynchronously in the background (zero main-thread   */
  /* decode stalls).                                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isOpen) return
    for (const i of [currentIndex - 1, currentIndex + 1]) {
      const neighbor = items[i]
      if (neighbor) {
        const img = new Image()
        img.decoding = 'async'
        img.src = neighbor.image
      }
    }
  }, [isOpen, currentIndex, items])

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setDirection(1)
      onNavigate(currentIndex + 1)
    }
  }, [currentIndex, items.length, onNavigate])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1)
      onNavigate(currentIndex - 1)
    }
  }, [currentIndex, onNavigate])

  useEffect(() => {
    if (isOpen) openTimeRef.current = performance.now()
  }, [isOpen])

  // Guard against an accidental close fired by the same gesture that opened the lightbox.
  const handleBackdropClick = useCallback(() => {
    if (performance.now() - openTimeRef.current < 350) return
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goNext, goPrev])

  // scrollbar-gutter: stable is set on <html> in index.css, so this does not shift layout.
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  /* ------------------------------------------------------------------ */
  /* FLIP geometry                                                      */
  /* ------------------------------------------------------------------ */

  // Target box: centered in the viewport, aspect ratio taken from the source card.
  const targetBox = useMemo(() => {
    const winW = window.innerWidth
    const winH = window.innerHeight

    let ar = 1
    if (originRect && originRect.width > 0 && originRect.height > 0) {
      ar = originRect.width / originRect.height
    }

    const maxW = Math.min(winW * 0.88, 1050)
    const maxH = winH * 0.72

    let w = maxW
    let h = maxW / ar
    if (h > maxH) {
      h = maxH
      w = maxH * ar
    }

    // Reserve room beneath for the metadata pill.
    const top = Math.max((winH - h) / 2 - 24, winH * 0.04)
    const left = (winW - w) / 2

    return { w, h, top, left }
  }, [originRect])

  // Transform that maps the centered target box onto a source grid rect.
  const flipTo = useCallback(
    (rect: DOMRect | null): FlipTransform => {
      if (!rect || rect.width <= 0 || rect.height <= 0) {
        return { x: 0, y: 24, scaleX: 0.92, scaleY: 0.92, borderRadius: TARGET_RADIUS }
      }
      const targetCx = targetBox.left + targetBox.w / 2
      const targetCy = targetBox.top + targetBox.h / 2
      return {
        x: rect.left + rect.width / 2 - targetCx,
        y: rect.top + rect.height / 2 - targetCy,
        scaleX: rect.width / targetBox.w,
        scaleY: rect.height / targetBox.h,
        borderRadius: SOURCE_RADIUS,
      }
    },
    [targetBox]
  )

  // On close, fly back into the CURRENT item's grid card (user may have navigated).
  const getExitRect = useCallback((): DOMRect | null => {
    if (!currentItem) return originRect
    const cardEl = document.getElementById(`portfolio-card-${currentItem.id}`)
    if (cardEl) {
      cardEl.scrollIntoView({ block: 'nearest', behavior: 'instant' })
      return cardEl.getBoundingClientRect()
    }
    return originRect
  }, [currentItem, originRect])

  const boxVariants: Variants = {
    initial: (rect: DOMRect | null) => {
      const trans = flipTo(rect)
      console.log('[MONITOR] boxVariants initial: ' + JSON.stringify({
        rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null,
        targetBox,
        trans
      }))
      return {
        ...trans,
        opacity: 1,
      }
    },
    animate: {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      borderRadius: TARGET_RADIUS,
      opacity: 1,
      transition: { duration: OPEN_DURATION, ease: FLIP_EASE },
    },
    exit: () => {
      const exitRect = getExitRect()
      const trans = flipTo(exitRect)
      console.log('[MONITOR] boxVariants exit: ' + JSON.stringify({
        exitRect: exitRect ? { left: exitRect.left, top: exitRect.top, width: exitRect.width, height: exitRect.height } : null,
        trans
      }))
      return {
        ...trans,
        opacity: 1,
        transition: { duration: CLOSE_DURATION, ease: FLIP_EASE },
      }
    },
  }

  const navVariants: Variants = {
    enter: (dir: number) => ({ x: dir >= 0 ? '55%' : '-55%', opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { duration: 0.32, ease: FLIP_EASE },
        opacity: { duration: 0.22, ease: 'easeOut' },
      },
    },
    exit: (dir: number) => ({
      x: dir >= 0 ? '-40%' : '40%',
      opacity: 0,
      transition: {
        x: { duration: 0.28, ease: [0.4, 0, 1, 1] },
        opacity: { duration: 0.2, ease: 'easeIn' },
      },
    }),
  }

  const controlTransition = { duration: 0.25, ease: 'easeOut' as const, delay: 0.12 }
  const isLogo = currentItem?.tag === 'MARK' || currentItem?.subtag?.includes('LOGO')

  return (
    <AnimatePresence mode="wait" onExitComplete={onExited}>
      {isOpen && currentItem && (
        /* Single direct AnimatePresence child — it animates nothing itself so
           the artwork never double-fades; children coordinate their own exits. */
        <motion.div
          key="lightbox-root"
          className="fixed inset-0 z-[9999] select-none overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.title}
        >
          {/* Backdrop — fades independently of the flying artwork */}
          <motion.div
            className="absolute inset-0 bg-[#070812]/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: CLOSE_DURATION - 0.1, ease: 'easeIn' } }}
            onClick={handleBackdropClick}
          />

          {/* Counter pill — top left */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: controlTransition }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-mono tracking-widest uppercase shadow-xl"
          >
            {currentIndex + 1} / {items.length}
          </motion.div>

          {/* Close button — top right */}
          <motion.button
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: controlTransition }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors duration-200 group cursor-pointer shadow-xl"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Prev arrow */}
          {currentIndex > 0 && (
            <motion.button
              onClick={goPrev}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: controlTransition }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-transform duration-200 hover:scale-110 cursor-pointer shadow-2xl"
              aria-label="Previous artwork"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {/* Next arrow */}
          {currentIndex < items.length - 1 && (
            <motion.button
              onClick={goNext}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0, transition: controlTransition }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-transform duration-200 hover:scale-110 cursor-pointer shadow-2xl"
              aria-label="Next artwork"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}

          {/* FLIP artwork box — absolutely placed at the exact target box,
              transformed back onto the grid rect on frame 0, animated to identity. */}
          <motion.div
            custom={originRect}
            variants={boxVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'absolute',
              left: targetBox.left,
              top: targetBox.top,
              width: targetBox.w,
              height: targetBox.h,
              willChange: 'transform',
            }}
            onClick={(e) => e.stopPropagation()}
            className={`z-40 overflow-hidden shadow-2xl flex items-center justify-center ${
              isLogo ? 'bg-white p-6 sm:p-10' : 'bg-black/80 border border-white/10 p-1.5 sm:p-2'
            }`}
          >
            {/* Exactly one image rendered at a time; neighbours live in memory only. */}
            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence custom={direction} initial={false} mode="sync">
                <motion.img
                  key={currentItem.id}
                  src={currentItem.image}
                  alt={currentItem.title}
                  draggable={false}
                  decoding="async"
                  custom={direction}
                  variants={navVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full object-contain select-none"
                  style={{ willChange: 'transform' }}
                />
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Metadata pill — anchored under the artwork box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: controlTransition }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
            style={{
              position: 'absolute',
              left: targetBox.left,
              top: targetBox.top + targetBox.h + 14,
              width: targetBox.w,
            }}
            className="z-40 flex items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white text-xs sm:text-sm font-semibold max-w-[300px] sm:max-w-none truncate">
              {currentItem.title}
            </span>
            {currentItem.subtag && (
              <span className="text-white/50 text-[11px] font-mono border-l border-white/20 pl-2.5">
                {currentItem.subtag}
              </span>
            )}
            {currentItem.tag && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold shrink-0 ${
                  isLogo ? 'bg-ink text-white' : 'bg-amber-400 text-ink'
                }`}
              >
                {currentItem.tag}
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
