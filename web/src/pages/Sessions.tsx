import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react'
import { useSessions } from '../hooks/useSessions'
import { format } from 'date-fns'
import { Session } from '../types'

export function Sessions() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading, error } = useSessions(page, 50)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
      case 'active':
        return <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
      default:
        return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const classes = {
      completed: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      failed: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      active: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    }
    return classes[status as keyof typeof classes] || 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700'
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isConnectionError = errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')
    
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="max-w-md text-center">
          <XCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load sessions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isConnectionError 
              ? 'Cannot connect to the backend server' 
              : errorMessage}
          </p>
          <div className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-xs text-gray-700 dark:text-gray-300">
            <p className="font-semibold mb-2">Troubleshooting steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ensure backend server is running on port 8089</li>
              <li>Check PostgreSQL database is initialized</li>
              <li>Verify database connection settings</li>
              <li>Run: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">python scripts/init-database.py</code></li>
            </ol>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              See <a href="https://github.com/yourusername/concierge/blob/main/TROUBLESHOOTING.md" className="text-indigo-600 dark:text-indigo-400 hover:underline">TROUBLESHOOTING.md</a> for more help
            </p>
          </div>
        </div>
      </div>
    )
  }

  const filteredSessions = data?.sessions.filter((session: Session) =>
    session.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.workflow_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sessions</h1>
        <p className="text-gray-600 dark:text-gray-400">Browse and replay workflow execution history</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-shimmer h-4 w-3/4 mb-3 rounded"></div>
              <div className="animate-shimmer h-3 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Exchanges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSessions.map((session: Session) => (
                  <tr key={session.session_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(session.status)}
                        <div>
                          <div className="font-mono text-sm text-gray-900 dark:text-white">
                            {session.session_id.slice(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {session.session_id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.workflow_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {session.current_stage}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.message_count ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(session.status)}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(session.created_at), 'MMM d, HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        to={`/sessions/${session.session_id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        View
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.total > 50 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(page - 1) * 50 + 1} to {Math.min(page * 50, data.total)} of {data.total} sessions
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 50 >= data.total}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

