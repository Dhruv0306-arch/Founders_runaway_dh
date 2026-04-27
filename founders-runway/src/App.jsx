import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import CalculatorPage from './pages/CalculatorPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white font-outfit">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
