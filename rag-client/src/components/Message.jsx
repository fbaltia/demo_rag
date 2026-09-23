function Message({ answer }) {
  if (!answer) return null

  return (
    <section className="answer-panel" aria-live="polite">
      <span className="eyebrow">Reponse</span>
      <p>{answer}</p>
    </section>
  )
}

export default Message
