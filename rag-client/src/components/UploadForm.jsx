import { useState } from 'react'
import api from '../api'

function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setLoading(true)
    setStatus('Indexation en cours...')

    try {
      const response = await api.post('/upload', formData)
      setStatus(`${response.data.message} (${response.data.chunks} chunks)`)
      onUploaded?.()
    } catch (error) {
      setStatus(error.response?.data?.detail || "L'upload a echoue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label htmlFor="pdf-file">Document PDF</label>
      <div className="upload-row">
        <input
          id="pdf-file"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Indexation...' : 'Importer'}
        </button>
      </div>
      {status && <p className="status" role="status">{status}</p>}
    </form>
  )
}

export default UploadForm
