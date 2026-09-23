import { useEffect, useState } from 'react'
import api from './api'
import Chat from './components/Chat'
import UploadForm from './components/UploadForm'
import { ConversationContext } from './context/ConversationContext'
import './App.css'

function App() {
  const [conversations, setConversations] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [historyError, setHistoryError] = useState('')

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await api.get('/conversations')
        const history = response.data
        setConversations(history)
        if (history.length > 0) {
          await selectConversation(history[0].id)
        }
      } catch {
        setHistoryError('Impossible de charger l’historique.')
      }
    }

    loadHistory()
  }, [])

  async function selectConversation(id) {
    try {
      const response = await api.get(`/conversations/${id}`)
      setConversationId(id)
      setMessages(response.data.messages || [])
      setHistoryError('')
    } catch {
      setHistoryError('Impossible de charger cette conversation.')
    }
  }

  async function createConversation() {
    setConversationId(null)
    setMessages([])
    setHistoryError('')
  }

  function handleMessagesChange(nextMessages, nextConversationId) {
    setMessages(nextMessages)
    setConversationId(nextConversationId)
    setConversations((current) =>
      current.some((conversation) => conversation.id === nextConversationId)
        ? current.map((conversation) =>
            conversation.id === nextConversationId
              ? { ...conversation, title: nextMessages[0]?.content || conversation.title }
              : conversation,
          )
        : [
            { id: nextConversationId, title: nextMessages[0]?.content || 'Nouvelle conversation' },
            ...current,
          ],
    )
  }

  const activeConversation = conversations.find(
    (conversation) => conversation.id === conversationId,
  )
  const conversationContext = {
    id: conversationId,
    title: activeConversation?.title || 'Nouvelle conversation',
  }

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
        <section className="panel history-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">00 / History</span>
              <h2>Conversations</h2>
            </div>
            <span className="panel-mark">SQL</span>
          </div>
          <button className="new-conversation" type="button" onClick={createConversation}>
            Nouvelle conversation
          </button>
          <div className="conversation-list">
            {conversations.map((conversation) => (
              <button
                className={`conversation-item ${conversation.id === conversationId ? 'active' : ''}`}
                key={conversation.id}
                type="button"
                onClick={() => selectConversation(conversation.id)}
              >
                {conversation.title}
              </button>
            ))}
          </div>
          {historyError && <p className="error" role="alert">{historyError}</p>}
        </section>

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
          <ConversationContext.Provider value={conversationContext}>
            <Chat
              conversationId={conversationId}
              messages={messages}
              onMessagesChange={handleMessagesChange}
            />
          </ConversationContext.Provider>
        </section>
      </div>

      <footer>Embeddings + Chroma + Ollama <span>•</span> moteur local</footer>
    </main>
  )
}

export default App
