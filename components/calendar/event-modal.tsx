"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { format } from "date-fns"
import { Tag, CalendarIcon, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createEvent, updateEvent, deleteEvent } from "@/lib/redux/slices/events-slice"
import type { Event } from "@/lib/types"
import type { AppDispatch } from "@/lib/redux/store"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  selectedSlot: {
    date: Date
    hour: number
    minute: number
  } | null
  taskData?: {
    goalColor: string
    task: {
      goalId: string
    }
  } | null
}

const categories = ["exercise", "eating", "work", "relax", "family", "social"]

const EventModal = ({ isOpen, onClose, event, selectedSlot, taskData = null }: EventModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("work")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setCategory(event.category)
      setStartTime(format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm"))
      setEndTime(format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm"))
    } else if (selectedSlot) {
      const date = selectedSlot.date
      const startDate = new Date(date)
      startDate.setHours(selectedSlot.hour, selectedSlot.minute)

      const endDate = new Date(startDate)
      endDate.setMinutes(endDate.getMinutes() + 30)

      setTitle(taskData ? taskData.task.title : "")
      setCategory("work")
      setStartTime(format(startDate, "yyyy-MM-dd'T'HH:mm"))
      setEndTime(format(endDate, "yyyy-MM-dd'T'HH:mm"))
    }
  }, [event, selectedSlot, taskData])

  const handleSubmit = () => {
    if (!title.trim()) return

    const eventData = {
      title,
      category,
      startTime,
      endTime,
      goalColor: taskData?.goalColor,
      goalId: taskData?.task.goalId,
    }

    if (event) {
      dispatch(updateEvent({ ...eventData, _id: event._id }))
    } else {
      dispatch(createEvent(eventData))
    }

    onClose()
  }

  const handleDelete = () => {
    if (event) {
      dispatch(deleteEvent(event._id))
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">{event ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-gray-500" />
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-gray-500" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          {event && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{event ? "Update Event" : "Create Event"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EventModal
