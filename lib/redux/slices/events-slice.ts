import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Event } from "@/lib/types"

interface EventsState {
  events: Event[]
  loading: boolean
  error: string | null
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
}

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await fetch("/api/events")
  if (!response.ok) {
    throw new Error("Failed to fetch events")
  }
  return response.json()
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData: Omit<Event, "_id">) => {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  })
  if (!response.ok) {
    throw new Error("Failed to create event")
  }
  return response.json()
})

export const updateEvent = createAsyncThunk("events/updateEvent", async (eventData: Event) => {
  const response = await fetch(`/api/events/${eventData._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  })
  if (!response.ok) {
    throw new Error("Failed to update event")
  }
  return response.json()
})

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (eventId: string) => {
  const response = await fetch(`/api/events/${eventId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete event")
  }
  return eventId
})

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch events"
      })

      // Create event
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload)
      })

      // Update event
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.events.findIndex((e) => e._id === action.payload._id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
      })

      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter((e) => e._id !== action.payload)
      })
  },
})

export default eventsSlice.reducer
