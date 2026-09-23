import { useEffect, useState } from 'react'
import api from '../api'
import Message from './Message'
import SourceList from './SourceList'

function Chat({ conversationId, messages, onMessagesChange }) {
  const [question, setQuestion] = useState('')
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setSources([])
    setError('')
  }, [conversationId])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setSources([])

    try {
      const trimmedQuestion = question.trim()
      const response = await api.post('/ask', {
        question: trimmedQuestion,
        conversation_id: conversationId,
      })
      onMessagesChange([
        ...messages,
        { role: 'user', content: trimmedQuestion },
        { role: 'assistant', content: response.data.answer },
      ], response.data.conversation_id)
      setSources(response.data.sources || [])
      setQuestion('')
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'La question a echoue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form className="question-form" onSubmit={handleSubmit}>
        <label htmlFor="question">Votre question</label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Posez une question sur vos documents..."
          rows="4"
        />
        <button type="submit" disabled={!question.trim() || loading}>
          {loading ? (
            <span className="loading-state">
              <span className="spinner" aria-hidden="true" />
              Recherche...
            </span>
          ) : (
            'Envoyer la question'
          )}
        </button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      <section className="messages-panel" aria-live="polite">
        {messages.map((message, index) => (
          <Message key={message.id || `${message.role}-${index}`} message={message} />
        ))}
      </section>
      <SourceList sources={sources} />
    </>
  )
}

export default Chat
