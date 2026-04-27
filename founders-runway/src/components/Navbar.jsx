import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
          ? 'bg-ecell-navy/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ecell-orange to-ecell-purple flex items-center justify-center shadow-lg shadow-ecell-orange/20">
            <span className="text-[11px] font-bold text-white font-outfit tracking-tight">FR</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-white font-semibold text-sm tracking-wide">Founder's</span>
            <span className="text-gradient-cyan font-bold text-sm tracking-wide">Runway</span>
          </div>
        </Link>

        {/* CTA */}
        <Link
          to="/calculator"
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-ecell-orange/15 to-ecell-purple/10 border border-ecell-orange/20 text-ecell-orange hover:border-ecell-orange/40 hover:bg-ecell-orange/20 transition-all duration-200 tracking-wide"
        >
          Calculate Now →
        </Link>
      </div>
    </nav>
  )
}
