import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import toast from 'react-hot-toast'
import { seedDev, seedDemo } from '../../data/seed'
import { validateGraph } from '../../data/validation'
import { clubsRepo, fightersRepo, competitionsRepo, bracketsRepo } from '../../data/repositories'

export default function DataManagement() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDevSeed = async () => {
    if (!confirm('Generate development dataset? This will clear all existing data.')) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      seedDev()
      toast.success('Development dataset generated successfully')
    } catch (error) {
      console.error('[Dev Seed Error]', error)
      toast.error('Failed to generate development dataset')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoSeed = async () => {
    if (!confirm('Generate demonstration dataset? This will clear all existing data and create visualization-ready brackets.')) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      seedDemo()
      toast.success('Demonstration dataset generated successfully')
    } catch (error) {
      console.error('[Demo Seed Error]', error)
      toast.error('Failed to generate demonstration dataset')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Clear ALL data? This action cannot be undone.')) return
    if (!confirm('Are you absolutely sure? All clubs, fighters, competitions, and brackets will be permanently deleted.')) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Clear all repositories
      const competitions = competitionsRepo.getAll()
      competitions.forEach(comp => {
        // Delete brackets first
        const brackets = bracketsRepo.getAllForCompetition(comp.id)
        brackets.forEach(bracket => {
          bracketsRepo.delete(comp.id, bracket.id)
        })
        // Then delete competition
        competitionsRepo.delete(comp.id)
      })
      
      const fighters = fightersRepo.getAll()
      fighters.forEach(fighter => fightersRepo.delete(fighter.id))
      
      const clubs = clubsRepo.getAll()
      clubs.forEach(club => clubsRepo.delete(club.id))
      
      toast.success('All data cleared successfully')
    } catch (error) {
      console.error('[Clear All Error]', error)
      toast.error('Failed to clear data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRepoDiagnostics = () => {
    const clubs = clubsRepo.getAll()
    const fighters = fightersRepo.getAll()
    const competitions = competitionsRepo.getAll()
    
    let totalBrackets = 0
    let totalMatches = 0
    competitions.forEach(comp => {
      const brackets = bracketsRepo.getAllForCompetition(comp.id)
      totalBrackets += brackets.length
      brackets.forEach(bracket => {
        const matches = bracketsRepo.getMatches(comp.id, bracket.id)
        totalMatches += matches.length
      })
    })
    
    // Estimate storage size
    const clubsSize = JSON.stringify(clubs).length
    const fightersSize = JSON.stringify(fighters).length
    const competitionsSize = JSON.stringify(competitions).length
    const totalSize = clubsSize + fightersSize + competitionsSize
    
    console.group('📊 Repository Diagnostics')
    console.log('Clubs:', clubs.length, `(${(clubsSize / 1024).toFixed(2)} KB)`)
    console.log('Fighters:', fighters.length, `(${(fightersSize / 1024).toFixed(2)} KB)`)
    console.log('Competitions:', competitions.length, `(${(competitionsSize / 1024).toFixed(2)} KB)`)
    console.log('Brackets:', totalBrackets)
    console.log('Matches:', totalMatches)
    console.log('Total Storage:', `~${(totalSize / 1024).toFixed(2)} KB`)
    console.groupEnd()
    
    toast.success(`Diagnostics printed to console (${clubs.length} clubs, ${fighters.length} fighters, ${competitions.length} competitions)`)
  }

  const handleValidate = () => {
    try {
      const result = validateGraph()
      
      if (result.valid) {
        toast.success('Graph validation passed - all data is consistent')
      } else {
        toast.error(`Graph validation failed: ${result.errors.length} error(s) found - see console for details`)
      }
    } catch (error) {
      console.error('[Validation Error]', error)
      toast.error('Validation failed with unexpected error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Management</h1>
          <p className="text-gray-600">
            Centralized control for seeding, clearing, and validating application data
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Admin Area</h3>
              <p className="text-sm text-yellow-700 mt-1">
                These operations modify global data. Use with caution.
              </p>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dev Seed */}
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Development Seed</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Generate a small, fast dataset for development (Romanian names, ~5-10 clubs, ~20-30 fighters)
              </p>
              <Button
                onClick={handleDevSeed}
                disabled={isLoading}
                variant="primary"
                className="w-full"
              >
                {isLoading ? 'Generating...' : 'Generate Dev Data'}
              </Button>
            </div>
          </Card>

          {/* Demo Seed */}
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Demo Seed</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Generate rich demonstration data with pre-built brackets ready for visualization
              </p>
              <Button
                onClick={handleDemoSeed}
                disabled={isLoading}
                variant="primary"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Generating...' : 'Generate Demo Data'}
              </Button>
            </div>
          </Card>

          {/* Clear All */}
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Clear All Data</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Permanently delete all clubs, fighters, competitions, and brackets
              </p>
              <Button
                onClick={handleClearAll}
                disabled={isLoading}
                variant="primary"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isLoading ? 'Clearing...' : 'Clear All Data'}
              </Button>
            </div>
          </Card>

          {/* Repo Diagnostics */}
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Repository Diagnostics</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Print entity counts and storage estimates to browser console
              </p>
              <Button
                onClick={handleRepoDiagnostics}
                disabled={isLoading}
                variant="secondary"
                className="w-full"
              >
                Print Diagnostics
              </Button>
            </div>
          </Card>

          {/* Validate Graph */}
          <Card className="md:col-span-2">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Validate Data Graph</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Check referential integrity: orphaned fighters, invalid club references, broken competition links
              </p>
              <Button
                onClick={handleValidate}
                disabled={isLoading}
                variant="secondary"
                className="w-full"
              >
                Run Validation
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> All operations use the repository layer exclusively. 
            Check browser console (F12) for detailed logs and diagnostics.
          </p>
        </div>
      </div>
    </div>
  )
}
