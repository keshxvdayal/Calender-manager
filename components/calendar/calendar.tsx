"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import CalendarHeader from "./calendar-header"
import CalendarGrid from "./calendar-grid"
import Sidebar from "./sidebar"
import EventModal from "./event-modal"
import { fetchEvents } from "@/lib/redux/slices/events-slice"
import { fetchGoals } from "@/lib/redux/slices/goals-slice"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import type { Event } from "@/lib/types"

const Calendar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week" | "month" | "year">("week")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date
    hour: number
    minute: number
  } | null>(null)
  const [taskData, setTaskData] = useState(null)

  const { events, loading: eventsLoading } = useSelector((state: RootState) => state.events)
  const { goals, tasks, selectedGoal, loading: goalsLoading } = useSelector((state: RootState) => state.goals)

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchGoals())
  }, [dispatch])

  const handlePrevious = () => {
    if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleViewChange = (newView: "day" | "week" | "month" | "year") => {
    setView(newView)
  }

  const handleSlotClick = (date: Date, hour: number, minute: number, dropData = null) => {
    setSelectedSlot({ date, hour, minute })
    setTaskData(dropData)
    setSelectedEvent(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setSelectedSlot(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setSelectedSlot(null)
  }

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex ">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleToday}>
                Today
              </Button>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold md:block hidden">
                {format(days[0], "MMMM d")} - {format(days[6], "MMMM d, yyyy")}
              </h2>
            </div>
            <div className="flex space-x-2">
              <Button variant={view === "day" ? "default" : "outline"} onClick={() => handleViewChange("day")}>
                Day
              </Button>
              <Button variant={view === "week" ? "default" : "outline"} onClick={() => handleViewChange("week")}>
                Week
              </Button>
              <Button variant={view === "month" ? "default" : "outline"} onClick={() => handleViewChange("month")}>
                Month
              </Button>
              <Button variant={view === "year" ? "default" : "outline"} onClick={() => handleViewChange("year")}>
                Year
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <CalendarHeader days={days} />
            <CalendarGrid days={days} events={events} onSlotClick={handleSlotClick} onEventClick={handleEventClick} />
          </div>
        </div>
        {isModalOpen && (
          <EventModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            event={selectedEvent}
            selectedSlot={selectedSlot}
            taskData={taskData}
          />
        )}
      </div>
    </DndProvider>
  )
}

export default Calendar
