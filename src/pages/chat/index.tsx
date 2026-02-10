import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

export default function ChatPage() {
  const [conversationId, setConversationId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function startConversation(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await api.post('/chat/conversations', { employerProfileId: undefined, employeeProfileId: employeeId })
      setConversationId(res.data.id)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    }
  }

  async function loadMessages() {
    if (!conversationId) return
    try {
      const res = await api.get(`/chat/conversations/${conversationId}/messages`)
      setMessages(res.data || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    }
  }

  async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!conversationId) return setError('No conversation selected')
    try {
      await api.post(`/chat/conversations/${conversationId}/messages`, { content: text })
      setText('')
      await loadMessages()
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    }
  }

  useEffect(() => { if (conversationId) loadMessages() }, [conversationId])

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Chat</h2>
      <div className="space-y-4 max-w-lg">
        <form onSubmit={startConversation} className="space-y-2">
          <label className="block text-sm font-medium">Employee profile id</label>
          <input className="mt-1 block w-full border rounded p-2" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} />
          <div>
            <button className="btn btn-sm btn-primary">Start conversation</button>
          </div>
        </form>

        <div>
          <label className="block text-sm font-medium">Conversation id</label>
          <input className="mt-1 block w-full border rounded p-2" value={conversationId} onChange={e=>setConversationId(e.target.value)} />
          <div className="mt-2">
            <button onClick={loadMessages} className="btn btn-sm">Load messages</button>
          </div>
        </div>

        <div className="p-4 border rounded max-h-80 overflow-auto bg-white">
          {messages.map(m => (
            <div key={m.id} className="mb-2">
              <div className="text-xs text-gray-500">{m.senderId} • {new Date(m.createdAt).toLocaleString()}</div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input className="flex-1 border rounded p-2" value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn btn-sm btn-primary">Send</button>
        </form>

        {error && <div className="text-red-600">{error}</div>}
      </div>
    </Layout>
  )
}
