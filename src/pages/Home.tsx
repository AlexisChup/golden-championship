import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiTestExamples } from '../examples'

export default function Home() {
  const [showExamples, setShowExamples] = useState(false)

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-yellow-500">Golden Championship</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The premier platform for combat sports competition management.
          Organize tournaments, manage fighters, and track results all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/competitions"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            View Competitions
          </Link>
          <Link
            to="/register"
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Golden Championship?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Competition Management
            </h3>
            <p className="text-gray-600">
              Easily create and manage tournaments with our intuitive platform.
              Track brackets, schedules, and results in real-time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🥊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Fighter Profiles
            </h3>
            <p className="text-gray-600">
              Comprehensive fighter database with statistics, records, and performance analytics.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🥋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Club Registration
            </h3>
            <p className="text-gray-600">
              Register your club and manage your roster of fighters and coaches efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-800 text-white py-12 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">500+</div>
            <div className="text-gray-300">Active Fighters</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">150+</div>
            <div className="text-gray-300">Registered Clubs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">200+</div>
            <div className="text-gray-300">Competitions</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
            <div className="text-gray-300">Countries</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-50 p-12 rounded-lg text-center border-2 border-yellow-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Join thousands of fighters, clubs, and organizers who trust Golden Championship
          for their competition management needs.
        </p>
        <Link
          to="/register"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
        >
          Create Free Account
        </Link>
      </section>

      {/* Developer Examples Toggle */}
      {showExamples && (
        <div className="border-t-2 border-gray-200 pt-8">
          <ApiTestExamples />
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          {showExamples ? '▲ Hide Developer Examples' : '▼ Show Developer Examples'}
        </button>
      </div>
    </div>
  )
}
