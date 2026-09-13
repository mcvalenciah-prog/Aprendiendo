import { useState } from 'react'
import ContactHeader from './components/ContactHeader'
import { profile } from './data/profile'

// Default active tab for the S2 tab system; S1 renders only the header plus
// the current section heading. Content tabs arrive in the next slice.
const DEFAULT_TAB = 'Perfil profesional'

function App() {
  const [activeTab] = useState(DEFAULT_TAB)

  return (
    <div className="app">
      <ContactHeader profile={profile} />
      <main className="app-content">
        <h1 className="section-title">{activeTab}</h1>
      </main>
    </div>
  )
}

export default App