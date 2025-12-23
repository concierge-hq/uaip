import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Shield, BarChart3, Sparkles } from 'lucide-react'
import { analytics } from '../hooks/useAnalytics'

export function Landing() {
  const navigate = useNavigate()

  const handleSignInClick = () => analytics.signInClicked()
  const handleSignUpClick = () => analytics.signUpClicked()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Concierge
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton 
              mode="modal"
              appearance={{
                elements: {
                  footer: { display: "none" },
                  footerAction: { display: "none" }
                }
              }}
            >
              <button onClick={handleSignInClick} className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton 
              mode="modal"
              appearance={{
                elements: {
                  footer: { display: "none" },
                  footerAction: { display: "none" }
                }
              }}
            >
              <button onClick={handleSignUpClick} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all"
            >
              Dashboard
            </button>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  footer: { display: "none" },
                  footerAction: { display: "none" }
                }
              }}
            />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Agentic Web Interfaces
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Build your business
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              on the Agentic Web
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Concierge transforms complex workflows into beautiful, intelligent interfaces. 
            Design once, deploy everywhere with declarative AI-powered automation.
          </p>

          <div className="flex items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton 
                mode="modal"
                appearance={{
                  elements: {
                    footer: { display: "none" },
                    footerAction: { display: "none" }
                  }
                }}
              >
                <button onClick={handleSignUpClick} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                  Start Building
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <SignInButton 
                mode="modal"
                appearance={{
                  elements: {
                    footer: { display: "none" },
                    footerAction: { display: "none" }
                  }
                }}
              >
                <button onClick={handleSignInClick} className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignedIn>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Built on modern React and FastAPI for blazing performance and real-time updates.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure by Default</h3>
            <p className="text-gray-600">
              Enterprise-grade authentication and session management with PostgreSQL persistence.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Ready</h3>
            <p className="text-gray-600">
              Track every interaction with built-in analytics and session replay capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2025 Concierge. Built with ❤️ for modern workflows.</p>
        </div>
      </footer>
    </div>
  )
}

