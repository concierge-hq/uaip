import { Link } from 'react-router-dom'
import { 
  Home, Workflow, Activity, BarChart3, Settings, 
  Clock, CheckCircle,
  Zap, Users, ChevronRight
} from 'lucide-react'
import { useWorkflows } from '../hooks/useWorkflows'
import { useStats } from '../hooks/useStats'
import { AppHeader } from '../components/AppHeader'

export function Dashboard() {
  const { data: workflows, isLoading: workflowsLoading, error: workflowsError } = useWorkflows()
  const { data: stats, isLoading: statsLoading } = useStats()

  if (workflowsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-sm text-gray-600 mb-4">
            Unable to connect to the Concierge backend.
          </p>
          <code className="block text-xs bg-gray-50 p-3 rounded-lg text-left text-gray-700 mb-4">
            python3 server.py
          </code>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (workflowsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    )
  }

  // Platform metrics
  const mainStats = [
    {
      label: 'Active Workflows',
      value: stats?.workflows.active || 0,
      change: stats?.workflows.total ? `${stats.workflows.total} total` : null,
      icon: Workflow,
      color: 'indigo'
    },
    {
      label: 'Total Executions',
      value: stats?.executions.total || 0,
      change: stats?.executions.success ? `${stats.executions.success} successful` : null,
      icon: Zap,
      color: 'purple'
    },
    {
      label: 'Success Rate',
      value: stats?.performance.success_rate 
        ? `${(stats.performance.success_rate * 100).toFixed(1)}%` 
        : 'N/A',
      change: null,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Avg Duration',
      value: stats?.performance.avg_duration_ms 
        ? `${(stats.performance.avg_duration_ms / 1000).toFixed(2)}s`
        : 'N/A',
      change: null,
      icon: Clock,
      color: 'blue'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg">
                <Home className="w-4 h-4" />
                <span>Overview</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Workflow className="w-4 h-4" />
                <span>Workflows</span>
                <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded-full">{workflows?.length || 0}</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Settings
              </div>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Configuration</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Users className="w-4 h-4" />
                <span>Team</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-6">
            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <p className="text-sm text-gray-600 mt-1">Workflow orchestration platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {mainStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                    {stat.change && (
                      <div className="text-xs text-gray-500">
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Active Workflows */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Active Workflows</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows?.map((workflow) => (
                  <Link
                    key={workflow.name}
                    to={`/workflow/${workflow.name}`}
                    className="group border border-gray-200 rounded-lg p-4 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center">
                        <Workflow className="w-5 h-5 text-indigo-600" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <h4 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {workflow.description || workflow.name}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span>{workflow.stages.length} stages</span>
                      </div>
                      <span className="font-mono">{workflow.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
