import { useState } from 'react'
import ContactHeader from './components/ContactHeader'
import InterestsTab from './components/InterestsTab'
import ProfileTab from './components/ProfileTab'
import ResearchTab from './components/ResearchTab'
import TabBar from './components/TabBar'
import TriageSimulator from './components/TriageSimulator'
import { profile } from './data/profile'

// Exactly four tabs (profile-tabs spec), in order. Tab switching is pure
// state — no router, no URL change.
const TABS = [
  'Perfil profesional',
  'Áreas de interés',
  'Áreas de investigación',
  'Simulador Triage',
] as const

const DEFAULT_TAB = TABS[0]

function renderTab(activeTab: string) {
  switch (activeTab) {
    case 'Perfil profesional':
      return <ProfileTab />
    case 'Áreas de interés':
      return <InterestsTab />
    case 'Áreas de investigación':
      return <ResearchTab />
    case 'Simulador Triage':
      return <TriageSimulator />
    default:
      return null
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB)

  return (
    <div className="app">
      <ContactHeader profile={profile} />
      <main className="app-content">
        <TabBar tabs={TABS} active={activeTab} onSelect={setActiveTab} />
        {renderTab(activeTab)}
      </main>
    </div>
  )
}

export default App