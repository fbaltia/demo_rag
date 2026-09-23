import Chat from './components/Chat'
import UploadForm from './components/UploadForm'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">DOCUMENT Q&A / LOCAL RAG</p>
          <h1>Ask your documents.</h1>
          <p className="intro">Importez un PDF, puis interrogez son contenu avec votre moteur local.</p>
        </div>
        <span className="status-dot">API locale</span>
      </header>

      <div className="workspace">
        <section className="panel import-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / Index</span>
              <h2>Ajouter une source</h2>
            </div>
            <span className="panel-mark">PDF</span>
          </div>
          <UploadForm />
        </section>

        <section className="panel chat-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / Ask</span>
              <h2>Interroger la base</h2>
            </div>
            <span className="panel-mark">RAG</span>
          </div>
          <Chat />
        </section>
      </div>

      <footer>Embeddings + Chroma + Ollama <span>•</span> moteur local</footer>
    </main>
  )
}

export default App
