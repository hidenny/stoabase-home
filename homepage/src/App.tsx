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
      </Routes>
    </BrowserRouter>
  )
}

export default App
