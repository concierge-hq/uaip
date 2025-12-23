import { ArrowRight, Sparkles, ShoppingCart, Car, MessageSquare, Compass, Shield, Zap, Globe, Lock, Network, X } from 'lucide-react'
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { analytics } from '../hooks/useAnalytics'

const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    analytics.waitlistClosed()
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const web3formsKey = '984cb571-76d2-4fa2-89f0-6a8dc3d338d0'
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: 'New Concierge Waitlist Signup',
          from_name: 'Concierge Waitlist',
          firstName, lastName, email,
        }),
      })
      
      if (response.ok) {
        analytics.waitlistSubmitted(email)
        setIsSubmitted(true)
        setTimeout(() => {
          setFirstName(''); setLastName(''); setEmail('')
          setIsSubmitted(false); onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 to-purple-900/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>
        {!isSubmitted ? (
          <>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Join the Waitlist</h2>
            <p className="text-gray-400 mb-6">Be among the first to experience the agentic web</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none text-white placeholder:text-gray-500"
                  placeholder="Nikola" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none text-white placeholder:text-gray-500"
                  placeholder="Tesla" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none text-white placeholder:text-gray-500"
                  placeholder="you@future.ai" />
              </div>
              <button type="submit" className="w-full px-6 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity">
                Join Waitlist
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">You're on the list!</h3>
            <p className="text-gray-400">We'll be in touch soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Use Cases Data
const useCases = [
  { icon: ShoppingCart, title: 'Smart Commerce', description: '"Order flowers for my fiancé tomorrow at 10am" - Type it, and watch your agent handle the purchase, delivery scheduling, and confirmation.', gradient: 'from-orange-500 to-pink-500' },
  { icon: Car, title: 'Real-World Logistics', description: '"Book a ride to the airport at 5am for my early flight". Your agent coordinates the pickup, handles payment, and sends you the confirmation.', gradient: 'from-green-500 to-teal-500' },
  { icon: MessageSquare, title: 'Cross-Platform Actions', description: '"Restock my groceries"—Your agent knows your preferences, finds the best prices, places the order, and schedules delivery.', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Compass, title: 'Complex Workflows', description: 'From multi-step bookings to enterprise portals—agents navigate intricate systems with deterministic precision.', gradient: 'from-purple-500 to-indigo-500' },
]

// Features Data
const features = [
  { icon: Shield, title: 'Mission-Critical Reliability', description: 'Built for environments where failure is not an option.' },
  { icon: Zap, title: 'Real-Time Execution', description: 'Sub-second action execution with live monitoring.' },
  { icon: Globe, title: 'Universal Protocol', description: 'Works with any web platform without custom integrations.' },
  { icon: Lock, title: 'Zero-Trust Security', description: 'Bank-grade encryption and complete audit trails.' },
]

export function MarketingLanding() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const navigate = useNavigate()

  const openWaitlist = () => {
    analytics.waitlistOpened()
    setIsWaitlistOpen(true)
  }

  const handleDemoClick = () => {
    analytics.demoBooked()
    analytics.externalLinkClicked('https://calendly.com/arnavbalyan1/new-meeting')
  }

  const handleEarlyAccessClick = () => {
    analytics.ctaClicked('early_access_nav')
    navigate('/app')
  }

  return (
    <div className="min-h-screen relative">
      {/* Deep Space Background */}
      <div className="fixed inset-0 bg-black -z-10" />
      
      {/* Starfield */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute w-px h-px bg-white rounded-full"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: 0.2 + Math.random() * 0.5 }} />
        ))}
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at top right, rgba(100,120,200,0.3), transparent 50%)' }} />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-gray-800/40 backdrop-blur-xl bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-800/40 border border-gray-700/50">
                <Network className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Concierge</span>
            </div>
            <button onClick={handleEarlyAccessClick} className="px-5 py-2 text-sm font-medium rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-all">
              Early Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/60 border border-purple-500/20 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-400">The wait is over. Come join us.</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white">
            Welcome to the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Agentic Web</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Expose your business to AI agents. Let agents order products, book rides, and transact on your platform by the agents, for the agents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={openWaitlist}
              className="group px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all shadow-lg hover:shadow-purple-500/25 hover:scale-105">
              Join Waitlist
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="https://calendly.com/arnavbalyan1/new-meeting" target="_blank" rel="noopener noreferrer" onClick={handleDemoClick}
              className="px-8 py-4 text-lg font-semibold rounded-xl bg-gray-800/80 text-white border border-purple-500/20 hover:border-purple-500/40 transition-all inline-block">
              Book a Demo
            </a>
          </div>
          
          <div className="mt-16 flex items-center justify-center space-x-12 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>Enterprise Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>SOC2 Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Enable <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">High Stake Agentic Interactions</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From critical transactions to complex enterprise workflows, Concierge ensures agents can act with confidence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <div key={index} className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800/80 to-purple-900/20 backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/30 transition-all hover:scale-[1.02]">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${useCase.gradient} mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{useCase.title}</h3>
                  <p className="text-gray-400">{useCase.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Built for <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">High Stakes Operations</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">The protocol that powers trusted agentic actions at scale</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-gray-700 hover:border-purple-500/40 transition-all">
                  <Icon className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-gray-800/80 to-purple-900/40 backdrop-blur-sm border border-purple-500/20 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                Join the <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Agentic Revolution</span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Be among the pioneers enabling AI agents to perform high stake actions. The future isn't coming—it's here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={openWaitlist}
                  className="group px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all shadow-lg hover:shadow-purple-500/25 hover:scale-105">
                  Join Waitlist
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="https://calendly.com/arnavbalyan1/new-meeting" target="_blank" rel="noopener noreferrer" onClick={handleDemoClick}
                  className="px-8 py-4 text-lg font-semibold rounded-xl bg-gray-800/80 text-white border border-purple-500/20 hover:border-purple-500/40 transition-all inline-block">
                  Book a Demo
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>© 2025 Concierge. Powering the protocol for high stake agentic interactions.</p>
        </footer>
      </section>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  )
}

