import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE_URL } from '../config'
import { SessionDetail } from '../types'

async function fetchSessionDetail(token: string, sessionId: string): Promise<SessionDetail> {
  const headers = { 'Authorization': `Bearer ${token}` }
  const [sessionsRes, historyRes, commLogRes] = await Promise.all([
    fetch(`${API_BASE_URL}/api/sessions?limit=1000`, { headers }),
    fetch(`${API_BASE_URL}/api/sessions/${sessionId}/state-history`, { headers }),
    fetch(`${API_BASE_URL}/api/sessions/${sessionId}/communication-log`, { headers }).catch(() => null)
  ])

  if (!sessionsRes.ok) throw new Error('Failed to fetch sessions')
  if (!historyRes.ok) throw new Error('Failed to fetch session history')

  const sessionsData = await sessionsRes.json()
  const historyData = await historyRes.json()
  const commLogData = commLogRes ? await commLogRes.json() : { exchanges: [] }

  const session = sessionsData.sessions?.find((s: any) => s.session_id === sessionId)
  if (!session) throw new Error('Session not found')

  const formattedHistory = historyData.history?.map((snapshot: any) => ({
    timestamp: snapshot.timestamp,
    stage: snapshot.current_stage || '',
    task: null,
    state: snapshot.global_state || {},
    action: `Stage: ${snapshot.current_stage || 'unknown'}`
  })) || []

  return {
    session_id: sessionId,
    workflow_name: historyData.workflow_name || session.workflow_name || '',
    created_at: session.created_at || '',
    updated_at: session.updated_at || '',
    current_stage: session.current_stage || '',
    status: session.status || 'active',
    state: formattedHistory[formattedHistory.length - 1]?.state || {},
    history: formattedHistory,
    communication_log: commLogData.exchanges || []
  }
}

export function useSessionDetail(sessionId: string | null) {
  const { getToken, userId, isSignedIn } = useAuth()
  
  return useQuery({
    queryKey: ['session', userId, sessionId],
    queryFn: async () => {
      const token = await getToken()
      return fetchSessionDetail(token!, sessionId!)
    },
    enabled: !!sessionId && isSignedIn,
    staleTime: 1000 * 30,
  })
}

