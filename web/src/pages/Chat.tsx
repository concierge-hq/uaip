import { useEffect, useRef, useState, useMemo } from 'react'
import { API_BASE_URL } from '../config'
import { MessageSquare, Send, KeyRound, Link2, Loader2, ArrowRight, Sparkles, CheckCircle2, Trash2 } from 'lucide-react'

type ActivityItem = {
  type: 'status' | 'action' | 'success'
  message?: string
  heading?: string
  detail?: string
}

type ConversationMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
  activity?: ActivityItem[]
}

const DEFAULT_API_BASE = 'https://api.openai.com/v1'

export function Chat() {
  const storage = useMemo(() => {
    try {
      return window.localStorage
    } catch {
      return null
    }
  }, [])

  const [apiBase, setApiBase] = useState<string>(() => {
    if (storage) {
      const stored = storage.getItem('concierge.chat.apiBase')
      if (stored && stored.trim()) return stored
    }
    return DEFAULT_API_BASE
  })

  const [apiKey, setApiKey] = useState<string>(() => {
    if (storage) {
      const stored = storage.getItem('concierge.chat.apiKey')
      if (stored && stored.trim()) return stored
    }
    return ''
  })

  const [protocol, setProtocol] = useState<'aip' | 'mcp'>(() => {
    if (storage) {
      const stored = storage.getItem('concierge.chat.protocol')
      if (stored === 'aip' || stored === 'mcp') {
        return stored
      }
    }
    return 'aip'
  })

  const [clientSessionId, setClientSessionId] = useState<string | null>(() => {
    if (storage) {
      const storedProtocol = storage.getItem('concierge.chat.sessionProtocol')
      const storedSession = storage.getItem('concierge.chat.sessionId')
      if (storedSession && storedProtocol === protocol) {
        return storedSession
      }
    }
    return null
  })
  const [currentMode, setCurrentMode] = useState<string>(() => {
    if (storage) {
      const stored = storage.getItem('concierge.chat.mode')
      if (stored) return stored
    }
    return 'USER'
  })
  const [userInput, setUserInput] = useState<string>('')
  const [busy, setBusy] = useState<boolean>(false)
  const [messages, setMessages] = useState<ConversationMessage[]>(() => {
    if (storage) {
      const stored = storage.getItem('concierge.chat.messages')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return []
        }
      }
    }
    return []
  })
  const [currentActivity, setCurrentActivity] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  // Persist credentials so a refresh doesn't wipe them during local development
  useEffect(() => {
    if (!storage) return
    if (apiBase && apiBase.trim()) {
      storage.setItem('concierge.chat.apiBase', apiBase.trim())
    } else {
      storage.removeItem('concierge.chat.apiBase')
    }
  }, [apiBase, storage])

  useEffect(() => {
    if (!storage) return
    if (apiKey && apiKey.trim()) {
      storage.setItem('concierge.chat.apiKey', apiKey.trim())
    } else {
      storage.removeItem('concierge.chat.apiKey')
    }
  }, [apiKey, storage])

  // Persist chat state (session, mode, messages)
  useEffect(() => {
    if (!storage) return
    if (clientSessionId) {
      storage.setItem('concierge.chat.sessionId', clientSessionId)
      storage.setItem('concierge.chat.sessionProtocol', protocol)
    } else {
      storage.removeItem('concierge.chat.sessionId')
      storage.removeItem('concierge.chat.sessionProtocol')
    }
  }, [clientSessionId, protocol, storage])

  useEffect(() => {
    if (!storage) return
    storage.setItem('concierge.chat.protocol', protocol)
  }, [protocol, storage])

  useEffect(() => {
    if (!storage) return
    storage.setItem('concierge.chat.mode', currentMode)
  }, [currentMode, storage])

  useEffect(() => {
    if (!storage) return
    storage.setItem('concierge.chat.messages', JSON.stringify(messages))
  }, [messages, storage])

  const ensureSession = async () => {
    if (clientSessionId) return clientSessionId
    
    const sessionRes = await fetch(`${API_BASE_URL}/api/debug-client/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_base: apiBase, api_key: apiKey, verbose: false, protocol }),
    })
    const sessionData = await sessionRes.json()
    setClientSessionId(sessionData.client_session_id)
    setCurrentMode(sessionData.mode || 'USER')
    return sessionData.client_session_id
  }

  const clearChat = () => {
    setMessages([])
    setClientSessionId(null)
    setCurrentMode('USER')
    if (storage) {
      storage.removeItem('concierge.chat.sessionId')
      storage.removeItem('concierge.chat.sessionProtocol')
      storage.removeItem('concierge.chat.mode')
      storage.removeItem('concierge.chat.messages')
    }
  }

  const handleProtocolChange = (value: 'aip' | 'mcp') => {
    if (value === protocol) return
    setProtocol(value)
    clearChat()
  }

  const onSend = async () => {
    if (!apiBase || !apiKey || !userInput || busy) return
    setBusy(true)
    try {
      // Ensure session exists
      const sessionId = await ensureSession()

      // Add user message to UI
      setMessages((m) => [...m, { role: 'user', content: userInput }])
      const currentInput = userInput
      setUserInput('')

      // Send to backend ToolCallingClient (it will search/connect automatically via LLM)
      setCurrentActivity('Processing...')
      const res = await fetch(`${API_BASE_URL}/api/debug-client/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_session_id: sessionId, message: currentInput }),
      })
      const data = await res.json()
      setCurrentActivity('')

      // Add assistant response with activity log
      if (data.assistant_message) {
        setMessages((m) => [...m, { role: 'assistant', content: data.assistant_message, activity: data.activity || [] }])
      }

      // Update mode display
      if (data.mode) {
        setCurrentMode(data.mode)
      }
    } catch (e: any) {
      setCurrentActivity('')
      setMessages((m) => [...m, { role: 'assistant', content: `Error: ${e?.message || 'unknown'}` }])
    } finally {
      setBusy(false)
      setCurrentActivity('')
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Concierge Chat</h1>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>
        )}
      </div>

      {/* API Configuration Bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-gray-500" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white"
              placeholder="API Key (sk-...)"
            />
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white"
              placeholder="https://api.openai.com/v1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gray-500" />
            <select
              value={protocol}
              onChange={(e) => handleProtocolChange(e.target.value as 'aip' | 'mcp')}
              className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white"
            >
              <option value="aip">AIP (stage-aware)</option>
              <option value="mcp">MCP (tool catalog)</option>
            </select>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${currentMode === 'SERVER' ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`}></div>
            <span className="text-gray-600 dark:text-gray-400">
              Mode: <strong>{currentMode}</strong> {currentMode === 'SERVER' ? '(Connected to workflow)' : '(Searching for workflows)'}
            </span>
          </div>
          {currentActivity && (
            <div className="flex items-center gap-2 text-indigo-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{currentActivity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl h-[65vh] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Start chatting to discover and use workflows...</p>
              </div>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : m.role === 'system'
                    ? 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 italic'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div>{m.content}</div>
                {m.activity && m.activity.length > 0 && (
                  <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    {m.activity.map((item, activityIdx) => {
                      if (item.type === 'status') {
                        return (
                          <div key={activityIdx} className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3" />
                            <span>{item.message}</span>
                          </div>
                        )
                      }
                      if (item.type === 'action') {
                        return (
                          <div key={activityIdx} className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>
                              {item.heading}
                              {item.detail ? ` — ${item.detail}` : ''}
                            </span>
                          </div>
                        )
                      }
                      if (item.type === 'success') {
                        return (
                          <div key={activityIdx} className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>
                              {item.message}
                              {item.detail ? ` — ${item.detail}` : ''}
                            </span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) onSend()
            }}
            placeholder={apiBase && apiKey ? "Type your message..." : "Enter API credentials above first..."}
            disabled={!apiBase || !apiKey}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white disabled:opacity-50"
          />
          <button
            onClick={onSend}
            disabled={busy || !userInput || !apiBase || !apiKey}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </button>
        </div>
      </div>
    </div>
  )
}


