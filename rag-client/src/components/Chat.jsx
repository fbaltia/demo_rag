import { useState } from 'react'
import api from '../api'
import Message from './Message'
import SourceList from './SourceList'

function Chat() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setAnswer('')
    setSources([])

    try {
      const response = await api.post('/ask', { question: question.trim() })
      setAnswer(response.data.answer)
      setSources(response.data.sources || [])
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
          {loading ? 'Recherche...' : 'Envoyer la question'}
        </button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      <Message answer={answer} />
      <SourceList sources={sources} />
    </>
  )
}

export default Chat
