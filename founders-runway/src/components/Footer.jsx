export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ecell-purple/20 py-12 px-4 sm:px-6 mt-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ecell-orange to-ecell-purple flex items-center justify-center shadow-md shadow-ecell-orange/20">
              <span className="text-[10px] font-bold text-white">FR</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-white">Founder's Runway</span>
              <span className="ml-2 text-[10px] text-ecell-muted/40 font-mono">v1.0</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-sm text-ecell-lavender max-w-lg mx-auto leading-relaxed">
          This tool is for educational and planning purposes only. It does not constitute
          financial advice. Always consult a qualified financial professional for
          investment decisions.
        </p>
      </div>
    </footer>
  )
}
