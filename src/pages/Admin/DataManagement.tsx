import { useState } from 'react'
import toast from 'react-hot-toast'
import { seedDev, seedDemo } from '../../data/seed'
import { validateGraph } from '../../data/validation'
import { clubsRepo, fightersRepo, competitionsRepo, bracketsRepo, matchesRepo } from '../../data/repositories'
import { PageHeader } from './DataManagement/PageHeader'
import { WarningBanner } from './DataManagement/WarningBanner'
import { DevSeedCard } from './DataManagement/DevSeedCard'
import { DemoSeedCard } from './DataManagement/DemoSeedCard'
import { ClearAllCard } from './DataManagement/ClearAllCard'
import { DiagnosticsCard } from './DataManagement/DiagnosticsCard'
import { ValidateCard } from './DataManagement/ValidateCard'
import { InfoFooter } from './DataManagement/InfoFooter'

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
        // Matches are now in matchesRepository
        const matches = matchesRepo.listByBracket(comp.id, bracket.id)
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
        <PageHeader />
        <WarningBanner />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DevSeedCard isLoading={isLoading} onDevSeed={handleDevSeed} />
          <DemoSeedCard isLoading={isLoading} onDemoSeed={handleDemoSeed} />
          <ClearAllCard isLoading={isLoading} onClearAll={handleClearAll} />
          <DiagnosticsCard isLoading={isLoading} onDiagnostics={handleRepoDiagnostics} />
          <ValidateCard isLoading={isLoading} onValidate={handleValidate} />
        </div>

        <InfoFooter />
      </div>
    </div>
  )
}
