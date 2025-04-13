"use client"

import { useMemo } from "react"
import { useDispatch } from "react-redux"
import { format, isSameDay, addMinutes, parseISO } from "date-fns"
import { useDrop } from "react-dnd"
import type { Event, Task } from "@/lib/types"
import CalendarEvent from "./calendar-event"
import { updateEvent, createEvent } from "@/lib/redux/slices/events-slice"
import type { AppDispatch } from "@/lib/redux/store"
import React from "react"

interface CalendarGridProps {
  days: Date[]
  events: Event[]
  onSlotClick: (date: Date, hour: number, minute: number) => void
  onEventClick: (event: Event) => void
}

// Create a new CalendarCell component
const CalendarCell = React.memo(({ day, hour, onSlotClick, handleDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["task"],
    drop: (item: { type: string; task: Task; goalColor: string }) => {
      handleDrop(item, day, hour)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`h-[60px] border-t ${isOver ? "bg-blue-50" : ""}`}
      onClick={() => onSlotClick(day, hour, 0)}
    />
  )
})

const CalendarGrid = ({ days, events, onSlotClick, onEventClick }: CalendarGridProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Group events by day and hour
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, Event[]> = {}

    days.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      grouped[dateStr] = events.filter((event) => {
        const eventDate = parseISO(event.startTime)
        return isSameDay(eventDate, day)
      })
    })

    return grouped
  }, [days, events])

  const cellData = useMemo(() => {
    const data: { [key: string]: { isOver: boolean; dropRef: any } } = {}
    
    // Pre-calculate all the keys
    days.forEach((day) => {
      hours.forEach((hour) => {
        const key = `${format(day, "yyyy-MM-dd")}-${hour}`
        data[key] = {
          isOver: false,
          dropRef: null,
        }
      })
    })

    return data
  }, [days, hours])

  // Create drop refs at the top level
  days.forEach((day) => {
    hours.forEach((hour) => {
      const key = `${format(day, "yyyy-MM-dd")}-${hour}`
      const [dropRef, isOver] = useDrop(() => ({
        accept: ["event", "task"],
        drop: (item) => handleDrop(item, day, hour),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }))

      // Update the cellData
      cellData[key].dropRef = dropRef
      cellData[key].isOver = isOver
    })
  })

  const handleDrop = (item: any, date: Date, hour: number) => {
    if (item.type === "event") {
      // Handle event drag and drop
      const updatedEvent = {
        ...item.event,
        startTime: format(new Date(date.setHours(hour, 0, 0)), "yyyy-MM-dd'T'HH:mm"),
        endTime: format(
          addMinutes(
            new Date(date.setHours(hour, 0, 0)),
            new Date(item.event.endTime).getTime() - new Date(item.event.startTime).getTime(),
          ),
          "yyyy-MM-dd'T'HH:mm",
        ),
      }
      dispatch(updateEvent(updatedEvent))
    } else if (item.type === "task") {
      // When a task is dropped, open the modal with pre-populated data
      onSlotClick(date, hour, 0, {
        task: item.task,
        goalColor: item.goalColor
      })
    }
  }

  return (
    <div className="relative grid grid-cols-7 h-[1440px]">
      {/* Time labels */}
      <div className="absolute -left-16 top-0 w-16 h-full">
        {hours.map((hour) => (
          <div key={hour} className="h-[60px] border-t flex items-start justify-end pr-2 text-sm text-gray-500">
            {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="relative border-r last:border-r-0">
          {hours.map((hour) => (
            <CalendarCell
              key={`${format(day, "yyyy-MM-dd")}-${hour}`}
              day={day}
              hour={hour}
              onSlotClick={onSlotClick}
              handleDrop={handleDrop}
            />
          ))}

          {/* Render events for this day */}
          {eventsByDay[format(day, "yyyy-MM-dd")]?.map((event) => (
            <CalendarEvent key={event._id} event={event} onClick={() => onEventClick(event)} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default CalendarGrid
