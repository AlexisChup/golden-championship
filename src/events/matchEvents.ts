/**
 * Event system for match result propagation
 * Unidirectional flow: match update → event → parent slot population → UI re-render
 */

import type { Match } from '../types/Match'

export type MatchResultRecordedEvent = {
  type: 'MATCH_RESULT_RECORDED'
  matchId: number
  winnerId: number | null
  competitionId: number
  bracketId: number | null
  nextMatchId: number | null
}

type EventHandler = (event: MatchResultRecordedEvent) => void

class MatchEventBus {
  private handlers: EventHandler[] = []

  subscribe(handler: EventHandler): () => void {
    this.handlers.push(handler)
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler)
    }
  }

  emit(event: MatchResultRecordedEvent): void {
    this.handlers.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error('[MatchEventBus] Handler error:', error)
      }
    })
  }
}

export const matchEventBus = new MatchEventBus()

/**
 * Emit match result recorded event
 * Triggers automatic propagation to parent match
 */
export const emitMatchResultRecorded = (match: Match, winnerId: number | null): void => {
  matchEventBus.emit({
    type: 'MATCH_RESULT_RECORDED',
    matchId: match.id,
    winnerId,
    competitionId: match.competitionId,
    bracketId: match.bracketId,
    nextMatchId: match.nextMatchId,
  })
}
