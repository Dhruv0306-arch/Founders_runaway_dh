export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800/60 py-12 px-4 sm:px-6 mt-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <span className="text-[10px] font-bold text-white">FR</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-300">Founder's Runway</span>
              <span className="ml-2 text-[10px] text-slate-700 font-mono">v1.0</span>
            </div>
          </div>

          {/* Center tagline */}
          <p className="text-xs text-slate-700 text-center leading-relaxed">
            Built for{' '}
            <span className="text-slate-600">E-Cell IIT Task Submission</span>
            {' '}·{' '}
            <span className="text-slate-600">Frontend only</span>
            {' '}·{' '}
            <span className="text-slate-600">No data stored</span>
          </p>

          {/* Right */}
          <p className="text-[11px] text-slate-800 font-mono">
            © {year} · Cash is King
          </p>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-[10px] text-slate-800 max-w-lg mx-auto leading-relaxed">
          This tool is for educational and planning purposes only. It does not constitute
          financial advice. Always consult a qualified financial professional for
          investment decisions.
        </p>
      </div>
    </footer>
  )
}
