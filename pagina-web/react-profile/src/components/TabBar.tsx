interface TabBarProps {
  tabs: readonly string[]
  active: string
  onSelect: (tab: string) => void
}

// State-driven tab bar (profile-tabs spec): selection lives in App state, the
// buttons never navigate or change the URL. S3 appends 'Simulador Triage' to
// the tabs array passed by App; this component needs no further changes.
function TabBar({ tabs, active, onSelect }: TabBarProps) {
  return (
    <nav className="tab-bar" aria-label="Secciones del perfil">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={tab === active ? 'tab-bar__tab tab-bar__tab--active' : 'tab-bar__tab'}
          aria-current={tab === active ? 'true' : undefined}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}

export default TabBar