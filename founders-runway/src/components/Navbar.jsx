import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-[11px] font-bold text-white font-outfit tracking-tight">FR</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-white font-semibold text-sm tracking-wide">Founder's</span>
            <span className="text-gradient-cyan font-bold text-sm tracking-wide">Runway</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="#calculator"
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/15 to-emerald-500/10 border border-cyan-500/20 text-cyan-400 hover:border-cyan-400/40 hover:bg-cyan-500/20 transition-all duration-200 tracking-wide"
        >
          Calculate Now →
        </a>
      </div>
    </nav>
  )
}
