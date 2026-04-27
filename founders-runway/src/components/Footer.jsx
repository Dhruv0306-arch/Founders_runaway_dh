import { Link } from 'react-router-dom'
import { ArrowUp, Calculator, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-start">
          
          {/* Left: Brand + Disclaimer */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ecell-orange to-ecell-purple flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">FR</span>
              </div>
              <span className="text-sm font-semibold text-white">Founder's Runway</span>
            </div>
            <p className="text-xs text-ecell-muted/50 max-w-md leading-relaxed">
              This tool is for educational and planning purposes only. It does not constitute
              financial advice. Always consult a qualified financial professional for
              investment decisions.
            </p>
            <p className="text-[10px] text-ecell-muted/30 mt-4 font-mono">
              &copy; {year} Founder's Runway.
            </p>
          </div>

          {/* Right: Quick links */}
          <div className="flex flex-col gap-2 sm:items-end">
            <span className="text-[10px] text-ecell-muted/40 uppercase tracking-widest font-semibold mb-1">
              Quick Links
            </span>
            <Link
              to="/calculator"
              className="flex items-center gap-2 text-xs text-ecell-muted/60 hover:text-white transition-colors"
            >
              <Calculator className="w-3 h-3" />
              Calculator
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-xs text-ecell-muted/60 hover:text-white transition-colors text-left"
            >
              <ArrowUp className="w-3 h-3" />
              Back to Top
            </button>
            <a
              href="https://github.com/Dhruv0306-arch/Founders_runaway_dh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-ecell-muted/60 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Source Code
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
