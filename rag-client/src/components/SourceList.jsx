import { useState } from 'react'

function SourceList({ sources = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!sources.length) return null

  return (
    <section className="sources-panel">
      <div className="section-heading">
        <button
          type="button"
          className="source-toggle"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="eyebrow">Sources</span>
          <span className="source-count">{sources.length}</span>
          <span className="chevron" aria-hidden="true">
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </div>
      {isOpen && (
        <ol>
          {sources.map((source, index) => (
            <li key={`${index}-${source.chunk || source}`}>
              {source.chunk || source}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default SourceList
