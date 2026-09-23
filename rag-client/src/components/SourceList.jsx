function SourceList({ sources = [] }) {
  if (!sources.length) return null

  return (
    <section className="sources-panel">
      <div className="section-heading">
        <span className="eyebrow">Sources</span>
        <span className="source-count">{sources.length}</span>
      </div>
      <ol>
        {sources.map((source, index) => (
          <li key={`${index}-${source.chunk || source}`}>
            {source.chunk || source}
          </li>
        ))}
      </ol>
    </section>
  )
}

export default SourceList
