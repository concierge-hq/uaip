import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Activity,
  Database,
  Code
} from 'lucide-react'
import { useSessionDetail } from '../hooks/useSessionDetail'
import { format } from 'date-fns'

export function SessionReplay() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { data: session, isLoading } = useSessionDetail(sessionId || null)
  const [currentStep, setCurrentStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'state' | 'communication'>('state')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Session not found</h3>
          <Link to="/sessions" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to sessions
          </Link>
        </div>
      </div>
    )
  }

  const history = session.history || []
  const currentSnapshot = history[currentStep]
  const communicationLog = session.communication_log || []

  const handleStepChange = (newStep: number) => {
    setCurrentStep(Math.max(0, Math.min(newStep, history.length - 1)))
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/sessions"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Session Replay</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{session.session_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Activity className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{session.workflow_name}</span>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              session.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
              session.status === 'failed' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
              'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            }`}>
              {session.status}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Timeline Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Timeline</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">{history.length} steps</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {history.map((snapshot, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  index === currentStep
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    index === currentStep
                      ? 'bg-indigo-100 dark:bg-indigo-900/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {snapshot.action || snapshot.stage}
                    </div>
                    {snapshot.task && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{snapshot.task}</div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {format(new Date(snapshot.timestamp), 'HH:mm:ss')}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Playback Controls */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleStepChange(currentStep - 1)}
                disabled={currentStep === 0}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                {playing ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={() => handleStepChange(currentStep + 1)}
                disabled={currentStep === history.length - 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="mt-3">
              <input
                type="range"
                min="0"
                max={history.length - 1}
                value={currentStep}
                onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('state')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'state'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  State
                </div>
              </button>
              <button
                onClick={() => setActiveTab('communication')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'communication'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Communication Log
                </div>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'state' && currentSnapshot && (
              <div className="space-y-6">
                {/* Current Step Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Step Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Stage</div>
                      <div className="font-medium text-gray-900 dark:text-white">{currentSnapshot.stage}</div>
                    </div>
                    {currentSnapshot.task && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Task</div>
                        <div className="font-medium text-gray-900 dark:text-white">{currentSnapshot.task}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Timestamp</div>
                      <div className="font-medium text-gray-900 dark:text-white font-mono">
                        {format(new Date(currentSnapshot.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Action</div>
                      <div className="font-medium text-gray-900 dark:text-white">{currentSnapshot.action}</div>
                    </div>
                  </div>
                </div>

                {/* State Data */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">State Data</h3>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-900 dark:text-gray-100">
                    {JSON.stringify(currentSnapshot.state, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div className="space-y-4">
                {communicationLog.map((exchange) => (
                  <div
                    key={exchange.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          exchange.direction === 'request'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        }`}>
                          {exchange.direction}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Sequence #{exchange.sequence_number}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {exchange.timestamp && format(new Date(exchange.timestamp), 'HH:mm:ss.SSS')}
                      </div>
                    </div>
                    <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-900 dark:text-gray-100">
                      {JSON.stringify(exchange.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

