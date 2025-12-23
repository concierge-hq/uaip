import { Link } from 'react-router-dom'
import { 
  Workflow, 
  Zap, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react'
import { useWorkflows } from '../hooks/useWorkflows'
import { useStats } from '../hooks/useStats'

export function Dashboard() {
  const { data: workflows, isLoading: workflowsLoading, error: workflowsError } = useWorkflows()
  const { data: stats, isLoading: statsLoading } = useStats()

  if (workflowsError) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Unable to connect to the Concierge backend.
          </p>
          <code className="block text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-left text-gray-700 dark:text-gray-300 mb-4">
            concierge serve --config your_workflow.yaml
          </code>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (workflowsLoading || statsLoading) {
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

  // Format trend - invertForDuration means lower is better (negative = good)
  const formatTrend = (value: number | undefined, invertForDuration = false): { text: string; isImprovement: boolean; showArrow: boolean } => {
    if (value === undefined || value === null || isNaN(value)) {
      return { text: '', isImprovement: true, showArrow: false }
    }
    
    if (value === 0) {
      return { text: '0%', isImprovement: true, showArrow: false }
    }
    
    // For duration: negative is good (faster). For others: positive is good.
    const isImprovement = invertForDuration ? value < 0 : value > 0
    const sign = value > 0 ? '+' : ''
    return { text: `${sign}${value.toFixed(0)}%`, isImprovement, showArrow: isImprovement }
  }

  // Styling: green with arrow for improvements, gray for non-improvements
  const getTrendStyle = (isImprovement: boolean): string => {
    return isImprovement 
      ? 'text-emerald-600 dark:text-emerald-400'  // Green for improvements
      : 'text-gray-400 dark:text-gray-500'        // Subtle gray otherwise
  }

  const execTrend = formatTrend(stats?.trends?.executions)
  const rateTrend = formatTrend(stats?.trends?.success_rate)
  const durTrend = formatTrend(stats?.trends?.duration, true)  // invert: lower duration is better

  const mainStats = [
    {
      label: 'Active Workflows',
      value: stats?.workflows.active || 0,
      change: `${stats?.workflows.total || 0} total`,
      icon: Workflow,
      color: 'indigo',
      trendInfo: { text: '', isImprovement: true, showArrow: false },
      trendStyle: 'text-gray-400'
    },
    {
      label: 'Total Executions',
      value: stats?.executions.total || 0,
      change: `${stats?.executions.success || 0} successful`,
      icon: Zap,
      color: 'purple',
      trendInfo: execTrend,
      trendStyle: getTrendStyle(execTrend.isImprovement)
    },
    {
      label: 'Success Rate',
      value: stats?.performance.success_rate 
        ? `${(stats.performance.success_rate * 100).toFixed(1)}%` 
        : 'N/A',
      change: 'Last 24 hours',
      icon: CheckCircle,
      color: 'green',
      trendInfo: rateTrend,
      trendStyle: getTrendStyle(rateTrend.isImprovement)
    },
    {
      label: 'Avg Duration',
      value: stats?.performance.avg_duration_ms 
        ? `${(stats.performance.avg_duration_ms / 1000).toFixed(2)}s`
        : 'N/A',
      change: 'Per execution',
      icon: Clock,
      color: 'blue',
      trendInfo: durTrend,
      trendStyle: getTrendStyle(durTrend.isImprovement)
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Workflow orchestration and execution metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat) => {
          const colorClasses = {
            indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
            purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
            green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
            blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
          }
          const colors = colorClasses[stat.color as keyof typeof colorClasses]
          
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                {stat.trendInfo.text && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendStyle}`}>
                    {stat.trendInfo.showArrow && <TrendingUp className="w-3 h-3" />}
                    {stat.trendInfo.text}
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{stat.change}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Workflows */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Workflows</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{workflows?.length || 0} workflows available</p>
            </div>
            <Link
              to="/workflows"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {workflows?.slice(0, 4).map((workflow) => (
              <Link
                key={workflow.name}
                to={`/workflows/${workflow.name}`}
                className="group block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center">
                      <Workflow className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {workflow.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {workflow.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">Active</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-3">
            <Link
              to="/sessions"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    View Sessions
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Recent executions</div>
                </div>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Analytics
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Performance metrics</div>
                </div>
              </div>
            </Link>
          </div>

          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">System Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Healthy</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              All services operational
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


