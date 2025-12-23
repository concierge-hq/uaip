import { useState } from 'react'
import { Upload, GitBranch, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE_URL } from '../config'

export function Deploy() {
  const { getToken, userId } = useAuth()
  const [workflowName, setWorkflowName] = useState('')
  const [gitUrl, setGitUrl] = useState('')
  const [envVarsText, setEnvVarsText] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null)

  const parseEnvVars = (text: string): Record<string, string> | undefined => {
    if (!text.trim()) return undefined
    const vars: Record<string, string> = {}
    text.split('\n').forEach(line => {
      const [key, ...rest] = line.split('=')
      if (key?.trim() && rest.length) vars[key.trim()] = rest.join('=').trim()
    })
    return Object.keys(vars).length ? vars : undefined
  }

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDeploying(true)
    setResult(null)

    try {
      const token = await getToken()
      const response = await fetch(`${API_BASE_URL}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: userId,
          workflow_name: workflowName,
          git_url: gitUrl,
          env_vars: parseEnvVars(envVarsText),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: `Workflow deployed successfully!`,
          data,
        })
        setWorkflowName('')
        setGitUrl('')
        setEnvVarsText('')
      } else {
        setResult({
          success: false,
          message: data.detail || 'Deployment failed',
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      })
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Deploy Workflow</h1>
        <p className="text-gray-600 dark:text-gray-400">Deploy a workflow from Git repository</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={handleDeploy} className="space-y-6">
          <div>
            <label htmlFor="workflowName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workflow Name
            </label>
            <input
              id="workflowName"
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="my_workflow"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="gitUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Git Repository URL
              </div>
            </label>
            <input
              id="gitUrl"
              type="url"
              value={gitUrl}
              onChange={(e) => setGitUrl(e.target.value)}
              placeholder="https://github.com/user/repo.git"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Repository must contain workflow.py at the root
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
            </button>
            {showAdvanced && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Environment Variables (one per line: KEY=value)
                </label>
                <textarea
                  value={envVarsText}
                  onChange={(e) => setEnvVarsText(e.target.value)}
                  placeholder="BLOCK_API_KEY=your_key_here&#10;OTHER_VAR=value"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isDeploying}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Deploy Workflow
              </>
            )}
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${
            result.success
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  result.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                }`}>
                  {result.message}
                </p>
                {result.data && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p>Workflow ID: <code className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">{result.data.workflow_id}</code></p>
                    <p>
                      Name: <code className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">{result.data.workflow_name}</code>
                      {result.data.canonical_name && result.data.canonical_name !== result.data.workflow_name && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          (internal: {result.data.canonical_name})
                        </span>
                      )}
                    </p>
                    <p>Deployed to: <code className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">{result.data.worker_host}:{result.data.worker_port}</code></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

