import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import RunwayCalculator from './components/RunwayCalculator.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-outfit">
      <Navbar />
      <Hero />
      <RunwayCalculator />
      <Footer />
    </div>
  )
}
