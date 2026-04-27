import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dot-pattern">
      {/* Ambient gradient blobs */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-ecell-purple/8 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ecell-violet/8 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-10 right-10 w-[200px] h-[200px] bg-ecell-orange/5 rounded-full blur-2xl pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-32 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ecell-dark border border-ecell-purple/20 mb-10 shadow-lg shadow-ecell-purple/5">
          <span className="w-1.5 h-1.5 rounded-full bg-ecell-orange animate-pulse" />
          <span className="text-xs font-semibold text-ecell-muted tracking-widest uppercase">
            Startup Financial Intelligence
          </span>
        </div>

        {/* Main headline — Bebas Neue for maximum impact */}
        <h1 className="font-bebas leading-[0.92] text-white mb-8">
          <span className="block text-[clamp(64px,14vw,128px)]">THE FOUNDER'S</span>
          <span className="block text-[clamp(64px,14vw,128px)] text-gradient-cyan">RUNWAY</span>
        </h1>

        <p className="text-ecell-muted text-base sm:text-xl max-w-2xl mx-auto mb-14 leading-relaxed font-light">
          In the world of startups,{' '}
          <span className="text-white font-semibold">Cash is King.</span> Know exactly
          how many months you have before zero — and get the strategic clarity to act
          before it's too late.
        </p>

        {/* Key stats */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-14">
          {[
            { stat: '82%', label: 'of startups fail from cash issues' },
            { stat: '< 3 mo', label: 'is the critical danger threshold' },
            { stat: '18 mo', label: 'is the ideal runway to target' },
          ].map(({ stat, label }) => (
            <div key={stat} className="flex flex-col items-center">
              <span className="font-bebas text-3xl sm:text-4xl text-ecell-orange leading-none">
                {stat}
              </span>
              <span className="text-xs text-ecell-muted/60 mt-1.5 tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <Link
          to="/calculator"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-ecell-orange to-ecell-purple text-white font-bold text-sm hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-2xl shadow-ecell-orange/25"
        >
          <span>Calculate Your Runway</span>
        </Link>
      </div>
    </section>
  )
}
