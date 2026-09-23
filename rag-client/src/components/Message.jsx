import { useConversation } from '../context/ConversationContext'

function Message({ message }) {
  if (!message) return null

  const conversation = useConversation()

  return (
    <article className={`message message-${message.role}`}>
      <span className="conversation-meta">
        Conversation #{conversation.id ?? '-'} · {conversation.title}
      </span>
      <span className="eyebrow">{message.role === 'user' ? 'Vous' : 'Assistant'}</span>
      <p>{message.content}</p>
    </article>
  )
}

export default Message
