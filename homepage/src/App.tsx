import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StoaOnePager from './StoaOnePager'
import Deck from './Deck'
import DeckNew from './DeckNew'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StoaOnePager />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/deck-new" element={<DeckNew />} />
        {/* Language paths — StoaOnePager reads lang from pathname via i18n */}
        <Route path="/zh-HK/*" element={<StoaOnePager />} />
        <Route path="/zh-TW/*" element={<StoaOnePager />} />
        <Route path="/zh-CN/*" element={<StoaOnePager />} />
        <Route path="/ja/*" element={<StoaOnePager />} />
        <Route path="/ko/*" element={<StoaOnePager />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
