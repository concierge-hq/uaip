import { Activity, Bell, Search, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AppHeader() {

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 tracking-tight">Concierge</h1>
              <p className="text-[10px] text-gray-500 leading-none">Workflow Orchestration</p>
            </div>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-4 h-4 text-gray-600" />
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

