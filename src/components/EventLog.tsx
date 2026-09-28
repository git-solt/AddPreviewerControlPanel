import { useEffect, useRef } from 'react'

export interface LogEvent {
  id: string
  timestamp: Date
  direction: 'sent' | 'received'
  type: string
  data: unknown
}

interface EventLogProps {
  events: LogEvent[]
}

export function EventLog({ events }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events])

  return (
    <div className="event-log">
      <h3>Meldingslogg</h3>
      <div className="log-content" ref={scrollRef}>
        {events.length === 0 ? (
          <div className="log-empty">Ingen meldinger ennå</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className={`log-entry log-${event.direction}`}>
              <div className="log-header">
                <span className="log-badge">{event.direction === 'sent' ? '↪️' : '↩️'}</span>
                <span className="log-type">{event.type}</span>
                <span className="log-time">{event.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="log-data">{JSON.stringify(event.data, null, 2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
