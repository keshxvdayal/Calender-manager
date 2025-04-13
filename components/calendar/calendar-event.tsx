"use client"

import { useMemo } from "react"
import { useDrag } from "react-dnd"
import { parseISO, differenceInMinutes, format } from "date-fns"
import type { Event } from "@/lib/types"

interface CalendarEventProps {
  event: Event
  onClick: () => void
}

const categoryColors: Record<string, string> = {
  exercise: "bg-green-100 border-green-500 text-green-800",
  eating: "bg-yellow-100 border-yellow-500 text-yellow-800",
  work: "bg-blue-100 border-blue-500 text-blue-800",
  relax: "bg-purple-100 border-purple-500 text-purple-800",
  family: "bg-pink-100 border-pink-500 text-pink-800",
  social: "bg-orange-100 border-orange-500 text-orange-800",
}

const CalendarEvent = ({ event, onClick }: CalendarEventProps) => {
  const startTime = parseISO(event.startTime)
  const endTime = parseISO(event.endTime)
  const duration = differenceInMinutes(endTime, startTime)

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "event",
    item: { type: "event", event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const style = useMemo(() => {
    const startHour = startTime.getHours()
    const startMinute = startTime.getMinutes()
    const heightInPixels = (duration / 60) * 60 // 60px per hour

    return {
      top: `${startHour * 60 + startMinute}px`,
      height: `${heightInPixels}px`,
      opacity: isDragging ? 0.5 : 1,
    }
  }, [startTime, duration, isDragging])

  const colorClass = event.goalColor
    ? `bg-${event.goalColor}-100 border-${event.goalColor}-500 text-${event.goalColor}-800`
    : categoryColors[event.category] || "bg-gray-100 border-gray-500 text-gray-800"

  return (
    <div
      ref={dragRef}
      className={`absolute left-1 right-1 rounded-md border-l-4 p-1 overflow-hidden cursor-pointer ${colorClass}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <div className="text-xs font-semibold truncate">{format(startTime, "h:mm a")}</div>
      <div className="text-sm font-medium truncate">{event.title}</div>
    </div>
  )
}

export default CalendarEvent
